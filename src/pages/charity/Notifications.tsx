import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { FoodTicketCard } from "@/components/tickets/food-ticket-card";
import { Badge } from "@/components/ui/badge";
import { FoodTicket } from "@/types";
import { getFoodTicketsEnhanced } from "@/utils/tickets";
import { getCurrentUser } from "@/utils/auth";
import { toast } from "sonner";
import { supabase } from "@/utils/supabaseClient";

export default function Notifications() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<FoodTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadUserAndTickets = async () => {
      try {
        setIsLoading(true);

        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);

        // Load all pending tickets from database
        const allTickets = await getFoodTicketsEnhanced({ status: 'pending' });
        console.log("Loaded tickets from database:", allTickets);
        setTickets(allTickets);

      } catch (error) {
        console.error("Error loading tickets:", error);
        toast.error("Failed to load tickets");
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndTickets();
  }, []);

  const handleAcceptTicket = async (ticketId: string) => {
    if (!currentUser) {
      toast.error("Please log in to accept tickets");
      return;
    }

    try {
      console.log("=== ACCEPT TICKET ATTEMPT ===");
      console.log("Ticket ID:", ticketId);
      console.log("Current User:", currentUser);

      // Use direct Supabase update to ensure it works
      const { data: updatedTicket, error } = await supabase
        .from('food_tickets')
        .update({
          status: 'accepted',
          accepted_by: currentUser.id
        })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw new Error(`Update failed: ${error.message}`);
      }

      console.log("✅ Ticket updated successfully:", updatedTicket);

      // Update local state to remove the ticket from pending list
      setTickets(prevTickets =>
        prevTickets.filter(ticket => ticket.id !== ticketId)
      );

      toast.success("Ticket accepted successfully!");

      // Navigate to ticket details after a short delay
      setTimeout(() => {
        navigate(`/ticket/${ticketId}`);
      }, 500);

    } catch (error) {
      console.error("=== ACCEPT TICKET ERROR ===");
      console.error("Error accepting ticket:", error);
      toast.error("Failed to accept ticket. Please try again.");
    }
  };

  const handleDeclineTicket = async (ticketId: string) => {
    if (!currentUser) {
      toast.error("Please log in to decline tickets");
      return;
    }

    try {
      console.log("=== DECLINE TICKET ATTEMPT ===");
      console.log("Ticket ID:", ticketId);

      // Use direct Supabase update to ensure it works
      const { data: updatedTicket, error } = await supabase
        .from('food_tickets')
        .update({ status: 'declined' })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw new Error(`Update failed: ${error.message}`);
      }

      console.log("✅ Ticket declined successfully:", updatedTicket);

      // Update local state to remove the ticket from pending list
      setTickets(prevTickets =>
        prevTickets.filter(ticket => ticket.id !== ticketId)
      );

      toast.success("Ticket declined");

    } catch (error) {
      console.error("=== DECLINE TICKET ERROR ===");
      console.error("Error declining ticket:", error);
      toast.error("Failed to decline ticket. Please try again.");
    }
  };

  // Debug functions removed for production

  const handleViewTicket = (ticketId: string) => {
    navigate(`/ticket/${ticketId}`);
  };

  const pendingTickets = tickets.filter(ticket => ticket.status === "pending");
  const acceptedTickets = tickets.filter(ticket => ticket.status === "accepted");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charity-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-charity-primary mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            {pendingTickets.length > 0
              ? `You have ${pendingTickets.length} new food donation tickets`
              : "No new food donation tickets"}
          </p>
        </div>

        {pendingTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="font-medium mb-4">New Tickets</h2>
            <div className="space-y-4">
              {pendingTickets.map(ticket => (
                <FoodTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAccept={handleAcceptTicket}
                  onDecline={handleDeclineTicket}
                  onView={handleViewTicket}
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
                <FoodTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAccept={handleAcceptTicket}
                  onDecline={handleDeclineTicket}
                  onView={handleViewTicket}
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
              You'll be notified when organizations share food donations
            </p>
          </div>
        )}
      </main>

      <BottomNav userRole="charity" />
    </div>
  );
}
