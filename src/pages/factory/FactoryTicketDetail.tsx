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

    const loadTicketData = async () => {
      try {
        // First try to load from Supabase
        if (supabase) {
          // Get the food ticket
          const { data: ticketData, error: ticketError } = await supabase
            .from("food_tickets")
            .select("*")
            .eq("id", ticketId)
            .single();

          if (ticketError) {
            console.error("Error loading ticket from Supabase:", ticketError);
          } else if (ticketData) {
            console.log("Loaded ticket from Supabase:", ticketData);
            
            // Convert snake_case to camelCase for frontend use
            const camelCaseTicket = Object.keys(ticketData).reduce((acc, key) => {
              const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
              return { ...acc, [camelKey]: ticketData[key] };
            }, {});
            
            setTicket(camelCaseTicket as FoodTicket);
            
            // Also check factory_requests table for this ticket
            const { data: requestData, error: requestError } = await supabase
              .from("factory_requests")
              .select("*")
              .eq("ticket_id", ticketId)
              .order('request_date', { ascending: false })
              .limit(1);
              
            if (requestError) {
              console.error("Error loading factory request:", requestError);
            } else if (requestData && requestData.length > 0) {
              console.log("Found factory request for this ticket:", requestData[0]);
              
              // Update ticket with factory request data if needed
              if (requestData[0].conversion_status && !(camelCaseTicket as FoodTicket).conversionStatus) {
                setTicket(prev => prev ? {
                  ...prev,
                  conversionStatus: requestData[0].conversion_status
                } : null);
              }
            } else {
              console.log("No factory request found for this ticket");
            }
            
            return; // Successfully loaded from Supabase
          }
        }
        
        // Fallback to localStorage if Supabase load failed
        const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
        const foundTicket = loadedTickets.find((t: FoodTicket) => t.id === ticketId);

        if (!foundTicket) {
          navigate("/factory");
          return;
        }

        setTicket(foundTicket);
      } catch (error) {
        console.error("Error loading ticket data:", error);
        toast.error("Failed to load ticket details");
      }
    };

    loadTicketData();
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
      
      // Check if we have a valid Supabase client
      if (!supabase) {
        console.error("Supabase client is not initialized");
        toast.error("Database connection error");
        return;
      }

      // First update the food ticket status
      try {
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

        console.log("Food ticket update successful, response:", data);
      } catch (error) {
        console.error("Error in update operation:", error);
        toast.error("Failed to update ticket status");
        return;
      }

      // Create factory request record with proper error handling
      try {
        console.log("Creating factory request record");
        const factoryRequestData = {
          ticketId: ticketId,
          factoryId: factory.id,
          factoryName: factory.name,
          organizationId: ticket.organizationId,
          organizationName: ticket.organizationName,
          foodType: ticket.foodType || 'expiry',
          weight: ticket.weight || 0,
          status: 'accepted' as const,
          notes: `Accepted via factory dashboard. Delivery method: ${deliveryMethod}`
        };

        console.log("Factory request data:", factoryRequestData);
        const factoryRequest = await createFactoryRequest(factoryRequestData);
        console.log("Factory request created successfully:", factoryRequest);
      } catch (error: any) {
        console.error("Error creating factory request:", error);
        toast.error(`Warning: Factory request record could not be created: ${error.message}`);
      }

      // Update local state and show success message
      toast.success("Request accepted successfully");
      setShowDeliverySelect(false);
      
      // Update the local ticket state
      setTicket({
        ...ticket,
        status: "accepted",
        factoryId: factory.id,
        factoryName: factory.name
      });
      
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

      // Update in Supabase food_tickets table
      const { error: ticketError } = await supabase
        .from("food_tickets")
        .update({
          status: "declined",
          conversion_status: "rejected"
        })
        .eq("id", ticketId);

      if (ticketError) {
        console.error("Supabase food_tickets update error:", ticketError);
        toast.error(`Failed to reject request: ${ticketError.message}`);
        return;
      }

      // CRITICAL: Insert directly into factory_requests table
      const { data: insertData, error: insertError } = await supabase
        .from("factory_requests")
        .insert([
          {
            ticket_id: ticketId,
            factory_id: factory.id,
            factory_name: factory.name,
            organization_id: ticket.organizationId,
            organization_name: ticket.organizationName,
            food_type: ticket.foodType || 'expiry',
            weight: ticket.weight || 0,
            status: 'declined',
            conversion_status: 'rejected',
            notes: `Rejected via factory dashboard`,
            request_date: new Date().toISOString()
          }
        ])
        .select();

      if (insertError) {
        console.error("CRITICAL ERROR - Failed to insert into factory_requests:", insertError);
        toast.error(`Failed to record rejection in database: ${insertError.message}`);
        // Continue execution - we've at least updated the food_tickets table
      } else {
        console.log("Successfully inserted rejection record into factory_requests:", insertData);
      }

      toast.info("Request rejected");
      navigate("/factory");
    } catch (error: any) {
      console.error("Error in reject process:", error);
      toast.error(`Failed to reject request: ${error.message || "Unknown error"}`);
    }
  };

  const handleMarkConverted = async (status: 'converted' | 'rejected') => {
    if (!ticket || !ticketId) {
      console.error("Missing ticket or ticketId:", { ticket, ticketId });
      toast.error(`Failed to mark as ${status}: Missing ticket information`);
      return;
    }

    try {
      console.log(`Marking ticket as ${status}:`, ticketId);

      // Update the food ticket conversion status in Supabase
      try {
        const { error } = await supabase
          .from("food_tickets")
          .update({
            conversion_status: status
          })
          .eq("id", ticketId);

        if (error) {
          console.error(`Error updating ticket conversion status to ${status}:`, error);
          toast.error(`Failed to update conversion status: ${error.message}`);
          return;
        }
      } catch (error) {
        console.error(`Error in ticket conversion update to ${status}:`, error);
        toast.error(`Failed to update ticket conversion status to ${status}`);
        return;
      }

      // Check if a factory request already exists for this ticket
      const { data: existingRequests, error: fetchError } = await supabase
        .from("factory_requests")
        .select("*")
        .eq("ticket_id", ticketId)
        .eq("factory_id", factory.id);

      if (fetchError) {
        console.error("Error checking for existing factory requests:", fetchError);
      }

      if (existingRequests && existingRequests.length > 0) {
        // Update existing factory request
        console.log("Updating existing factory request:", existingRequests[0].id);
        const { error: updateError } = await supabase
          .from("factory_requests")
          .update({
            conversion_status: status,
            conversion_date: new Date().toISOString(),
            notes: existingRequests[0].notes 
              ? `${existingRequests[0].notes}\n\nMarked as ${status} via factory dashboard` 
              : `Marked as ${status} via factory dashboard`
          })
          .eq("id", existingRequests[0].id);

        if (updateError) {
          console.error("Error updating factory request:", updateError);
          toast.error(`Warning: Factory request record could not be updated: ${updateError.message}`);
        } else {
          console.log("Factory request updated successfully");
        }
      } else {
        // Insert new factory request
        console.log("No existing factory request found, creating new one");
        const { data: insertData, error: insertError } = await supabase
          .from("factory_requests")
          .insert([
            {
              ticket_id: ticketId,
              factory_id: factory.id,
              factory_name: factory.name,
              organization_id: ticket.organizationId,
              organization_name: ticket.organizationName,
              food_type: ticket.foodType || 'expiry',
              weight: ticket.weight || 0,
              status: 'accepted',
              conversion_status: status,
              conversion_date: new Date().toISOString(),
              notes: `Marked as ${status} via factory dashboard`,
              request_date: new Date().toISOString()
            }
          ])
          .select();

        if (insertError) {
          console.error("Error creating new factory request:", insertError);
          toast.error(`Warning: Factory request record could not be created: ${insertError.message}`);
        } else {
          console.log("New factory request created successfully:", insertData);
        }
      }

      toast.success(status === 'converted' ? 
        "Food marked as converted successfully" : 
        "Food conversion rejected successfully");
    } catch (error: any) {
      console.error(`Error in mark ${status} process:`, error);
      toast.error(`Failed to mark as ${status}: ${error.message || "Unknown error"}`);
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

          {ticket.status === "accepted" && ticket.conversionStatus !== "converted" && ticket.conversionStatus !== "rejected" && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleMarkConverted('converted')}
                className="bg-charity-accent hover:bg-charity-dark text-white"
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "1px solid #28a745",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 1
                }}
              >
                <Check className="h-4 w-4 mr-2" /> Accept Request
              </Button>
              <Button
                onClick={() => handleMarkConverted('rejected')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="h-4 w-4 mr-2" /> Reject Request
              </Button>
            </div>
          )}

          {ticket.conversionStatus === "converted" && (
            <div className="bg-green-100 border border-green-300 rounded-md p-4 text-center">
              <Recycle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-green-800 font-medium">This food has been successfully converted</p>
            </div>
          )}

          {ticket.conversionStatus === "rejected" && (
            <div className="bg-red-100 border border-red-300 rounded-md p-4 text-center">
              <X className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <p className="text-red-800 font-medium">This food conversion was rejected</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav userRole="factory" />
    </div>
  );
}
