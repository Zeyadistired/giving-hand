import { useState, useEffect } from "react";
import { Info, Settings, HelpCircle } from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Logo } from "@/components/ui/logo";
import { FoodTicket } from "@/types";
import { FactoryTicketCard } from "@/components/factory/factory-ticket-card";
import { getUserSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FactoryHome() {
  const navigate = useNavigate();
  const [pendingTickets, setPendingTickets] = useState<FoodTicket[]>([]);
  const [acceptedTickets, setAcceptedTickets] = useState<FoodTicket[]>([]);
  const [convertedTickets, setConvertedTickets] = useState<FoodTicket[]>([]);
  const [factory, setFactory] = useState({
    name: "",
    id: ""
  });

  useEffect(() => {
    const currentUser = getUserSession();
    if (currentUser) {
      setFactory({
        name: currentUser.name,
        id: currentUser.id
      });
    }

    // Load tickets from localStorage
    const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    
    // Filter for factory tickets - this includes:
    // 1. Tickets already assigned to this factory
    // 2. Tickets with "factory-only" delivery capability that are not assigned to any factory yet
    // 3. Tickets marked as expired for factory processing
    const factoryTickets = loadedTickets.filter((ticket: FoodTicket) => 
      ticket.factoryId === factory.id || 
      (ticket.deliveryCapability === "factory-only" && !ticket.factoryId) ||
      (ticket.status === "expired" && ticket.deliveryCapability === "factory-only")
    );
    
    console.log("All tickets:", loadedTickets);
    console.log("Factory tickets:", factoryTickets);
    console.log("Current factory:", factory);
    
    setPendingTickets(factoryTickets.filter((t: FoodTicket) => 
      (t.conversionStatus === "pending" || !t.conversionStatus) && t.status !== "accepted"
    ));
    
    setAcceptedTickets(factoryTickets.filter((t: FoodTicket) => 
      t.status === "accepted" && t.conversionStatus !== "converted" && t.factoryId
    ));
    
    setConvertedTickets(factoryTickets.filter((t: FoodTicket) => 
      t.conversionStatus === "converted"
    ));
  }, [factory.id]);

  const handleAccept = (ticketId: string) => {
    const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    const updatedTickets = loadedTickets.map((ticket: FoodTicket) => {
      if (ticket.id === ticketId) {
        return {
          ...ticket, 
          factoryId: factory.id,
          factoryName: factory.name,
          status: "accepted",
        };
      }
      return ticket;
    });
    
    localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
    
    // Update the local state
    const acceptedTicket = updatedTickets.find((t: FoodTicket) => t.id === ticketId);
    setPendingTickets(prev => prev.filter(t => t.id !== ticketId));
    setAcceptedTickets(prev => [...prev, acceptedTicket]);
  };
  
  const handleReject = (ticketId: string) => {
    const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    const updatedTickets = loadedTickets.map((ticket: FoodTicket) => {
      if (ticket.id === ticketId) {
        return {
          ...ticket, 
          conversionStatus: "rejected",
          status: "declined"
        };
      }
      return ticket;
    });
    
    localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
    
    // Update the local state
    setPendingTickets(prev => prev.filter(t => t.id !== ticketId));
  };
  
  const handleMarkConverted = (ticketId: string) => {
    const loadedTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    const updatedTickets = loadedTickets.map((ticket: FoodTicket) => {
      if (ticket.id === ticketId) {
        return {
          ...ticket, 
          conversionStatus: "converted"
        };
      }
      return ticket;
    });
    
    localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
    
    // Update the local state
    const convertedTicket = updatedTickets.find((t: FoodTicket) => t.id === ticketId);
    setAcceptedTickets(prev => prev.filter(t => t.id !== ticketId));
    setConvertedTickets(prev => [...prev, convertedTicket]);
  };
  
  const handleViewTicket = (ticketId: string) => {
    navigate(`/factory/ticket/${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex justify-between items-center">
          <img src="/lovable-uploads/white.avif" alt="Your Custom Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-semibold text-charity-primary">{factory.name || "Factory Dashboard"}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/factory/help")}
              className="text-muted-foreground hover:text-charity-primary"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/factory/settings")}
              className="text-muted-foreground hover:text-charity-primary"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        {/* Banner Image */}
        <img
          src="/lovable-uploads/Factory.png"  // Update the path to your image
          alt="Factory Banner"
          className="w-full max-h-72 object-cover object-[center_30%] mt-2 rounded-xl mb-6 shadow-md"
        />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charity-primary mb-1">Factory Dashboard</h1>
          <p className="text-muted-foreground">
            {pendingTickets.length > 0 
              ? `You have ${pendingTickets.length} pending food conversion requests` 
              : "No pending conversion requests"}
          </p>
        </div>

        {/* Help section for factory users */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-medium text-blue-800 mb-1">About Factory Mode</h2>
              <p className="text-sm text-blue-700">
                Your factory receives expired food from organizations for conversion into animal food. You can:
              </p>
              <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
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
                <FactoryTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAccept={() => handleAccept(ticket.id)}
                  onReject={() => handleReject(ticket.id)}
                  onMarkConverted={() => handleMarkConverted(ticket.id)}
                  onView={() => handleViewTicket(ticket.id)}
                  status="pending"
                />
              ))}
            </div>
          </div>
        )}
        
        {acceptedTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="font-medium mb-4 flex items-center gap-2">
              <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
              Accepted Requests
            </h2>
            <div className="space-y-4">
              {acceptedTickets.map(ticket => (
                <FactoryTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAccept={() => handleAccept(ticket.id)}
                  onReject={() => handleReject(ticket.id)}
                  onMarkConverted={() => handleMarkConverted(ticket.id)}
                  onView={() => handleViewTicket(ticket.id)}
                  status="accepted"
                />
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
                <FactoryTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAccept={() => {}}
                  onReject={() => {}}
                  onMarkConverted={() => {}}
                  onView={() => handleViewTicket(ticket.id)}
                  status="converted"
                />
              ))}
            </div>
          </div>
        )}
        
        {pendingTickets.length === 0 && acceptedTickets.length === 0 && convertedTickets.length === 0 && (
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