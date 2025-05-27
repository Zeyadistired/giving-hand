import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Recycle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { FoodTicket, DeliveryMethod } from "@/types";
import { getUserSession } from "@/utils/auth";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFoodTicketsEnhanced, updateFoodTicket } from "@/utils/tickets";

export default function FactoryTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<FoodTicket | null>(null);
  const [factory, setFactory] = useState({
    name: "",
    id: ""
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("self-pickup");
  const [showDeliverySelect, setShowDeliverySelect] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = getUserSession();
      if (currentUser) {
        setFactory({
          name: currentUser.name,
          id: currentUser.id
        });
      }

      if (!ticketId) {
        navigate("/factory");
        return;
      }

      try {
        const allTickets = await getFoodTicketsEnhanced();
        const foundTicket = allTickets.find((t: FoodTicket) => t.id === ticketId);

        if (!foundTicket) {
          toast.error("Ticket not found");
          navigate("/factory");
          return;
        }

        setTicket(foundTicket);
      } catch (error) {
        console.error("Error loading ticket:", error);
        toast.error("Failed to load ticket");
        navigate("/factory");
      }
    };

    loadData();
  }, [ticketId, navigate]);

  const handleAccept = () => {
    if (!ticket) return;
    setShowDeliverySelect(true);
  };

  const handleConfirmAccept = async () => {
    if (!ticket) return;

    try {
      const updatedTicket = await updateFoodTicket(ticketId!, {
        status: "accepted",
        factoryId: factory.id,
        factoryName: factory.name,
        deliveryMethod: deliveryMethod
      });

      setTicket(updatedTicket);
      setShowDeliverySelect(false);
      toast.success("Request accepted successfully");
    } catch (error) {
      console.error("Error accepting ticket:", error);
      toast.error("Failed to accept request. Please try again.");
    }
  };

  const handleReject = async () => {
    if (!ticket) return;

    try {
      await updateFoodTicket(ticketId!, {
        status: "declined",
        conversionStatus: "rejected"
      });

      toast.info("Request rejected");
      navigate("/factory");
    } catch (error) {
      console.error("Error rejecting ticket:", error);
      toast.error("Failed to reject request. Please try again.");
    }
  };

  const handleMarkConverted = async () => {
    if (!ticket) return;

    try {
      const updatedTicket = await updateFoodTicket(ticketId!, {
        conversionStatus: "converted"
      });

      setTicket(updatedTicket);
      toast.success("Food marked as converted successfully");
    } catch (error) {
      console.error("Error marking as converted:", error);
      toast.error("Failed to mark as converted. Please try again.");
    }
  };

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading ticket details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/factory")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Food Conversion Request</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="bg-green-50 border border-green-200 rounded-md mb-6 p-4">
          <p className="text-green-800 font-medium">Status: {ticket.conversionStatus === "converted" ? "Converted" : ticket.status === "accepted" ? "Accepted" : "Pending"}</p>
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-charity-primary">{ticket.foodType}</h2>
            <p className="text-sm text-muted-foreground">Category: {ticket.category}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-medium">{ticket.organizationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantity</p>
              <p className="font-medium">{ticket.weight} kg {ticket.pieces ? `(${ticket.pieces} pieces)` : ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Expiry Date</p>
              <p className="font-medium">{new Date(ticket.expiryDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {ticket.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="p-3 bg-gray-50 rounded-md">{ticket.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {showDeliverySelect ? (
            <div className="space-y-4">
              <h3 className="font-medium">Select Delivery Method</h3>
              <Select value={deliveryMethod} onValueChange={(value: DeliveryMethod) => setDeliveryMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self-pickup">Self Pickup</SelectItem>
                  <SelectItem value="organization-delivery">Organization Delivers</SelectItem>
                  <SelectItem value="factory-delivery">Factory Delivers</SelectItem>
                  <SelectItem value="shipping">Third Party Shipping</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleConfirmAccept} className="w-full">
                Confirm Accept
              </Button>
              <Button variant="outline" onClick={() => setShowDeliverySelect(false)} className="w-full">
                Cancel
              </Button>
            </div>
          ) : (
            <>
              {ticket?.status !== "accepted" && ticket?.conversionStatus !== "converted" && (
                <>
                  <Button
                    onClick={handleAccept}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" /> Accept Request
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="border-red-300 hover:bg-red-50 text-red-600"
                  >
                    <X className="h-4 w-4 mr-2" /> Reject Request
                  </Button>
                </>
              )}
            </>
          )}

          {ticket.status === "accepted" && ticket.conversionStatus !== "converted" && (
            <Button
              onClick={handleMarkConverted}
              className="bg-charity-accent hover:bg-charity-dark text-white"
            >
              <Recycle className="h-4 w-4 mr-2" /> Mark as Converted
            </Button>
          )}

          {ticket.conversionStatus === "converted" && (
            <div className="bg-green-100 border border-green-300 rounded-md p-4 text-center">
              <Recycle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-green-800 font-medium">This food has been successfully converted</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav userRole="factory" />
    </div>
  );
}
