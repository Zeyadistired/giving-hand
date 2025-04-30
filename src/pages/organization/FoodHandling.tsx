
import { useNavigate } from "react-router-dom";
import { Refrigerator, Boxes, PackageCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { EditableWrapper } from "@/components/ui/editable-wrapper";

export default function FoodHandling() {
  const navigate = useNavigate();

  const guidelines = [
    {
      icon: Refrigerator,
      title: "Keep food in refrigerator",
      description: "Store perishable foods at appropriate temperatures to maintain freshness and safety.",
    },
    {
      icon: Boxes,
      title: "Keep every food kind separated",
      description: "Separate different types of food to prevent cross-contamination and maintain quality.",
    },
    {
      icon: PackageCheck,
      title: "Easily spoiled food has to be in a sealed box",
      description: "Use airtight containers for foods that spoil quickly to extend shelf life and prevent contamination.",
    },
    {
      icon: Heart,
      title: "Deliver the food safely",
      description: "Ensure proper handling during transport to maintain food quality and safety standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <EditableWrapper onSave={(value) => console.log("Header edited:", value)}>
            <h1 className="text-lg font-medium">Food Handling Instructions</h1>
          </EditableWrapper>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <EditableWrapper onSave={(value) => console.log("Title edited:", value)}>
            <h1 className="text-2xl font-bold text-charity-primary mb-1">How to Handle Food Properly</h1>
          </EditableWrapper>
          <EditableWrapper onSave={(value) => console.log("Description edited:", value)}>
            <p className="text-muted-foreground">
              Follow these guidelines to ensure food safety and quality
            </p>
          </EditableWrapper>
        </div>

        <div className="space-y-4 mb-8">
          {guidelines.map((guideline, index) => (
            <Card key={index} className="overflow-hidden border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="bg-charity-light p-3 rounded-full mr-4">
                    <guideline.icon className="h-6 w-6 text-charity-primary" />
                  </div>
                  <div>
                    <EditableWrapper onSave={(value) => console.log(`Guideline ${index + 1} title edited:`, value)}>
                      <h3 className="font-medium text-charity-primary">{guideline.title}</h3>
                    </EditableWrapper>
                    <EditableWrapper onSave={(value) => console.log(`Guideline ${index + 1} description edited:`, value)}>
                      <p className="text-sm text-muted-foreground mt-1">
                        {guideline.description}
                      </p>
                    </EditableWrapper>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <EditableWrapper onSave={(value) => console.log("Footer text edited:", value)}>
            <p className="text-sm text-center text-muted-foreground px-4">
              Following these guidelines helps ensure that donated food remains safe and high-quality
              for those in need. Thank you for your contribution to food safety!
            </p>
          </EditableWrapper>
          
          <EditableWrapper onSave={(value) => console.log("Button text edited:", value)}>
            <Button 
              className="w-full bg-charity-primary hover:bg-charity-dark"
              onClick={() => navigate("/organization")}
            >
              <Heart className="h-4 w-4 mr-2" />
              Stay Safe
            </Button>
          </EditableWrapper>
        </div>
      </main>

      <BottomNav userRole="organization" />
    </div>
  );
}
