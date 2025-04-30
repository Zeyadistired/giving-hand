import { 
  Calendar, 
  Clock, 
  Info, 
  MapPin, 
  User, 
  Weight, 
  Utensils, 
  Package
} from "lucide-react";
import { FoodTicket } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TicketDetailsProps {
  ticket: FoodTicket;
  onAccept?: (ticketId: string) => void;
  onDecline?: (ticketId: string) => void;
  showActions?: boolean;
  showDeliveryButton?: boolean;
  onProceedToDelivery?: (ticketId: string) => void;
}

export function TicketDetails({ 
  ticket, 
  onAccept, 
  onDecline,
  showActions = true,
  showDeliveryButton,
  onProceedToDelivery
}: TicketDetailsProps) {
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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "short",
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "numeric", 
      minute: "numeric" 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-charity-primary">
              {ticket.foodType}
            </h2>
            <p className="text-sm text-muted-foreground">
              From {ticket.organizationName}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getCategoryColor(ticket.category)}>
              {ticket.category}
            </Badge>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-charity-light p-2 rounded-full">
              <User className="h-5 w-5 text-charity-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Provider</h3>
              <p>{ticket.organizationName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-charity-light p-2 rounded-full">
              <Utensils className="h-5 w-5 text-charity-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Food Type</h3>
              <p>{ticket.foodType}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-charity-light p-2 rounded-full">
              <Weight className="h-5 w-5 text-charity-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Weight</h3>
              <p>{ticket.weight} kg</p>
            </div>
          </div>
          
          {ticket.pieces && (
            <div className="flex items-center gap-3">
              <div className="bg-charity-light p-2 rounded-full">
                <Package className="h-5 w-5 text-charity-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Pieces</h3>
                <p>{ticket.pieces} pieces</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="bg-charity-light p-2 rounded-full">
              <Calendar className="h-5 w-5 text-charity-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Expiry Date</h3>
              <p>{formatDate(ticket.expiryDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-charity-light p-2 rounded-full">
              <Clock className="h-5 w-5 text-charity-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Posted</h3>
              <p>{formatDate(ticket.createdAt)}</p>
            </div>
          </div>
          
          {ticket.notes && (
            <div className="flex items-start gap-3">
              <div className="bg-charity-light p-2 rounded-full mt-0.5">
                <Info className="h-5 w-5 text-charity-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Additional Notes</h3>
                <p className="text-sm">{ticket.notes}</p>
              </div>
            </div>
          )}
          
          {/* Approximate distance - in a real app, would be calculated */}
          <div className="flex items-center gap-3">
            <div className="bg-charity-light p-2 rounded-full">
              <MapPin className="h-5 w-5 text-charity-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Approximate Distance</h3>
              <p>2.5 km away</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      {showActions && ticket.status === "pending" && onAccept && onDecline && (
        <CardFooter className="grid grid-cols-2 gap-3 p-5 pt-0">
          <Button
            variant="outline"
            onClick={() => onDecline(ticket.id)}
          >
            Decline
          </Button>
          <Button
            onClick={() => onAccept(ticket.id)}
            className="bg-charity-primary hover:bg-charity-dark"
          >
            Accept
          </Button>
        </CardFooter>
      )}

      {showDeliveryButton && ticket.status === "accepted" && onProceedToDelivery && (
        <CardFooter className="p-5 pt-0">
          <Button
            onClick={() => onProceedToDelivery(ticket.id)}
            className="w-full bg-charity-accent hover:bg-charity-accent/90"
          >
            Proceed to Delivery Options
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
