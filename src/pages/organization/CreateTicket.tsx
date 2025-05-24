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
import { createFoodTicket } from "@/utils/tickets";
import { toast } from "sonner";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleCreateTicket = async (ticketData: {
    foodType: string;
    category: FoodCategory;
    weight: number;
    pieces?: number;
    expiryDate: string;
    notes?: string;
    otherCategory?: string;
    deliveryCapability: OrgDeliveryCapability;
    pickupLocation: string;
    preferredPickupFrom: string;
    preferredPickupTo: string;
  }) => {
    try {
      setIsSubmitting(true);
      console.log("Creating ticket for organization:", organizationName, "with ID:", organizationId);
      
      // Determine if this is expired food for factory processing
      const isExpired = new Date(ticketData.expiryDate) < new Date();
      const isFactoryDelivery = ticketData.deliveryCapability === "factory-only";
      
      // Explicitly set food type for logging
      const food_type = isFactoryDelivery || isExpired ? "expiry" : "regular";
      console.log("Setting food_type to:", food_type);
      
      const factoryData = isFactoryDelivery || isExpired ? {
        factoryId: "factory-1",
        factoryName: "Eco Processing Factory",
        isExpired: true,
        status: "pending" as const,
        foodType: "expiry", // Explicitly set foodType for factory tickets
        conversionStatus: "pending" as const,
      } : {};
      
      const newTicket = {
        organizationId,
        organizationName,
        ...ticketData,
        ...factoryData,
        status: (isFactoryDelivery || isExpired) ? "expired" as const : "pending" as const,
        createdAt: new Date().toISOString(),
        isExpired: (isFactoryDelivery || isExpired), // Explicitly set isExpired flag
        foodType: food_type, // Explicitly set the food type
      };
      
      console.log("Final ticket data before saving:", newTicket);
      
      // Save to Supabase
      const savedTicket = await createFoodTicket(newTicket);
      console.log("Ticket created in Supabase:", savedTicket);
      
      // Also save to localStorage for offline access
      const existingTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
      const updatedTickets = [...existingTickets, savedTicket];
      console.log("Saving tickets to localStorage:", updatedTickets);
      localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
      
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error creating ticket:", error);
      // Show more detailed error message
      if (error instanceof Error) {
        toast.error(`Failed to create ticket: ${error.message}`);
      } else {
        toast.error("Failed to create ticket. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
