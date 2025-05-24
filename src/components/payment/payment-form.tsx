"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CreditCard, DollarSign, Lock, Receipt, User, Phone, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Charity } from "@/types"
import { cn } from "@/lib/utils"
import { SuccessModal } from "./success-modal"
import { createMoneyDonation } from "@/utils/donations"
import { toast } from "sonner"

interface PaymentFormProps {
  charity: Charity
}

interface FormErrors {
  general?: string;  // For general form errors
  amount?: string;
  name?: string;
  phone?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
}

interface PromoCode {
  code: string;
  discount: string;
  note: string;
}

// Simplified card type detection
type CardType = 'visa' | 'mastercard' | 'unknown';

const CARD_PATTERNS = {
  visa: /^4[0-9]{15}$/,
  mastercard: /^5[1-5][0-9]{14}$/
} as const;

// Production-ready card validation
const isValidCardNumber = (num: string): { isValid: boolean; type: CardType } => {
  const cleaned = num.replace(/\s+/g, '');
  
  // Validate length and digits
  if (!/^\d{16}$/.test(cleaned)) {
    return { isValid: false, type: 'unknown' };
  }

  // Detect card type
  let type: CardType = 'unknown';
  if (CARD_PATTERNS.visa.test(cleaned)) {
    type = 'visa';
  } else if (CARD_PATTERNS.mastercard.test(cleaned)) {
    type = 'mastercard';
  }

  // Luhn algorithm check
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }

  return { 
    isValid: sum % 10 === 0,
    type
  };
};

// Add helper text for card validation
// const CARD_HELP_TEXT = { ... }

