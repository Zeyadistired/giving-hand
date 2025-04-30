
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PaymentMethodSelector } from "@/components/payment/PaymentMethodSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionCompleted?: () => void;
}

export function SubscriptionDialog({ 
  open, 
  onOpenChange, 
  onSubscriptionCompleted 
}: SubscriptionDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "fawry">("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
    
    if (formatted && !/^\d{4}( \d{4}){3}$/.test(formatted)) {
      setErrors(prev => ({ ...prev, cardNumber: "Card number must be 16 digits" }));
    } else {
      setErrors(prev => {
        const { cardNumber, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    setExpiryDate(value);
    
    if (value && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      setErrors(prev => ({ ...prev, expiryDate: "Invalid expiry date (MM/YY)" }));
    } else {
      setErrors(prev => {
        const { expiryDate, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.slice(0, 4));
    
    if (value && !/^\d{3,4}$/.test(value)) {
      setErrors(prev => ({ ...prev, cvv: "CVV must be 3 or 4 digits" }));
    } else {
      setErrors(prev => {
        const { cvv, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobileNumber(value);
    
    if (value && !/^01[0-9]{9}$/.test(value)) {
      setErrors(prev => ({ ...prev, mobileNumber: "Must be 11 digits starting with 01" }));
    } else {
      setErrors(prev => {
        const { mobileNumber, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before proceeding");
      return;
    }
    
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !/^\d{4}( \d{4}){3}$/.test(cardNumber)) {
        newErrors.cardNumber = "Valid card number is required";
        isValid = false;
      }
      if (!expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Valid expiry date is required";
        isValid = false;
      }
      if (!cvv || !/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = "Valid CVV is required";
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
    
    // Store subscription status in localStorage for persistence
    localStorage.setItem("isPremiumSubscribed", "true");
    
    // Call the callback function to update subscription status
    if (onSubscriptionCompleted) {
      onSubscriptionCompleted();
    } else {
      toast.success("Subscription activated successfully!");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to Premium Reports</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the subscription
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubscribe} className="space-y-6">
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
                  <p className="text-red-500 text-xs">{errors.cardNumber}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-xs">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    className={errors.cvv ? "border-red-500" : ""}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-xs">{errors.cvv}</p>
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
              <p className="text-xs text-muted-foreground mt-2">
                You will receive a Fawry payment code via SMS
              </p>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-charity-primary hover:bg-charity-dark"
          >
            Subscribe - 500 EGP/month
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
