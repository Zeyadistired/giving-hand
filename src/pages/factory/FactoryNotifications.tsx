import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Badge } from "@/components/ui/badge";
import { FoodTicket } from "@/types";
import { getFoodTickets } from "@/utils/tickets";
import { FactoryTicketCard } from "@/components/factory/factory-ticket-card";
import { supabase } from "@/utils/supabaseClient";
import { getUserSession } from "@/utils/auth";

export default function FactoryNotifications() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<FoodTicket[]>([]);
  
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const currentUser = getUserSession();
        if (!currentUser) {
          console.error("No user session found");
          navigate("/login");
          return;
        }

        console.log("Loading factory tickets...");
        // Try to load from Supabase first
        const factoryTickets = await getFoodTickets({
          foodType: 'expiry', // CRITICAL: Only show expiry food
          status: 'pending' // Only show pending tickets
        });
        
        console.log("Factory tickets loaded:", factoryTickets);
        
        // Also load factory_requests to check which tickets have already been processed
        const { data: factoryRequests, error: requestsError } = await supabase
          .from('factory_requests')
          .select('*')
          .eq('factory_id', currentUser.id);
        
        if (requestsError) {
          console.error("Error loading factory requests:", requestsError);
          return;
        }

        if (factoryTickets && factoryTickets.length > 0) {
          setTickets(factoryTickets);
          return;
        }
        
        // Fallback to localStorage
        const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
        console.log("Loaded tickets from localStorage:", loadedTickets);
        
        // Filter for factory tickets - only show expiry food
        const filteredTickets = loadedTickets.filter((ticket: FoodTicket) => 
          ticket.foodType === 'expiry' || 
          ticket.deliveryCapability === "factory-only" ||
          ticket.status === 'expired' ||
          ticket.isExpired === true
        );
        
        console.log("Filtered factory tickets:", filteredTickets);
        setTickets(filteredTickets);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };
    
    loadTickets();
  }, []);
  
  const handleAcceptTicket = (ticketId: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: "accepted", factoryId: "factory-1", factoryName: "Eco Processing Factory" } 
          : ticket
      )
    );
    
    // Update localStorage
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: "accepted", factoryId: "factory-1", factoryName: "Eco Processing Factory" } 
        : ticket
    );
    localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
    
    // Navigate to ticket details
    setTimeout(() => {
      navigate(`/factory/ticket/${ticketId}`);
    }, 500);
  };
  
  const handleDeclineTicket = (ticketId: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: "declined" } 
          : ticket
      )
    );
    
    // Update localStorage
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: "declined" } 
        : ticket
    );
    localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
  };
  
  const handleViewTicket = (ticketId: string) => {
    navigate(`/factory/ticket/${ticketId}`);
  };
  
  const pendingTickets = tickets.filter(ticket => ticket.status === "pending" || ticket.status === "expired");
  const acceptedTickets = tickets.filter(ticket => ticket.status === "accepted");
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-charity-primary mr-2" />
            <Badge className="bg-charity-primary">{pendingTickets.length}</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charity-primary mb-1">Factory Notifications</h1>
          <p className="text-muted-foreground">
            {pendingTickets.length > 0 
              ? `You have ${pendingTickets.length} new expired food tickets` 
              : "No new expired food tickets"}
          </p>
        </div>

        {pendingTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="font-medium mb-4">New Tickets</h2>
            <div className="space-y-4">
              {pendingTickets.map(ticket => (
                <FactoryTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAccept={() => handleAcceptTicket(ticket.id)}
                  onReject={() => handleDeclineTicket(ticket.id)}
                  onMarkConverted={() => {}}
                  onView={() => handleViewTicket(ticket.id)}
                  status="pending"
                />
              ))}
            </div>
          </div>
        )}
        
        {acceptedTickets.length > 0 && (
          <div>
            <h2 className="font-medium mb-4">Accepted Tickets</h2>
            <div className="space-y-4">
              {acceptedTickets.map(ticket => (
                <FactoryTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAccept={() => handleAcceptTicket(ticket.id)}
                  onReject={() => handleDeclineTicket(ticket.id)}
                  onMarkConverted={() => {}}
                  onView={() => handleViewTicket(ticket.id)}
                  status="accepted"
                />
              ))}
            </div>
          </div>
        )}
        
        {tickets.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-1">No Notifications</h3>
            <p className="text-muted-foreground">
              You'll be notified when organizations share expired food for processing
            </p>
          </div>
        )}
      </main>

      <BottomNav userRole="factory" />
    </div>
  );
}
