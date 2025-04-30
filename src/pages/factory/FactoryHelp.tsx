
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileQuestion, Recycle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function FactoryHelp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/factory")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Help Center</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charity-primary mb-1">Factory Help Center</h1>
          <p className="text-muted-foreground">
            Learn about the food conversion process
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileQuestion className="h-6 w-6 text-blue-700" />
              </div>
              <h2 className="text-lg font-semibold">How Factory Mode Works</h2>
            </div>
            <p className="text-muted-foreground mb-3">
              As a factory user, you receive expired food from organizations that can be converted into animal food.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You'll see incoming requests from organizations on your dashboard</li>
              <li>You can accept or reject these requests based on your capacity</li>
              <li>After processing the food, mark it as "Converted" to complete the cycle</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Recycle className="h-6 w-6 text-green-700" />
              </div>
              <h2 className="text-lg font-semibold">Benefits of Food Conversion</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reduces food waste by repurposing expired food</li>
              <li>Creates value from what would otherwise be thrown away</li>
              <li>Supports local animal shelters with converted food products</li>
              <li>Helps organizations dispose of expired food responsibly</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Check className="h-6 w-6 text-amber-700" />
              </div>
              <h2 className="text-lg font-semibold">Best Practices</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process food requests promptly to maintain freshness</li>
              <li>Maintain proper records of all conversions</li>
              <li>Clearly communicate with organizations about acceptance/rejection</li>
              <li>Follow food safety guidelines even for expired food</li>
            </ul>
          </div>
        </div>
      </main>

      <BottomNav userRole="factory" />
    </div>
  );
}
