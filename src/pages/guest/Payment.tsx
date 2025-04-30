import { useNavigate, useParams } from "react-router-dom";
import { PaymentForm } from "@/components/payment/payment-form";
import { BackButton } from "@/components/ui/back-button";
import { Charity, CharityType, CharityCategory } from "@/types";

// Mock data for demonstration
const mockCharities: Record<string, Charity> = {
  "1": {
    id: "1",
    name: "Hope for Kids",
    type: "charity",
    category: "children",
    email: "kids@hope.org",
    description: "Supporting children in need with meals, education, and care.",
  },
  "2": {
    id: "2",
    name: "Elderly Care Foundation",
    type: "charity",
    category: "elderly",
    email: "info@elderlycare.org",
    description: "Supporting the elderly community through food and essentials donations.",
  },
  "3": {
    id: "3",
    name: "Green Life Food Bank",
    type: "charity",
    category: "foodbank",
    email: "help@greenlife.org",
    description: "Fighting hunger and food insecurity in our local communities.",
  },
  // More charities...
};

export default function Payment() {
  const navigate = useNavigate();
  const { charityId } = useParams(); // Get charityId from URL

  console.log("Charity ID:", charityId); // Debugging line

  // If charityId exists, use it, otherwise default to "Hope for Kids"
  const selectedCharity = charityId && mockCharities[charityId] 
    ? mockCharities[charityId] 
    : mockCharities["1"]; // Default to "Hope for Kids" if charityId doesn't exist

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <h1 className="text-lg font-medium">Donation Payment</h1>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-charity-primary mb-2">{selectedCharity.name}</h2>
          <p className="text-muted-foreground text-sm">{selectedCharity.description}</p>
        </div>

        <PaymentForm charity={selectedCharity} />
      </main>
    </div>
  );
}