import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { TicketDetails } from "@/components/tickets/ticket-details";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FoodTicket, DeliveryMethod, OrgDeliveryCapability } from "@/types";

const mockTickets: FoodTicket[] = [
  {
    id: "1",
    organizationId: "4",
    organizationName: "Skyline Restaurant",
    foodType: "Assorted Buffet Items",
    category: "prepared",
    weight: 5.2,
    pieces: 20,
    expiryDate: "2025-04-18T20:00:00.000Z",
    notes: "Contains rice, vegetables, and chicken dishes. All properly stored and packaged.",
    createdAt: "2025-04-17T15:30:00.000Z",
    status: "pending",
  },
  {
    id: "2",
    organizationId: "1",
    organizationName: "Gourmet Palace Hotel",
    foodType: "Breakfast Pastries",
    category: "bakery",
    weight: 3.5,
    pieces: 40,
    expiryDate: "2025-04-18T12:00:00.000Z",
    notes: "Assorted croissants, muffins, and Danish pastries from breakfast buffet.",
    createdAt: "2025-04-17T09:15:00.000Z",
    status: "pending",
  },
  {
    id: "3",
    organizationId: "3",
    organizationName: "Fathalla Supermarket",
    foodType: "Fresh Produce",
    category: "produce",
    weight: 8.0,
    expiryDate: "2025-04-20T23:59:00.000Z",
    notes: "Mixed vegetables and fruits, all in good condition, slight cosmetic imperfections.",
    createdAt: "2025-04-17T10:45:00.000Z",
    status: "pending",
  },
  {
    id: "4",
    organizationId: "2",
    organizationName: "Fresh Market Supermarket",
    foodType: "Dairy Products",
    category: "dairy",
    weight: 4.5,
    expiryDate: "2025-04-19T23:59:00.000Z",
    notes: "Milk, yogurt, and cheese approaching sell-by date but still fresh.",
    createdAt: "2025-04-16T16:20:00.000Z",
    status: "accepted",
    acceptedBy: "Your Charity",
  },
];

