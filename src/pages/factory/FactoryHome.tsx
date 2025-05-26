import { useState, useEffect } from "react";
import { Info, Heart } from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { FoodTicket } from "@/types";
import { FactoryTicketCard } from "@/components/factory/factory-ticket-card";
import { getUserSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { motion } from "framer-motion";
import { getFoodTickets, updateFoodTicket } from "@/utils/tickets";
import { toast } from "sonner";
import { supabase } from "@/utils/supabaseClient";

export default function FactoryHome() {
  const navigate = useNavigate();
  const [pendingTickets, setPendingTickets] = useState<FoodTicket[]>([]);
  const [acceptedTickets, setAcceptedTickets] = useState<FoodTicket[]>([]);
  const [convertedTickets, setConvertedTickets] = useState<FoodTicket[]>([]);
  const [rejectedTickets, setRejectedTickets] = useState<FoodTicket[]>([]);
  const [factory, setFactory] = useState({
    name: "",
    id: ""
  });
  const [ticketsWithVisibleButtons, setTicketsWithVisibleButtons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentUser = getUserSession();
    if (currentUser) {
      setFactory({
        name: currentUser.name,
        id: currentUser.id
      });
    }

    loadFactoryData();
  }, []);

  const loadFactoryData = async () => {
    setLoading(true);
    try {
      const currentUser = getUserSession();
      if (!currentUser) {
        console.error("No user session found");
        navigate("/login");
        return;
      }

      try {
        // Load tickets from database - CRITICAL FIX: explicitly filter for expiry food
        console.log("Loading factory tickets...");
        const allTickets = await getFoodTickets({
          foodType: 'expiry' // CRITICAL: Only show expiry food
        });
        console.log("All factory tickets loaded:", allTickets);

        // Filter for factory tickets
        const factoryTickets = allTickets.filter((ticket: FoodTicket) =>
          ticket.factoryId === currentUser.id ||
          !ticket.factoryId // Show all unassigned expiry tickets
        );
        console.log("Filtered factory tickets:", factoryTickets);

        setPendingTickets(factoryTickets.filter((t: FoodTicket) =>
          (t.conversionStatus === "pending" || !t.conversionStatus) &&
          t.status !== "accepted" &&
          t.status !== "declined" &&
          t.conversionStatus !== "rejected"
        ));

        setAcceptedTickets(factoryTickets.filter((t: FoodTicket) =>
          t.status === "accepted" && t.conversionStatus !== "converted" && t.factoryId
        ));

        setConvertedTickets(factoryTickets.filter((t: FoodTicket) =>
          t.conversionStatus === "converted"
        ));

        setRejectedTickets(factoryTickets.filter((t: FoodTicket) =>
          t.status === "declined" || t.conversionStatus === "rejected"
        ));

        // CRITICAL: Also load factory_requests from Supabase to ensure data consistency
        const { data: factoryRequests, error } = await supabase
          .from('factory_requests')
          .select('*')
          .eq('factory_id', currentUser.id);

        if (error) {
          console.error("Error loading factory requests:", error);
        } else {
          console.log("Factory requests loaded from database:", factoryRequests);

          // Update local state based on factory_requests if needed
          // This ensures the UI reflects the actual database state
          if (factoryRequests && factoryRequests.length > 0) {
            // Process factory requests to update local state if needed
            factoryRequests.forEach(request => {
              // If a request is marked as declined/rejected in factory_requests but not in food_tickets
              if (request.status === 'declined' || request.conversion_status === 'rejected') {
                // Remove from pending/accepted if it's in the declined state in factory_requests
                setPendingTickets(prev => prev.filter(t => t.id !== request.ticket_id));
                setAcceptedTickets(prev => prev.filter(t => t.id !== request.ticket_id));
              }

              // If a request is marked as converted in factory_requests
              if (request.conversion_status === 'converted') {
                // Ensure it's in the converted tickets list
                const matchingTicket = factoryTickets.find(t => t.id === request.ticket_id);
                if (matchingTicket) {
                  setAcceptedTickets(prev => prev.filter(t => t.id !== request.ticket_id));
                  setConvertedTickets(prev => {
                    // Only add if not already in the list
                    if (!prev.some(t => t.id === request.ticket_id)) {
                      return [...prev, {
                        ...matchingTicket,
                        conversionStatus: 'converted'
                      }];
                    }
                    return prev;
                  });
                }
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading tickets from database:", error);
        // Fallback to localStorage
        const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");

        // Filter for factory tickets - only show expiry food
        const factoryTickets = loadedTickets.filter((ticket: FoodTicket) =>
          ticket.foodType === 'expiry' ||
          ticket.deliveryCapability === "factory-only" ||
          ticket.isExpired === true
        );

        setPendingTickets(factoryTickets.filter((t: FoodTicket) =>
          (t.status === "pending" || !t.status) &&
          t.status !== "declined" &&
          t.conversionStatus !== "rejected"
        ));

        setAcceptedTickets(factoryTickets.filter((t: FoodTicket) =>
          t.status === "accepted" && t.factoryId === currentUser.id
        ));

        setConvertedTickets(factoryTickets.filter((t: FoodTicket) =>
          t.conversionStatus === "converted" && t.factoryId === currentUser.id
        ));

        setRejectedTickets(factoryTickets.filter((t: FoodTicket) =>
          (t.status === "declined" || t.conversionStatus === "rejected") && t.factoryId === currentUser.id
        ));
      }
    } catch (error) {
      console.error("Error in loadFactoryData:", error);
      toast.error("Failed to load factory data");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (ticketId: string) => {
    try {
      // Update food_tickets table
      const updatedTicket = await updateFoodTicket(ticketId, {
        factoryId: factory.id,
        factoryName: factory.name,
        status: "accepted",
      });

      // Insert into factory_requests table
      const { data, error } = await supabase
        .from('factory_requests')
        .insert([
          {
            ticket_id: ticketId,
            factory_id: factory.id,
            factory_name: factory.name,
            organization_id: updatedTicket.organizationId,
            organization_name: updatedTicket.organizationName,
            food_type: updatedTicket.foodType || 'expiry',
            weight: updatedTicket.weight || 0,
            status: 'accepted',
            conversion_status: 'pending',
            notes: 'Accepted via factory dashboard',
            request_date: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error("Error inserting into factory_requests:", error);
        toast.error("Warning: Factory request record could not be created");
      } else {
        console.log("Factory request created successfully:", data);
      }

      setPendingTickets(prev => prev.filter(t => t.id !== ticketId));
      setAcceptedTickets(prev => [...prev, updatedTicket]);
      toast.success("Request accepted successfully");
    } catch (error) {
      console.error("Error accepting ticket:", error);
      toast.error("Failed to accept request. Please try again.");
    }
  };

  const handleReject = async (ticketId: string) => {
    try {
      // Get the ticket details first
      const ticketToReject = pendingTickets.find(t => t.id === ticketId);
      if (!ticketToReject) {
        console.error("Ticket not found:", ticketId);
        toast.error("Failed to reject request: Ticket not found");
        return;
      }

      // Update food_tickets table
      await updateFoodTicket(ticketId, {
        conversionStatus: "rejected",
        status: "declined"
      });

      // Insert into factory_requests table
      const { data, error } = await supabase
        .from('factory_requests')
        .insert([
          {
            ticket_id: ticketId,
            factory_id: factory.id,
            factory_name: factory.name,
            organization_id: ticketToReject.organizationId,
            organization_name: ticketToReject.organizationName,
            food_type: ticketToReject.foodType || 'expiry',
            weight: ticketToReject.weight || 0,
            status: 'declined',
            conversion_status: 'rejected',
            notes: 'Rejected via factory dashboard',
            request_date: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error("Error inserting into factory_requests:", error);
        toast.error("Warning: Factory request record could not be created");
      } else {
        console.log("Factory rejection record created successfully:", data);
      }

      setPendingTickets(prev => prev.filter(t => t.id !== ticketId));
      setRejectedTickets(prev => [...prev, {
        ...ticketToReject,
        status: "declined",
        conversionStatus: "rejected"
      }]);
      toast.info("Request rejected");
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      toast.error("Failed to reject request. Please try again.");
    }
  };

  const handleMarkConverted = async (ticketId: string) => {
    try {
      // Update food_tickets table
      const updatedTicket = await updateFoodTicket(ticketId, {
        conversionStatus: "converted"
      });

      // Check if a factory request already exists
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
        const { error: updateError } = await supabase
          .from("factory_requests")
          .update({
            conversion_status: 'converted',
            conversion_date: new Date().toISOString(),
            notes: existingRequests[0].notes
              ? `${existingRequests[0].notes}\n\nMarked as converted via factory dashboard`
              : `Marked as converted via factory dashboard`
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
        const { data: insertData, error: insertError } = await supabase
          .from("factory_requests")
          .insert([
            {
              ticket_id: ticketId,
              factory_id: factory.id,
              factory_name: factory.name,
              organization_id: updatedTicket.organizationId,
              organization_name: updatedTicket.organizationName,
              food_type: updatedTicket.foodType || 'expiry',
              weight: updatedTicket.weight || 0,
              status: 'accepted',
              conversion_status: 'converted',
              conversion_date: new Date().toISOString(),
              notes: `Marked as converted via factory dashboard`,
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

      setAcceptedTickets(prev => prev.filter(t => t.id !== ticketId));
      setConvertedTickets(prev => [...prev, updatedTicket]);
      toast.success("Food marked as converted successfully");
    } catch (error) {
      console.error("Error marking as converted:", error);
      toast.error("Failed to mark as converted. Please try again.");
    }
  };

  const handleRejectConversion = async (ticketId: string) => {
    try {
      // Update food_tickets table
      const updatedTicket = await updateFoodTicket(ticketId, {
        conversionStatus: "rejected"
      });

      // Check if a factory request already exists
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
        const { error: updateError } = await supabase
          .from("factory_requests")
          .update({
            conversion_status: 'rejected',
            conversion_date: new Date().toISOString(),
            notes: existingRequests[0].notes
              ? `${existingRequests[0].notes}\n\nConversion rejected via factory dashboard`
              : `Conversion rejected via factory dashboard`
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
        const { data: insertData, error: insertError } = await supabase
          .from("factory_requests")
          .insert([
            {
              ticket_id: ticketId,
              factory_id: factory.id,
              factory_name: factory.name,
              organization_id: updatedTicket.organizationId,
              organization_name: updatedTicket.organizationName,
              food_type: updatedTicket.foodType || 'expiry',
              weight: updatedTicket.weight || 0,
              status: 'accepted',
              conversion_status: 'rejected',
              conversion_date: new Date().toISOString(),
              notes: `Conversion rejected via factory dashboard`,
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

      setAcceptedTickets(prev => prev.filter(t => t.id !== ticketId));
      setRejectedTickets(prev => [...prev, {
        ...updatedTicket,
        conversionStatus: "rejected"
      }]);
      toast.success("Food conversion rejected successfully");
    } catch (error) {
      console.error("Error rejecting conversion:", error);
      toast.error("Failed to reject conversion. Please try again.");
    }
  };

  const handleViewTicket = (ticketId: string) => {
    navigate(`/factory/ticket/${ticketId}`);
  };

  const toggleConversionButtons = (ticketId: string) => {
    setTicketsWithVisibleButtons(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  // Rest of the component remains the same
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className={`sticky top-0 z-10 bg-background transition-all duration-300 border-b`}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
            <span className="font-bold text-lg">Giving Hand</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img
            src="/lovable-uploads/Factory.png"
            alt="Factory Banner"
            className="w-full h-64 object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-white mb-2">Factory Dashboard</h1>
              <p className="text-white/90 max-w-md">
                {pendingTickets.length > 0
                  ? `You have ${pendingTickets.length} pending food conversion requests`
                  : "No pending conversion requests"}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Help section for factory users */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-emerald-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-medium text-emerald-800 mb-1">About Factory Mode</h2>
              <p className="text-sm text-emerald-700">
                Your factory receives expired food from organizations for conversion into animal food. You can:
              </p>
              <ul className="mt-2 text-sm text-emerald-700 list-disc pl-5 space-y-1">
                <li>Accept or reject food conversion requests</li>
                <li>Mark conversions as complete when finished</li>
                <li>View history of all your conversions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tickets */}
        {pendingTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span className="h-3 w-3 bg-yellow-400 rounded-full"></span>
              Pending Requests
            </h2>
            <div className="space-y-4">
              {pendingTickets.map(ticket => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FactoryTicketCard
                    ticket={ticket}
                    onAccept={() => handleAccept(ticket.id)}
                    onReject={() => handleReject(ticket.id)}
                    onMarkConverted={() => handleMarkConverted(ticket.id)}
                    onView={() => handleViewTicket(ticket.id)}
                    status="pending"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {acceptedTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span className="h-3 w-3 bg-emerald-500 rounded-full"></span>
              Accepted Requests
            </h2>
            <div className="space-y-4">
              {acceptedTickets.map(ticket => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Debug text */}
                  <div className="text-xs text-gray-500 mb-1">
                    Debug: ShowButtons={String(ticketsWithVisibleButtons.includes(ticket.id))}
                  </div>

                  <FactoryTicketCard
                    ticket={ticket}
                    onAccept={() => handleAccept(ticket.id)}
                    onReject={() => handleReject(ticket.id)}
                    onMarkConverted={() => handleMarkConverted(ticket.id)}
                    onRejectConversion={() => handleRejectConversion(ticket.id)}
                    onView={() => toggleConversionButtons(ticket.id)}
                    status="accepted"
                    showConversionButtons={ticketsWithVisibleButtons.includes(ticket.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {convertedTickets.length > 0 && (
          <div>
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span className="h-3 w-3 bg-green-500 rounded-full"></span>
              Converted
            </h2>
            <div className="space-y-4">
              {convertedTickets.map(ticket => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FactoryTicketCard
                    ticket={ticket}
                    onAccept={() => {}}
                    onReject={() => {}}
                    onMarkConverted={() => {}}
                    onView={() => handleViewTicket(ticket.id)}
                    status="converted"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {rejectedTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span className="h-3 w-3 bg-red-500 rounded-full"></span>
              Rejected Requests
            </h2>
            <div className="space-y-4">
              {rejectedTickets.map(ticket => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FactoryTicketCard
                    ticket={ticket}
                    onAccept={() => {}}
                    onReject={() => {}}
                    onMarkConverted={() => {}}
                    onView={() => handleViewTicket(ticket.id)}
                    status="rejected"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {pendingTickets.length === 0 && acceptedTickets.length === 0 && convertedTickets.length === 0 && rejectedTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 h-20 w-20 flex items-center justify-center rounded-full mx-auto mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <use href="#icon-factory"></use>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-500 mb-1">No Conversion Requests</h3>
            <p className="text-muted-foreground">
              You'll be notified when organizations send expired food for conversion
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/factory/help")}
            >
              Learn More About Factory Process
            </Button>
          </div>
        )}
      </main>

      <BottomNav userRole="factory" />
    </div>
  );
}
