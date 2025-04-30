import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { CreateTicketForm } from "@/components/tickets/create-ticket-form";
import { FoodCategory, OrgDeliveryCapability } from "@/types";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { BackButton } from "@/components/ui/back-button";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    console.log("Current user for ticket creation:", currentUser);
    
    if (currentUser && currentUser.name) {
      setOrganizationName(currentUser.name);
      setOrganizationId(currentUser.id || "");
    } else {
      console.warn("No user data found in localStorage");
      setOrganizationName("Unknown Organization");
    }
  }, []);
  
  const handleCreateTicket = (ticketData: {
    foodType: string;
    category: FoodCategory;
    weight: number;
    pieces?: number;
    expiryDate: string;
    notes?: string;
    otherCategory?: string;
    deliveryCapability: OrgDeliveryCapability;
  }) => {
    console.log("Creating ticket for organization:", organizationName, "with ID:", organizationId);
    
    const isFactoryDelivery = ticketData.deliveryCapability === "factory-only";
    const factoryData = isFactoryDelivery ? {
      factoryId: "factory-1",
      factoryName: "Eco Processing Factory",
      isExpired: true,
      status: "pending" as const,
      conversionStatus: "pending" as const,
    } : {};
    
    const newTicket = {
      id: Math.random().toString(36).substr(2, 9),
      organizationId,
      organizationName,
      ...ticketData,
      ...factoryData,
      createdAt: new Date().toISOString(),
      status: isFactoryDelivery ? "expired" : "pending",
    };
    
    const existingTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    localStorage.setItem("foodTickets", JSON.stringify([...existingTickets, newTicket]));
    
    console.log("Ticket created:", newTicket);
    
    setIsDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    navigate("/organization");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <EditableWrapper onSave={(value) => console.log("Header edited:", value)}>
            <h1 className="text-lg font-medium">Create Food Ticket</h1>
          </EditableWrapper>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <EditableWrapper onSave={(value) => console.log("Title edited:", value)}>
            <h1 className="text-2xl font-bold text-charity-primary mb-1">Share Food Donation</h1>
          </EditableWrapper>
          <EditableWrapper onSave={(value) => console.log("Description edited:", value)}>
            <p className="text-muted-foreground">
              Create a ticket to share excess food with nearby charities
            </p>
          </EditableWrapper>
        </div>

        <CreateTicketForm 
          organizationName={organizationName}
          onSubmit={handleCreateTicket}
        />
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <EditableWrapper onSave={(value) => console.log("Dialog title edited:", value)}>
              <DialogTitle>Ticket Created Successfully!</DialogTitle>
            </EditableWrapper>
            <EditableWrapper onSave={(value) => console.log("Dialog description edited:", value)}>
              <DialogDescription>
                Your food donation ticket has been shared with nearby charities.
                You'll be notified when a charity accepts your donation.
              </DialogDescription>
            </EditableWrapper>
          </DialogHeader>
          
          <DialogFooter>
            <EditableWrapper onSave={(value) => console.log("Button text edited:", value)}>
              <Button 
                onClick={handleDialogClose}
                className="bg-charity-primary hover:bg-charity-dark"
              >
                Return to Home
              </Button>
            </EditableWrapper>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav userRole="organization" />
    </div>
  );
}
