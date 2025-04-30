
import { CreditCard, Smartphone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type PaymentMethod = "credit-card" | "fawry";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ 
  selectedMethod, 
  onMethodChange 
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Select Payment Method</Label>
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        className="grid gap-3"
      >
        <div className={`flex items-center space-x-3 rounded-lg border p-4 ${
          selectedMethod === "credit-card" ? "border-charity-primary bg-charity-light" : ""
        }`}>
          <RadioGroupItem value="credit-card" id="credit-card" className="border-charity-primary" />
          <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
            <CreditCard className="mr-2 h-5 w-5 text-charity-primary" />
            Pay with Credit or Debit Card
          </Label>
        </div>

        <div className={`flex items-center space-x-3 rounded-lg border p-4 ${
          selectedMethod === "fawry" ? "border-charity-primary bg-charity-light" : ""
        }`}>
          <RadioGroupItem value="fawry" id="fawry" className="border-charity-primary" />
          <Label htmlFor="fawry" className="flex items-center cursor-pointer">
            <Smartphone className="mr-2 h-5 w-5 text-charity-primary" />
            Fawry Pay
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
