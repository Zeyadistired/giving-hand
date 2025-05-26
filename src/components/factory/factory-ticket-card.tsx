
import { Recycle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoodTicket } from "@/types";

interface FactoryTicketCardProps {
  ticket: FoodTicket;
  onAccept: () => void;
  onReject: () => void;
  onMarkConverted: () => void;
  onRejectConversion?: () => void; // New prop for rejecting conversion
  onView: () => void;
  status: "pending" | "accepted" | "converted" | "rejected"; // Added rejected status
  showConversionButtons?: boolean; // New prop to control visibility
}

export function FactoryTicketCard({ 
  ticket, 
  onAccept, 
  onReject, 
  onMarkConverted,
  onRejectConversion,
  onView, 
  status,
  showConversionButtons = false // Default to hidden
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

  // Debug log to check status and showConversionButtons values
  console.log("FactoryTicketCard Debug:", { 
    ticketId: ticket.id,
    ticketStatus: ticket.status, 
    componentStatus: status,
    showButtons: showConversionButtons 
  });

  return (
    <div className="border rounded-lg p-4 bg-white relative group">
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
        {status === "rejected" && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            Rejected
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
              <div className="opacity-100 transition-opacity duration-200">
                <button
                  onClick={onMarkConverted}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "1px solid #28a745",
                    padding: "6px 12px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    opacity: 1,
                    visibility: "visible"
                  }}
                >
                  <Check className="h-4 w-4 mr-1" /> Accept Request
                </button>
              </div>
            )}
            
            {status === "accepted" && onRejectConversion && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={onRejectConversion}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "1px solid #dc3545",
                    padding: "6px 12px",
                    fontSize: "14px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Reject Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
