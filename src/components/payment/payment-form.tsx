import { CreditCard, Smartphone, DollarSign, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Charity } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PaymentMethodSelector, PaymentMethod } from "./PaymentMethodSelector";

interface PaymentFormProps {
  charity: Charity;
}

type ValidationState = {
  cardNumber: boolean;
  cardholderName: boolean;
  expiryDate: boolean;
  cvv: boolean;
  mobileNumber: boolean;
  amount: boolean;
};

export function PaymentForm({ charity }: PaymentFormProps) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState<ValidationState>({
    cardNumber: false,
    cardholderName: false,
    expiryDate: false,
    cvv: false,
    mobileNumber: false,
    amount: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    const numericAmount = parseFloat(value);
    const isValid = value !== "" && numericAmount >= 5;
    setValidated(prev => ({ ...prev, amount: isValid }));
    
    if (!value) {
      setErrors(prev => ({ ...prev, amount: "Amount is required" }));
    } else if (numericAmount < 5) {
      setErrors(prev => ({ ...prev, amount: `Minimum donation amount is 5 ${currency}` }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
    
    const isValid = /^\d{4}( \d{4}){3}$/.test(formatted) || (value.length === 16 && formatted.replace(/\s/g, '').length === 16);
    setValidated(prev => ({ ...prev, cardNumber: isValid }));
    
    if (formatted && !isValid) {
      setErrors(prev => ({ ...prev, cardNumber: "Card number must be 16 digits" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setExpiryDate(value);
    
    const isValidFormat = /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
    
    if (value && value.includes('/')) {
      const [month, year] = value.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      const isValidDate = parseInt(month) >= 1 && 
                          parseInt(month) <= 12 && 
                          (parseInt(year) > currentYear || 
                          (parseInt(year) === currentYear && parseInt(month) >= currentMonth));
      
      setValidated(prev => ({ ...prev, expiryDate: isValidFormat && isValidDate }));
      
      if (!isValidFormat) {
        setErrors(prev => ({ ...prev, expiryDate: "Format must be MM/YY" }));
      } else if (!isValidDate) {
        setErrors(prev => ({ ...prev, expiryDate: "Date cannot be in the past" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.expiryDate;
          return newErrors;
        });
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) {
      setCvv(value.slice(0, 4));
    } else {
      setCvv(value);
    }
    
    const isValid = /^\d{3,4}$/.test(value);
    setValidated(prev => ({ ...prev, cvv: isValid }));
    
    if (value && !isValid) {
      setErrors(prev => ({ ...prev, cvv: "CVV must be 3 or 4 digits" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cvv;
        return newErrors;
      });
    }
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobileNumber(value);
    
    const isValid = /^01[0-9]{9}$/.test(value);
    setValidated(prev => ({ ...prev, mobileNumber: isValid }));
    
    if (value && !isValid) {
      setErrors(prev => ({ ...prev, mobileNumber: "Must be 11 digits starting with 01" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.mobileNumber;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    const numericAmount = parseFloat(amount);
    if (!amount || numericAmount < 5) {
      newErrors.amount = `Minimum donation amount is 5 ${currency}`;
      isValid = false;
    }
    
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !/^\d{4}( \d{4}){3}$/.test(cardNumber)) {
        newErrors.cardNumber = "Valid card number is required";
        isValid = false;
      }
      
      if (!cardholderName || cardholderName.trim().length < 3) {
        newErrors.cardholderName = "Cardholder name is required";
        isValid = false;
      }
      
      if (!expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Valid expiry date is required (MM/YY)";
        isValid = false;
      }
      
      if (!cvv || !/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = "Valid CVV is required (3-4 digits)";
        isValid = false;
      }
    } else if (paymentMethod === "fawry") {
      if (!mobileNumber || !/^01[0-9]{9}$/.test(mobileNumber)) {
        newErrors.mobileNumber = "Valid Egyptian mobile number is required";
        isValid = false;
      }
    }
    
    if (!isValid) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const donationAmount = parseFloat(amount);
      navigate(`/thank-you?charity=${charity.name}&amount=${donationAmount}&currency=${currency}`);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <LoaderCircle className="animate-spin w-8 h-8 mb-3 text-charity-primary" />
          <p className="text-sm text-muted-foreground">Processing your donation...</p>
        </div>
      ) : (
        <>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />

          {paymentMethod === "credit-card" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={errors.cardNumber ? "border-red-500" : ""}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholder-name">Cardholder Name</Label>
                <Input
                  id="cardholder-name"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className={errors.cardholderName ? "border-red-500" : ""}
                />
                {errors.cardholderName && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Input
                    id="expiry-date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    type="password"
                    className={errors.cvv ? "border-red-500" : ""}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="mobile-number">Mobile Number</Label>
              <Input
                id="mobile-number"
                placeholder="01XXXXXXXXX"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                className={errors.mobileNumber ? "border-red-500" : ""}
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
              )}
              <p className="text-xs text-muted-foreground">
                You will be redirected to the Fawry app to complete your payment.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount</Label>
            <div className="relative flex gap-2">
              <Select
                value={currency}
                onValueChange={setCurrency}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EGP">EGP</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  type="number"
                  min="1"
                  step="0.01"
                  className={errors.amount ? "border-red-500" : ""}
                />
              </div>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full bg-charity-primary hover:bg-charity-dark"
          >
            Complete Donation
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Your payment information is secure and encrypted.
          </p>
        </>
      )}
    </form>
  );
}
