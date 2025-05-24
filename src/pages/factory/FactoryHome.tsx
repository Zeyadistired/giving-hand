import { useState, useEffect } from "react";
import { Info, Settings, HelpCircle, Heart } from "lucide-react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { FoodTicket } from "@/types";
import { FactoryTicketCard } from "@/components/factory/factory-ticket-card";
import { getUserSession } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { motion } from "framer-motion";

export default function FactoryHome() {
  const navigate = useNavigate();
  const [pendingTickets, setPendingTickets] = useState<FoodTicket[]>([]);
  const [acceptedTickets, setAcceptedTickets] = useState<FoodTicket[]>([]);
  const [convertedTickets, setConvertedTickets] = useState<FoodTicket[]>([]);
  const [factory, setFactory] = useState({
    name: "",
    id: ""
  });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    console.log("FactoryHome useEffect running");
    const currentUser = getUserSession();
    console.log("Current user:", currentUser);
    
    if (currentUser) {
      setFactory({
        name: currentUser.name,
        id: currentUser.id
      });
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Load tickets from localStorage
    try {
      const ticketsJson = localStorage.getItem("foodTickets");
      console.log("Raw tickets from localStorage:", ticketsJson);
      
      if (!ticketsJson) {
        console.error("No tickets found in localStorage");
        return;
      }
      
      const loadedTickets = JSON.parse(ticketsJson);
      console.log("All loaded tickets:", loadedTickets);
      
      if (!Array.isArray(loadedTickets) || loadedTickets.length === 0) {
        console.error("Tickets is not an array or is empty:", loadedTickets);
        return;
      }
      
      // Filter for factory tickets - only show expiry food
      const factoryTickets = loadedTickets.filter((ticket: FoodTicket) => {
        console.log("Checking ticket:", ticket);
        console.log("Ticket properties - foodType:", ticket.foodType, 
                   "deliveryCapability:", ticket.deliveryCapability, 
                   "status:", ticket.status, 
                   "isExpired:", ticket.isExpired);
                   
        // Check each condition separately for debugging
        const isFoodTypeExpiry = ticket.foodType === 'expiry';
        const isFactoryOnly = ticket.deliveryCapability === "factory-only";
        const isStatusExpired = ticket.status === 'expired';
        const isExpiredFlag = ticket.isExpired === true;
        
        console.log("Conditions:", {
          isFoodTypeExpiry,
          isFactoryOnly,
          isStatusExpired,
          isExpiredFlag
        });
        
        return isFoodTypeExpiry || isFactoryOnly || isStatusExpired || isExpiredFlag;
      });
      
      console.log("Filtered factory tickets:", factoryTickets);
      
      setPendingTickets(factoryTickets.filter((t: FoodTicket) => t.status === 'pending' || !t.factoryId));
      setAcceptedTickets(factoryTickets.filter((t: FoodTicket) => t.status === 'accepted' && t.factoryId === factory.id));
    } catch (error) {
      console.error("Error processing tickets:", error);
    }

    return () => window.removeEventListener("scroll", handleScroll);
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
    
    const convertedTicket = updatedTickets.find((t: FoodTicket) => t.id === ticketId);
    setAcceptedTickets(prev => prev.filter(t => t.id !== ticketId));
    setConvertedTickets(prev => [...prev, convertedTicket]);
  };
  
  const handleViewTicket = (ticketId: string) => {
    navigate(`/factory/ticket/${ticketId}`);
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className={`sticky top-0 z-10 bg-background transition-all duration-300 ${isScrolled ? "shadow-md" : "border-b"}`}
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
                  <FactoryTicketCard
                    ticket={ticket}
                    onAccept={() => handleAccept(ticket.id)}
                    onReject={() => handleReject(ticket.id)}
                    onMarkConverted={() => handleMarkConverted(ticket.id)}
                    onView={() => handleViewTicket(ticket.id)}
                    status="accepted"
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
