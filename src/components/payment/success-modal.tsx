import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PromoCode {
  code: string;
  discount: string;
  note: string;
}

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  amount: string
  charityName: string
  phone?: string
  paymentMethod: "visa" | "fawry"
  promoCode: PromoCode | null
}

export function SuccessModal({
  isOpen,
  onClose,
  name,
  amount,
  charityName,
  phone,
  paymentMethod,
  promoCode
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Thank You for Your Donation!</h3>
            <p className="text-slate-600">
              Your donation of ${amount} to {charityName} has been successfully processed.
            </p>
          </div>

          {promoCode && (
            <div className="w-full mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-green-700 font-semibold">🎁 Promo Code</h4>
                <span className="text-green-600 font-mono text-lg">{promoCode.code}</span>
              </div>
              <p className="text-green-600 text-sm">{promoCode.note}</p>
            </div>
          )}

          <div className="w-full pt-4">
            <Button
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 