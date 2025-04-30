
import { useState } from "react";
import { Clock, Calendar, Weight, Info } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoodTicket } from "@/types";

interface FoodTicketCardProps {
  ticket: FoodTicket;
  onAccept: (ticketId: string) => void;
  onDecline: (ticketId: string) => void;
  onView: (ticketId: string) => void;
}

export function FoodTicketCard({ ticket, onAccept, onDecline, onView }: FoodTicketCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAccept = () => {
    setIsProcessing(true);
    onAccept(ticket.id);
    setTimeout(() => setIsProcessing(false), 1000); // Simulate API call
  };
  
  const handleDecline = () => {
    setIsProcessing(true);
    onDecline(ticket.id);
    setTimeout(() => setIsProcessing(false), 1000); // Simulate API call
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      prepared: "bg-blue-100 text-blue-800",
      produce: "bg-green-100 text-green-800",
      bakery: "bg-amber-100 text-amber-800",
      dairy: "bg-indigo-100 text-indigo-800",
      meat: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      hour: "numeric", 
      minute: "numeric" 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-charity-primary">{ticket.organizationName}</h3>
            <p className="text-sm text-muted-foreground">Food donation available</p>
          </div>
          <Badge className={`font-normal ${getCategoryColor(ticket.category)}`}>
            {ticket.category}
          </Badge>
        </div>
        
        <div className="space-y-2 my-3">
          <div className="flex items-center text-sm">
            <Info className="h-4 w-4 mr-2 text-charity-primary" />
            <span>{ticket.foodType}</span>
          </div>
          <div className="flex items-center text-sm">
            <Weight className="h-4 w-4 mr-2 text-charity-primary" />
            <span>{ticket.weight} kg</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-charity-primary" />
            <span>Expires: {formatDate(ticket.expiryDate)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-charity-primary" />
            <span>Posted: {formatDate(ticket.createdAt)}</span>
          </div>
        </div>
        
        <Button 
          variant="link" 
          className="p-0 h-auto text-charity-primary"
          onClick={() => onView(ticket.id)}
        >
          View details
        </Button>
      </CardContent>
      
      {ticket.status === "pending" && (
        <CardFooter className="grid grid-cols-2 gap-2 px-4 pb-4 pt-0">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={isProcessing}
            className="border-gray-300 hover:bg-gray-100 hover:text-gray-800"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="bg-charity-primary hover:bg-charity-dark"
          >
            Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