export function PaymentForm({ charity }: PaymentFormProps) {
  const [amount, setAmount] = useState<string>("25")
  const [paymentMethod, setPaymentMethod] = useState<"visa" | "fawry">("visa")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [cvc, setCvc] = useState<string>("")
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [cardType, setCardType] = useState<CardType>('unknown');
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);

  // Clear all errors
  const clearErrors = () => setErrors({})

  // Add helper function to check if date is in the future
  const isFutureDate = (date: string): boolean => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) return false;
    const [month, year] = date.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    return year > currentYear || (year === currentYear && month > currentMonth);
  };

  // Add debug logging for form state
  const logFormState = () => {
    console.log('Form State:', {
      amount,
      paymentMethod,
      name,
      phone,
      cardNumber,
      expiryDate,
      cvc,
      errors,
      isProcessing,
      cardType
    });
  };

  // Update validateForm to be more explicit
  const validateForm = (): boolean => {
    clearErrors();
    const newErrors: FormErrors = {};
    let isValid = true;

    // Log validation start
    console.log('Starting form validation...');

    // Always validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
      isValid = false;
    } else if (numAmount > 10000) {
      newErrors.amount = "Maximum donation amount is $10,000";
      isValid = false;
    }

    // Always validate name
    if (!name.trim()) {
      newErrors.name = "Please enter your full name";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
      isValid = false;
    }

    // Validate based on payment method
    if (paymentMethod === "visa") {
      // Validate card number
      const cleanedCard = cardNumber.replace(/\s+/g, '');
      const { isValid: isCardValid, type } = isValidCardNumber(cleanedCard);
      
      if (!isCardValid) {
        newErrors.cardNumber = "Please enter a valid card number";
        isValid = false;
      }

      // Validate expiry date
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Expiry must be in MM/YY format";
        isValid = false;
      } else if (!isFutureDate(expiryDate)) {
        newErrors.expiryDate = "Card has expired. Please enter a valid expiry date";
        isValid = false;
      }

      // Validate CVC
      if (!/^\d{3}$/.test(cvc)) {
        newErrors.cvc = "CVC must be exactly 3 digits";
        isValid = false;
      }
    } else {
      // Validate phone for Fawry
      if (!/^01[0125][0-9]{8}$/.test(phone)) {
        newErrors.phone = "Please enter a valid Egyptian phone number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    console.log('Validation result:', { isValid, errors: newErrors });
    return isValid;
  };

  // Update handleSubmit to include promo code generation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started...');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      toast.error("Please fix the errors in the form");
      return;
    }

    console.log('Form validation passed, starting submission...');
    setIsProcessing(true);

    try {
      const donationData = {
        amount: parseFloat(amount),
        charity_id: charity.id,
        payment_method: paymentMethod,
        donor_name: name,
        donor_phone: paymentMethod === "fawry" ? phone : undefined,
        notes: paymentMethod === "visa" 
          ? `Donation to ${charity.name} via ${paymentMethod}. Card ending in ${cardNumber.slice(-4)}, expires ${expiryDate}`
          : `Donation to ${charity.name} via ${paymentMethod}`
      };

      console.log('Submitting donation:', donationData);

      const donation = await createMoneyDonation(donationData);
      console.log('Donation successful:', donation);

      // Generate promo code for donations over $100
      if (parseFloat(amount) > 100) {
        const discounts = ["10%", "15%", "20%", "25%", "30%"];
        const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
        const promoCode = `GIVE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        setPromoCode({
          code: promoCode,
          discount: randomDiscount,
          note: `Use this code to get ${randomDiscount} off at participating restaurants, hotels, or supermarkets!`
        });
      }

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Donation error:', error);
      toast.error(error.message || 'Failed to process donation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentMethodChange = (method: "visa" | "fawry") => {
    setPaymentMethod(method)
    clearErrors()
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);

    // Validate card number
    if (formatted.replace(/\s/g, '').length === 16) {
      const { isValid, type } = isValidCardNumber(formatted);
      setCardType(type);
      
      if (!isValid) {
        setErrors(prev => ({
          ...prev,
          cardNumber: "Please enter a valid card number"
        }));
      } else {
        setErrors(prev => ({ ...prev, cardNumber: undefined }));
      }
    } else {
      setErrors(prev => ({ ...prev, cardNumber: undefined }));
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2)
    setExpiryDate(value)
  }

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3)
    setCvc(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setPhone(value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
  }

  const predefinedAmounts = ["10", "25", "50", "100"]

  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        noValidate // Add this to prevent browser validation
      >
        <div className="space-y-4">
          <Label className="text-base font-medium">Donation Amount</Label>
          <div className="grid grid-cols-4 gap-3">
            {predefinedAmounts.map((presetAmount) => (
              <Button
                key={presetAmount}
                type="button"
                variant={amount === presetAmount ? "default" : "outline"}
                className={cn("h-12 text-base", amount === presetAmount && "border-2 border-primary")}
                onClick={() => handleAmountChange(presetAmount)}
              >
                ${presetAmount}
              </Button>
            ))}
          </div>

          <div className="relative mt-2">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={cn("pl-10 h-12 text-lg", errors.amount && "border-red-500")}
              placeholder="Other amount"
              min="1"
              max="10000"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Payment Method</Label>
          <RadioGroup defaultValue="visa" className="grid grid-cols-2 gap-3">
            <div>
              <RadioGroupItem
                value="visa"
                id="visa"
                className="peer sr-only"
                checked={paymentMethod === "visa"}
                onClick={() => handlePaymentMethodChange("visa")}
              />
              <Label
                htmlFor="visa"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-2 h-6 w-6 text-slate-500" />
                Visa/Mastercard
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="fawry"
                id="fawry"
                className="peer sr-only"
                checked={paymentMethod === "fawry"}
                onClick={() => handlePaymentMethodChange("fawry")}
              />
              <Label
                htmlFor="fawry"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Receipt className="mb-2 h-6 w-6 text-slate-500" />
                Fawry
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "fawry" && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Personal Information</Label>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="name" 
                    placeholder="Enter your full name" 
                    value={name}
                    onChange={handleNameChange}
                    className={cn("pl-10", errors.name && "border-red-500")}
                    required 
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Egyptian Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="phone" 
                    placeholder="01XXXXXXXXX" 
                    value={phone}
                    onChange={handlePhoneChange}
                    className={cn("pl-10", errors.phone && "border-red-500")}
                    required 
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "visa" && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Payment Information</Label>
              <div className="flex items-center text-sm text-slate-500">
                <Lock className="h-4 w-4 mr-1" />
                Secure Payment
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name on Card</Label>
                <Input 
                  id="name" 
                  placeholder="John Smith" 
                  value={name}
                  onChange={handleNameChange}
                  className={cn(errors.name && "border-red-500")}
                  required 
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="card">Card Number</Label>
                  {cardType !== 'unknown' && (
                    <span className="text-xs font-medium text-slate-600 capitalize">
                      {cardType} Card
                    </span>
                  )}
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                    id="card" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={cn(
                      "pl-10",
                      errors.cardNumber && "border-red-500",
                      !errors.cardNumber && cardNumber.replace(/\s/g, '').length === 16 && "border-green-500"
                    )}
                    maxLength={19}
                    required 
                  />
                  {!errors.cardNumber && cardNumber.replace(/\s/g, '').length === 16 && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY" 
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className={cn(
                      errors.expiryDate && "border-red-500",
                      !errors.expiryDate && expiryDate.length === 5 && isFutureDate(expiryDate) && "border-green-500"
                    )}
                    maxLength={5}
                    required 
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input 
                    id="cvc" 
                    placeholder="123" 
                    type="password"
                    value={cvc}
                    onChange={handleCVCChange}
                    className={cn(
                      errors.cvc && "border-red-500",
                      !errors.cvc && cvc.length === 3 && "border-green-500"
                    )}
                    maxLength={3}
                    required 
                  />
                  {errors.cvc && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.cvc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium" 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              `Donate $${amount} ${paymentMethod === "visa" ? "with Card" : "using Fawry"}`
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-slate-500">
            Your donation to {charity.name} may be tax-deductible.
          </p>
        </div>
      </form>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setPromoCode(null); // Reset promo code when modal is closed
        }}
        name={name}
        amount={amount}
        charityName={charity.name}
        phone={phone}
        paymentMethod={paymentMethod}
        promoCode={promoCode}
      />
    </>
  )
}
