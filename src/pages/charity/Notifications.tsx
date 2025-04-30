import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { BottomNav } from "@/components/ui/bottom-nav";
import { FoodTicketCard } from "@/components/tickets/food-ticket-card";
import { Badge } from "@/components/ui/badge";
import { FoodTicket } from "@/types";

export default function Notifications() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<FoodTicket[]>([]);
  
  useEffect(() => {
    // Load tickets from localStorage
    const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    console.log("Loaded tickets from localStorage:", loadedTickets);
    setTickets(loadedTickets);
  }, []);
  
  const handleAcceptTicket = (ticketId: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: "accepted", acceptedBy: "Your Charity" } 
          : ticket
      )
    );
    
    // Update localStorage
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: "accepted", acceptedBy: "Your Charity" } 
        : ticket
    );
    localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
    
    // In a real app, we would navigate to delivery options
    // For now, we'll just show a delay and then navigate to the details
    setTimeout(() => {
      navigate(`/ticket/${ticketId}`);
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
    navigate(`/ticket/${ticketId}`);
  };
  
  const pendingTickets = tickets.filter(ticket => ticket.status === "pending");
  const acceptedTickets = tickets.filter(ticket => ticket.status === "accepted");
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <Logo />
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
