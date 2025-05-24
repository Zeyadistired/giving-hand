
import { Recycle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoodTicket } from "@/types";

interface FactoryTicketCardProps {
  ticket: FoodTicket;
  onAccept: () => void;
  onReject: () => void;
  onMarkConverted: () => void;
  onView: () => void;
  status: "pending" | "accepted" | "converted";
}

export function FactoryTicketCard({ 
  ticket, 
  onAccept, 
  onReject, 
  onMarkConverted, 
  onView, 
  status 
}: FactoryTicketCardProps) {
  // Helper function to safely format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-charity-primary">{ticket.foodType}</h3>
          <p className="text-sm text-muted-foreground mb-1">From: {ticket.organizationName}</p>
          <p className="text-xs text-muted-foreground">Status: <span className="font-medium">{ticket.status}</span></p>
        </div>
        {status === "pending" && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Pending
          </Badge>
        )}
        {status === "accepted" && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            Accepted
          </Badge>
        )}
        {status === "converted" && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            Converted
          </Badge>
        )}
      </div>

      <div className="flex justify-between items-center text-sm mb-3">
        <span>Category: {ticket.category}</span>
        <span>{ticket.weight} kg {ticket.pieces ? `(${ticket.pieces} pieces)` : ""}</span>
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        <p>Expiry Date: {formatDate(ticket.expiryDate)}</p>
        <p>Created: {formatDate(ticket.createdAt)}</p>
      </div>
      
      <div className="border-t pt-3 mt-2">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onView}
          >
            View Details
          </Button>
          
          <div className="flex gap-2">
            {status === "pending" && (
              <>
                <Button 
                  size="sm" 
                  onClick={onAccept}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-1" /> Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onReject}
                  className="border-red-300 hover:bg-red-50 text-red-600"
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </>
            )}
            
            {status === "accepted" && (
              <Button 
                size="sm" 
                onClick={onMarkConverted}
                className="bg-charity-accent hover:bg-charity-dark text-white"
              >
                <Recycle className="h-4 w-4 mr-1" /> Mark as Converted
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