export default function TicketDetail() {
  const { orgId, ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<FoodTicket | null>(null);
  const [tickets, setTickets] = useState<FoodTicket[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod>(() => {
    if (ticketId) {
      const savedMethod = localStorage.getItem(`delivery-method-${ticketId}`);
      return (savedMethod as DeliveryMethod) || "self-pickup";
    }
    return "self-pickup";
  });
  const [orgDeliveryRequested, setOrgDeliveryRequested] = useState(() => {
    if (ticketId) {
      return localStorage.getItem(`delivery-requested-${ticketId}`) === "true";
    }
    return false;
  });
  const [orgDeliveryPending, setOrgDeliveryPending] = useState(() => {
    if (ticketId) {
      return localStorage.getItem(`delivery-pending-${ticketId}`) === "true";
    }
    return false;
  });
  const [selectedOrgName, setSelectedOrgName] = useState<string>("");
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);

  useEffect(() => {
    if (orgId) {
      const filteredTickets = mockTickets
        .map(t => ({
          ...t, 
          deliveryCapability: t.deliveryCapability ?? "accepts-requests"
        }))
        .filter(t => t.organizationId === orgId);
      setTickets(filteredTickets);
      if (filteredTickets.length > 0) setSelectedOrgName(filteredTickets[0].organizationName);
    } else if (ticketId) {
      const foundTicketRaw = mockTickets.find(t => t.id === ticketId);
      const foundTicket = foundTicketRaw
        ? { ...foundTicketRaw, deliveryCapability: foundTicketRaw.deliveryCapability ?? "accepts-requests" }
        : undefined;
      if (foundTicket) {
        setTicket(foundTicket);
      } else {
        const localStorageTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
        const localTicket = localStorageTickets.find((t: any) => t.id === ticketId);
        
        if (localTicket) {
          const ticketWithCapability = {
            ...localTicket,
            deliveryCapability: localTicket.deliveryCapability ?? "accepts-requests"
          };
          setTicket(ticketWithCapability);
        } else {
          navigate("/notifications");
        }
      }
    } else {
      navigate("/charity");
    }
  }, [orgId, ticketId, navigate]);

  if (!ticket && ticketId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading ticket details...</p>
      </div>
    );
  }

  const handleAccept = (id: string) => {
    if (!ticket) return;
    setTicket({ ...ticket, status: "accepted", acceptedBy: "Your Charity" });
    setIsDialogOpen(true);
    setShowDeliveryOptions(false);
  };

  const handleDecline = (id: string) => {
    if (!ticket) return;
    setTicket({ ...ticket, status: "declined" });
    navigate("/notifications");
  };

  const handleDeliveryMethodSelect = (method: DeliveryMethod) => {
    setSelectedDeliveryMethod(method);
    if (ticketId) {
      localStorage.setItem(`delivery-method-${ticketId}`, method);
    }
  };

  const handleDeliveryConfirm = () => {
    if (!ticket) return;
    setIsDialogOpen(false);

    if (selectedDeliveryMethod === "organization-delivery") {
      setOrgDeliveryRequested(true);
      setOrgDeliveryPending(true);
      
      if (ticketId) {
        localStorage.setItem(`delivery-requested-${ticketId}`, "true");
        localStorage.setItem(`delivery-pending-${ticketId}`, "true");
      }

      const updatedTicket = {
        ...ticket,
        orgDeliveryStatus: "pending" as "pending" | "accepted" | "declined",
      };
      setTicket(updatedTicket);

      const newTracking = {
        id: `track-${Date.now()}`,
        ticketId: ticket.id,
        organizationName: ticket.organizationName,
        category: ticket.category,
        quantity: `${ticket.weight}kg${ticket.pieces ? ` (${ticket.pieces} pieces)` : ''}`,
        status: "pending",
        deliveryMethod: "organization-delivery",
        deliveryDate: new Date().toISOString(),
      };

      const existingTracking = JSON.parse(localStorage.getItem('meal-tracking') || '[]');
      localStorage.setItem('meal-tracking', JSON.stringify([...existingTracking, newTracking]));

      return;
    }

    setTimeout(() => {
      navigate("/charity/collaborations");
    }, 500);
  };

  const showOrgDeliveryOption = ticket && (
    ticket.deliveryCapability === "self-delivery" || 
    ticket.deliveryCapability === "accepts-requests"
  );

  const deliveryMethodOptions = [
    {
      value: "self-pickup",
      label: "Self Pickup",
      description: "Pick up the food donation from the organization's location.",
      available: true,
      icon: "truck",
    },
    {
      value: "shipping",
      label: "Third-Party Delivery",
      description: "Use a shipping company (e.g., Bosta, Yalla Fel Sekka). Extra fees may apply.",
      available: true,
      icon: "truck",
      estimatedFee: "Est. 50–90 EGP",
    },
    {
      value: "organization-delivery",
      label: "Delivery via Organization",
      description: "Request that the organization delivers the food to you.",
      available: ticket && (ticket.deliveryCapability === "self-delivery" || ticket.deliveryCapability === "accepts-requests"),
      icon: "truck",
      estimatedFee: "Est. 40–70 EGP",
    },
  ];

  if (orgId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">
              {selectedOrgName || "Organization"} Tickets
            </h1>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-20">
          {tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div 
                  key={ticket.id}
                  className="border rounded-lg p-4 cursor-pointer hover:border-charity-tertiary"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <h3 className="font-medium text-charity-primary">{ticket.foodType}</h3>
                  <p className="text-sm text-muted-foreground">{ticket.category}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">{ticket.weight} kg</p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(ticket.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground text-center">
                This organization hasn't shared any donation tickets yet.
              </p>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => navigate("/charity")}
              >
                Back to Organizations
              </Button>
            </div>
          )}
        </main>

        <BottomNav userRole="charity" />
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
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Ticket Details</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <TicketDetails
          ticket={ticket}
          onAccept={handleAccept}
          onDecline={handleDecline}
          showDeliveryButton={ticket.status === "accepted" && !showDeliveryOptions}
          onProceedToDelivery={() => setShowDeliveryOptions(true)}
        />
        {ticket.status === "accepted" && showDeliveryOptions && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span>🚚 Delivery Options</span>
            </h2>
            <ul className="space-y-3">
              {deliveryMethodOptions
                .filter(option => option.available)
                .map(option => (
                  <li
                    key={option.value}
                    className={`rounded border p-4 flex items-start justify-between ${
                      selectedDeliveryMethod === option.value ? "border-charity-primary bg-charity-light" : "border-gray-200 bg-white"
                    }`}
                  >
                    <label className="flex-1 flex items-start gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="delivery-method"
                        value={option.value}
                        checked={selectedDeliveryMethod === option.value}
                        onChange={() => handleDeliveryMethodSelect(option.value as DeliveryMethod)}
                        className="mt-1"
                        disabled={
                          orgDeliveryPending && option.value === "organization-delivery"
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1 font-medium">
                          <svg className="inline-block mr-1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
                            <use href="#icon-truck" />
                          </svg>
                          {option.label}
                          {option.value === "organization-delivery" && (
                            <span className="ml-2 px-2 py-0.5 rounded text-xs bg-charity-accent/20 text-charity-accent font-medium">
                              Needs org approval
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                        {option.estimatedFee && (
                          <div className="text-xs mt-1 text-charity-secondary">{option.estimatedFee}</div>
                        )}
                      </div>
                    </label>
                  </li>
                ))}
            </ul>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeliveryOptions(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-charity-accent"
                onClick={handleDeliveryConfirm}
                disabled={selectedDeliveryMethod === "organization-delivery" && orgDeliveryPending}
              >
                {selectedDeliveryMethod === "organization-delivery"
                  ? orgDeliveryPending
                    ? "Request Pending Approval..."
                    : "Request Delivery"
                  : "Confirm"}
              </Button>
            </div>
            {selectedDeliveryMethod === "organization-delivery" && (
              <div className="mt-4">
                {orgDeliveryPending && (
                  <div className="text-yellow-700 bg-yellow-50 px-4 py-2 rounded flex items-center gap-2">
                    <span>⚠️ Pending approval from the organization...</span>
                  </div>
                )}
                {ticket.orgDeliveryStatus === "accepted" && (
                  <div className="text-green-700 bg-green-50 px-4 py-2 rounded flex items-center gap-2">
                    <span>✅ Organization has approved your delivery request!</span>
                  </div>
                )}
                {ticket.orgDeliveryStatus === "declined" && (
                  <div className="text-red-700 bg-red-50 px-4 py-2 rounded flex items-center gap-2">
                    <span>❌ The organization declined your delivery request.</span>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Delivery Method</DialogTitle>
            <DialogDescription>
              How would you like to receive this food donation?
            </DialogDescription>
          </DialogHeader>
          
          <RadioGroup
            value={selectedDeliveryMethod}
            onValueChange={(value) => setSelectedDeliveryMethod(value as DeliveryMethod)}
            className="grid gap-4 py-4"
          >
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="self-pickup" id="self-pickup" />
              <div className="grid gap-1.5">
                <Label htmlFor="self-pickup" className="font-medium">Self Pickup</Label>
                <p className="text-sm text-muted-foreground">
                  Pick up the food donation from the organization's location.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="organization-delivery" id="organization-delivery" />
              <div className="grid gap-1.5">
                <Label htmlFor="organization-delivery" className="font-medium">Organization Delivery</Label>
                <p className="text-sm text-muted-foreground">
                  The organization will deliver the food to your location.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="shipping" id="shipping" />
              <div className="grid gap-1.5">
                <Label htmlFor="shipping" className="font-medium">Third-Party Shipping</Label>
                <p className="text-sm text-muted-foreground">
                  Use a shipping company to deliver the food (additional fees may apply).
                </p>
              </div>
            </div>
          </RadioGroup>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeliveryConfirm}
              className="bg-charity-primary hover:bg-charity-dark"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav userRole="charity" />
    </div>
  );
}
