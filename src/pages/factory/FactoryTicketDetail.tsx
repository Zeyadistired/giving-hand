import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Recycle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { FoodTicket, DeliveryMethod } from "@/types";
import { getUserSession } from "@/utils/auth";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/utils/supabaseClient";
import { createFactoryRequest, updateFactoryRequest, getFactoryRequests } from "@/utils/tickets";

export default function FactoryTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<FoodTicket | null>(null);
  const [factory, setFactory] = useState({
    name: "",
    id: ""
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("self-pickup");
  const [showDeliverySelect, setShowDeliverySelect] = useState(false);

  // Helper function to check if ticket is expired
  const isTicketExpired = (expiryDate: string) => {
    try {
      const expiry = new Date(expiryDate);
      const now = new Date();
      return expiry < now;
    } catch (error) {
      console.error("Error checking expiry date:", error);
      return false;
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      console.log("Date string is null or undefined");
      return "Not provided";
    }

    try {
      console.log("Formatting date string:", dateString);
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        console.error("Invalid date object created from:", dateString);
        return "Invalid date";
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error for string:", dateString, error);
      return "Invalid date";
    }
  };

  useEffect(() => {
    const currentUser = getUserSession();
    if (currentUser) {
      setFactory({
        name: currentUser.name,
        id: currentUser.id
      });
    }

    if (!ticketId) {
      navigate("/factory");
      return;
    }

    const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    const foundTicket = loadedTickets.find((t: FoodTicket) => t.id === ticketId);

    if (!foundTicket) {
      navigate("/factory");
      return;
    }

    setTicket(foundTicket);
  }, [ticketId, navigate]);

  const handleAccept = () => {
    if (!ticket) return;

    // Check if ticket is expired and show appropriate message
    if (isTicketExpired(ticket.expiryDate)) {
      console.log("Accepting expired ticket - this is allowed for factory processing");
    }

    setShowDeliverySelect(true);
  };

  const handleConfirmAccept = async () => {
    if (!ticket || !ticketId) {
      console.error("Missing ticket or ticketId:", { ticket, ticketId });
      toast.error("Failed to accept request: Missing ticket information");
      return;
    }

    try {
      console.log("Attempting to accept ticket with ID:", ticketId);
      console.log("Ticket expiry date:", ticket.expiryDate);
      console.log("Is expired:", isTicketExpired(ticket.expiryDate));

      // Check if we have a valid Supabase client
      if (!supabase) {
        console.error("Supabase client is not initialized");
        toast.error("Database connection error");
        return;
      }

      // First check if the ticket exists in Supabase
      try {
        const { data: existingTicket, error: fetchError } = await supabase
          .from("food_tickets")
          .select("*")
          .eq("id", ticketId)
          .single();

        if (fetchError) {
          console.error("Error fetching ticket:", fetchError);

          // If the ticket doesn't exist in Supabase yet, let's create it
          if (fetchError.code === "PGRST116") {
            console.log("Ticket not found in database, creating it first");

            // Create the ticket in Supabase with all required fields
            const { data: newTicket, error: createError } = await supabase
              .from("food_tickets")
              .insert([{
                id: ticketId,
                food_type: ticket.foodType === 'expiry' ? 'expiry' : ticket.foodType,
                category: ticket.category,
                weight: ticket.weight,
                pieces: ticket.pieces || null,
                organization_id: ticket.organizationId,
                organization_name: ticket.organizationName,
                status: "pending",
                expiry_date: ticket.expiryDate,
                pickup_location: ticket.pickupLocation || "Not specified",
                preferred_pickup_from: ticket.preferredPickupFrom || "09:00",
                preferred_pickup_to: ticket.preferredPickupTo || "17:00",
                notes: ticket.notes || null,
                delivery_capability: ticket.deliveryCapability || "factory-only",
                is_expired: isTicketExpired(ticket.expiryDate),
                created_at: ticket.createdAt || new Date().toISOString()
              }])
              .select();

            if (createError) {
              console.error("Error creating ticket:", createError);
              toast.error(`Failed to create ticket: ${createError.message}`);
              return;
            }

            console.log("Successfully created ticket:", newTicket);
          } else {
            toast.error(`Failed to find ticket: ${fetchError.message}`);
            return;
          }
        } else {
          console.log("Found existing ticket:", existingTicket);
        }
      } catch (error) {
        console.error("Error in ticket existence check:", error);
        toast.error("Failed to verify ticket");
        return;
      }

      // Now update the ticket
      try {
        console.log("Updating ticket with data:", {
          status: "accepted",
          factory_id: factory.id,
          factory_name: factory.name
        });

        const { data, error } = await supabase
          .from("food_tickets")
          .update({
            status: "accepted",
            factory_id: factory.id,
            factory_name: factory.name
          })
          .eq("id", ticketId)
          .select();

        if (error) {
          console.error("Supabase update error:", error);
          toast.error(`Update failed: ${error.message}`);
          return;
        }

        console.log("Update successful, response:", data);
      } catch (error) {
        console.error("Error in update operation:", error);
        toast.error("Failed to update ticket status");
        return;
      }

      // Create factory request record
      try {
        console.log("Creating factory request record");
        const factoryRequestData = {
          ticketId: ticketId,
          factoryId: factory.id,
          factoryName: factory.name,
          organizationId: ticket.organizationId,
          organizationName: ticket.organizationName,
          foodType: ticket.foodType,
          weight: ticket.weight,
          status: 'accepted' as const,
          notes: `Accepted via factory dashboard. Delivery method: ${deliveryMethod}`
        };

        const factoryRequest = await createFactoryRequest(factoryRequestData);
        console.log("Factory request created successfully:", factoryRequest);
      } catch (error) {
        console.error("Error creating factory request:", error);
        // Don't fail the whole operation if factory request creation fails
        toast.error("Warning: Factory request record could not be created");
      }

      // Update local state
      try {
        const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
        const updatedTickets = loadedTickets.map((t: FoodTicket) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: "accepted",
              factoryId: factory.id,
              factoryName: factory.name
            };
          }
          return t;
        });

        localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));

        const updatedTicket = updatedTickets.find((t: FoodTicket) => t.id === ticketId);
        setTicket(updatedTicket);
        setShowDeliverySelect(false);
      } catch (error) {
        console.error("Error updating local state:", error);
        // Continue execution even if local state update fails
      }

      toast.success("Request accepted successfully");
    } catch (error: any) {
      console.error("Error in accept process:", error);
      toast.error(`Failed to accept request: ${error.message || "Unknown error"}`);
    }
  };

  const handleReject = async () => {
    if (!ticket || !ticketId) {
      console.error("Missing ticket or ticketId:", { ticket, ticketId });
      toast.error("Failed to reject request: Missing ticket information");
      return;
    }

    try {
      console.log("Attempting to reject ticket with ID:", ticketId);

      // Check if we have a valid Supabase client
      if (!supabase) {
        console.error("Supabase client is not initialized");
        toast.error("Database connection error");
        return;
      }

      // Update in Supabase
      const { error } = await supabase
        .from("food_tickets")
        .update({
          status: "declined",
          conversion_status: "rejected"
        })
        .eq("id", ticketId);

      if (error) {
        console.error("Supabase update error:", error);
        toast.error(`Failed to reject request: ${error.message}`);
        return;
      }

      // Create factory request record for rejection
      try {
        console.log("Creating factory request record for rejection");
        const factoryRequestData = {
          ticketId: ticketId,
          factoryId: factory.id,
          factoryName: factory.name,
          organizationId: ticket.organizationId,
          organizationName: ticket.organizationName,
          foodType: ticket.foodType,
          weight: ticket.weight,
          status: 'declined' as const,
          notes: `Rejected via factory dashboard`
        };

        const factoryRequest = await createFactoryRequest(factoryRequestData);
        console.log("Factory request rejection record created successfully:", factoryRequest);
      } catch (error) {
        console.error("Error creating factory request rejection record:", error);
        // Don't fail the whole operation if factory request creation fails
        toast.error("Warning: Factory request record could not be created");
      }

      // Update local state
      try {
        const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
        const updatedTickets = loadedTickets.map((t: FoodTicket) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: "declined",
              conversionStatus: "rejected"
            };
          }
          return t;
        });

        localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
      } catch (error) {
        console.error("Error updating local state:", error);
        // Continue execution even if local state update fails
      }

      toast.info("Request rejected");
      navigate("/factory");
    } catch (error: any) {
      console.error("Error in reject process:", error);
      toast.error(`Failed to reject request: ${error.message || "Unknown error"}`);
    }
  };

  const handleMarkConverted = async () => {
    if (!ticket || !ticketId) {
      console.error("Missing ticket or ticketId:", { ticket, ticketId });
      toast.error("Failed to mark as converted: Missing ticket information");
      return;
    }

    try {
      console.log("Marking ticket as converted:", ticketId);

      // Update the food ticket conversion status in Supabase
      try {
        const { error } = await supabase
          .from("food_tickets")
          .update({
            conversion_status: "converted"
          })
          .eq("id", ticketId);

        if (error) {
          console.error("Error updating ticket conversion status:", error);
          toast.error(`Failed to update conversion status: ${error.message}`);
          return;
        }
      } catch (error) {
        console.error("Error in ticket conversion update:", error);
        toast.error("Failed to update ticket conversion status");
        return;
      }

      // Update the factory request record
      try {
        console.log("Finding and updating factory request record");

        // First, find the factory request for this ticket
        const factoryRequests = await getFactoryRequests({
          ticketId: ticketId,
          factoryId: factory.id,
          status: 'accepted'
        });

        if (factoryRequests && factoryRequests.length > 0) {
          const factoryRequest = factoryRequests[0];
          console.log("Found factory request:", factoryRequest);

          // Update the factory request conversion status
          await updateFactoryRequest(factoryRequest.id, {
            conversionStatus: 'converted',
            conversionDate: new Date().toISOString(),
            notes: factoryRequest.notes ? `${factoryRequest.notes}\n\nMarked as converted via factory dashboard` : 'Marked as converted via factory dashboard'
          });

          console.log("Factory request updated successfully");
        } else {
          console.warn("No factory request found for this ticket");
        }
      } catch (error) {
        console.error("Error updating factory request:", error);
        // Don't fail the whole operation if factory request update fails
        toast.error("Warning: Factory request record could not be updated");
      }

      // Update local state
      const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
      const updatedTickets = loadedTickets.map((t: FoodTicket) => {
        if (t.id === ticketId) {
          return {
            ...t,
            conversionStatus: "converted"
          };
        }
        return t;
      });

      localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));

      const updatedTicket = updatedTickets.find((t: FoodTicket) => t.id === ticketId);
      setTicket(updatedTicket);

      toast.success("Food marked as converted successfully");
    } catch (error: any) {
      console.error("Error in mark converted process:", error);
      toast.error(`Failed to mark as converted: ${error.message || "Unknown error"}`);
    }
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading ticket details...</p>
      </div>
    );
  }

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
          <h1 className="text-lg font-medium">Food Conversion Request</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="bg-green-50 border border-green-200 rounded-md mb-6 p-4">
          <p className="text-green-800 font-medium">Status: {ticket.conversionStatus === "converted" ? "Converted" : ticket.status === "accepted" ? "Accepted" : "Pending"}</p>
        </div>

        {isTicketExpired(ticket.expiryDate) && (
          <div className="bg-orange-50 border border-orange-200 rounded-md mb-6 p-4">
            <p className="text-orange-800 font-medium">⚠️ This food has expired and is suitable for factory processing only</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-charity-primary">{ticket.foodType}</h2>
            <p className="text-sm text-muted-foreground">Category: {ticket.category}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-medium">{ticket.organizationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-medium">{ticket.weight} kg {ticket.pieces ? `(${ticket.pieces} pieces)` : ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Food Type</p>
              <p className="font-medium">{ticket.foodType}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-medium">{ticket.weight} kg</p>
            </div>
            <div className={`p-3 rounded-md ${isTicketExpired(ticket.expiryDate) ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
              <p className="text-sm text-muted-foreground">Expiry Date</p>
              <p className={`font-medium ${isTicketExpired(ticket.expiryDate) ? 'text-red-700' : ''}`}>
                {formatDate(ticket.expiryDate)}
                {isTicketExpired(ticket.expiryDate) && <span className="text-red-600 ml-2">(Expired)</span>}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(ticket.createdAt)}</p>
            </div>
          </div>

          {ticket.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="p-3 bg-gray-50 rounded-md">{ticket.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {showDeliverySelect ? (
            <div className="space-y-4">
              <h3 className="font-medium">Select Delivery Method</h3>
              <Select value={deliveryMethod} onValueChange={(value: DeliveryMethod) => setDeliveryMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self-pickup">Self Pickup</SelectItem>
                  <SelectItem value="organization-delivery">Organization Delivers</SelectItem>
                  <SelectItem value="shipping">Third Party Shipping</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleConfirmAccept} className="w-full">
                Accept Request
              </Button>
              <Button variant="outline" onClick={() => setShowDeliverySelect(false)} className="w-full">
                Cancel
              </Button>
            </div>
          ) : (
            <>
              {ticket?.status !== "accepted" && ticket?.conversionStatus !== "converted" && (
                <>
                  <Button
                    onClick={handleAccept}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" /> Accept Request
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="border-red-300 hover:bg-red-50 text-red-600"
                  >
                    <X className="h-4 w-4 mr-2" /> Reject Request
                  </Button>
                </>
              )}
            </>
          )}

          {ticket.status === "accepted" && ticket.conversionStatus !== "converted" && (
            <Button
              onClick={handleMarkConverted}
              className="bg-charity-accent hover:bg-charity-dark text-white"
            >
              <Recycle className="h-4 w-4 mr-2" /> Mark as Converted
            </Button>
          )}

          {ticket.conversionStatus === "converted" && (
            <div className="bg-green-100 border border-green-300 rounded-md p-4 text-center">
              <Recycle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-green-800 font-medium">This food has been successfully converted</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav userRole="factory" />
    </div>
  );
}
