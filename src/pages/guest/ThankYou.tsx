import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Gift, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { BottomNav } from "@/components/ui/bottom-nav";
import { BackButton } from "@/components/ui/back-button";

// Mock list of organizations for discount generation
const organizations = [
  "Royal Cuisine Restaurant",
  "Skyline Hotel & Resort",
  "Fresh Market Supermarket",
  "Gourmet Delight Bakery",
  "Sea Breeze Restaurant",
];

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [organization, setOrganization] = useState<string | null>(null);
  
  // Parse the URL parameters
  const params = new URLSearchParams(location.search);
  const charityName = params.get("charity") || "the charity";
  const amount = parseFloat(params.get("amount") || "0");
  
  useEffect(() => {
    // Generate discount if donation amount is >= 100
    if (amount >= 100) {
      // Generate random discount between 10-20%
      const discount = Math.floor(Math.random() * 11) + 10;
      setDiscountPercent(discount);
      
      // Generate random organization
      const randomOrg = organizations[Math.floor(Math.random() * organizations.length)];
      setOrganization(randomOrg);
      
      // Generate random discount code
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "GIV";
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setDiscountCode(code);
    }
  }, [amount]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center">
          <BackButton />
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8 pb-20 text-center">
        <div className="w-16 h-16 rounded-full bg-charity-accent/10 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-charity-accent" />
        </div>
        
        <h1 className="text-2xl font-bold text-charity-primary mb-3">Thank You!</h1>
        
        <p className="text-lg mb-6">
          Your donation of <span className="font-semibold">EGP {amount.toFixed(2)}</span> to {charityName} has been received.
        </p>
        
        <p className="text-muted-foreground mb-8">
          Your generosity helps provide essential support to those in need.
        </p>
        
        {discountCode && discountPercent && organization && (
          <div className="w-full max-w-sm bg-charity-light rounded-lg p-5 mb-8">
            <div className="flex items-center justify-center mb-3">
              <Gift className="h-6 w-6 mr-2 text-charity-primary" />
              <h2 className="text-lg font-medium text-charity-primary">Special Reward</h2>
            </div>
            
            <p className="mb-4">
              Thank you for your generous donation! Enjoy a {discountPercent}% discount at {organization}.
            </p>
            
            <div className="bg-white border rounded-md p-3 font-mono font-semibold text-lg text-charity-primary mb-3">
              {discountCode}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Show this code when visiting the establishment to claim your discount. Valid for 30 days.
            </p>
          </div>
        )}
        
        <Button
          className="bg-charity-primary hover:bg-charity-dark w-full max-w-sm"
          onClick={() => navigate("/guest")}
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </main>

      <BottomNav userRole="guest" />
    </div>
  );
}
