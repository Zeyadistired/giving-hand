
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Pizza, Building2, ShoppingBag, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collaboration } from "@/types";
import { EditableWrapper } from "@/components/ui/editable-wrapper";

// Mock data for collaborations
const mockCollaborations: Collaboration[] = [
  {
    id: "1",
    ticketId: "101",
    charityId: "c1",
    charityName: "Your Charity",
    organizationId: "4",
    organizationName: "Skyline Restaurant",
    foodDetails: "Assorted Buffet Items (5.2kg) - Prepared Meals",
    date: "2025-04-15T14:30:00.000Z",
    deliveryMethod: "self-pickup",
  },
  {
    id: "2",
    ticketId: "102",
    charityId: "c1",
    charityName: "Your Charity",
    organizationId: "1",
    organizationName: "Gourmet Palace Hotel",
    foodDetails: "Breakfast Pastries (3.8kg) - Bakery Items",
    date: "2025-04-10T09:45:00.000Z",
    deliveryMethod: "organization-delivery",
  },
  {
    id: "3",
    ticketId: "103",
    charityId: "c1",
    charityName: "Your Charity",
    organizationId: "2",
    organizationName: "Fresh Market Supermarket",
    foodDetails: "Fresh Produce (7.5kg) - Fruits and Vegetables",
    date: "2025-04-05T11:15:00.000Z",
    deliveryMethod: "shipping",
  },
  {
    id: "4",
    ticketId: "104",
    charityId: "c1",
    charityName: "Your Charity",
    organizationId: "3",
    organizationName: "Fathalla Supermarket",
    foodDetails: "Dairy Products (4.2kg) - Milk and Yogurt",
    date: "2025-04-01T16:20:00.000Z",
    deliveryMethod: "self-pickup",
  },
];

export default function Collaborations() {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };
  
  const getOrgIcon = (orgName: string) => {
    if (orgName.includes("Restaurant")) return <Pizza className="h-5 w-5 text-charity-tertiary" />;
    if (orgName.includes("Hotel")) return <Building2 className="h-5 w-5 text-charity-tertiary" />;
    return <ShoppingBag className="h-5 w-5 text-charity-tertiary" />;
  };
  
  const getDeliveryMethodLabel = (method: string) => {
    const labels = {
      "self-pickup": "Self Pickup",
      "organization-delivery": "Organization Delivery",
      "shipping": "Third-Party Shipping",
    };
    return labels[method as keyof typeof labels] || method;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <EditableWrapper onSave={(value) => console.log("Header title edited:", value)}>
            <h1 className="text-lg font-medium">Collaborations</h1>
          </EditableWrapper>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-charity-primary"
          >
            <History className="h-4 w-4 mr-1.5" />
            <EditableWrapper onSave={(value) => console.log("History button text edited:", value)}>
              <span>History</span>
            </EditableWrapper>
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <EditableWrapper onSave={(value) => console.log("Page title edited:", value)}>
            <h1 className="text-2xl font-bold text-charity-primary mb-1">Your Collaborations</h1>
          </EditableWrapper>
          <EditableWrapper onSave={(value) => console.log("Page description edited:", value)}>
            <p className="text-muted-foreground">
              Track your food donation collaborations
            </p>
          </EditableWrapper>
        </div>

        <div className="space-y-4">
          {mockCollaborations.map(collab => (
            <Card key={collab.id} className="overflow-hidden border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-charity-light p-2 rounded-full mr-3">
                      {getOrgIcon(collab.organizationName)}
                    </div>
                    <div>
                      <EditableWrapper onSave={(value) => console.log(`Organization ${collab.id} name edited:`, value)}>
                        <h3 className="font-medium text-charity-primary">{collab.organizationName}</h3>
                      </EditableWrapper>
                      <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <EditableWrapper onSave={(value) => console.log(`Date ${collab.id} edited:`, value)}>
                          <span>{formatDate(collab.date)}</span>
                        </EditableWrapper>
                      </div>
                    </div>
                  </div>
                  <EditableWrapper onSave={(value) => console.log(`Delivery method ${collab.id} edited:`, value)}>
                    <Badge className="bg-charity-tertiary hover:bg-charity-tertiary/90">
                      {getDeliveryMethodLabel(collab.deliveryMethod)}
                    </Badge>
                  </EditableWrapper>
                </div>
                
                <EditableWrapper onSave={(value) => console.log(`Food details ${collab.id} edited:`, value)} multiline={true}>
                  <p className="text-sm mt-2">{collab.foodDetails}</p>
                </EditableWrapper>
                
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Collaboration ID: </span>
                  <span className="font-mono">{collab.id}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav userRole="charity" />
    </div>
  );
}
