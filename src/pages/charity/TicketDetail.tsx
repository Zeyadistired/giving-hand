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
import { updateFoodTicket, getFoodTickets } from "@/utils/tickets";
import { getCurrentUser } from "@/utils/auth";
import { toast } from "sonner";

// Mock data removed - now using only database data

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (orgId) {
          // Load tickets for specific organization
          const allTickets = await getFoodTickets();
          const filteredTickets = allTickets
            .filter(t => t.organizationId === orgId)
            .map(t => ({
              ...t,
              deliveryCapability: t.deliveryCapability ?? "accepts-requests"
            }));
          setTickets(filteredTickets);
          if (filteredTickets.length > 0) setSelectedOrgName(filteredTickets[0].organizationName);
        } else if (ticketId) {
          // Load specific ticket
          try {
            const allTickets = await getFoodTickets();
            const foundTicket = allTickets.find(t => t.id === ticketId);

            if (foundTicket) {
              const ticketWithCapability = {
                ...foundTicket,
                deliveryCapability: foundTicket.deliveryCapability ?? "accepts-requests"
              };
              setTicket(ticketWithCapability);
            } else {
              toast.error("Ticket not found");
              navigate("/notifications");
            }
          } catch (error) {
            console.error("Error loading ticket:", error);
            toast.error("Failed to load ticket from database");
            navigate("/notifications");
          }
        } else {
          navigate("/charity");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load ticket data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [orgId, ticketId, navigate]);

  if (isLoading || (!ticket && ticketId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charity-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  const handleAccept = async (id: string) => {
    if (!ticket || !currentUser) {
      toast.error("Please log in to accept tickets");
      return;
    }

    try {
      await updateFoodTicket(id, {
        status: "accepted",
        acceptedBy: currentUser.id
      });

      setTicket({ ...ticket, status: "accepted", acceptedBy: currentUser.id });
      setIsDialogOpen(true);
      setShowDeliveryOptions(false);
      toast.success("Ticket accepted successfully!");

    } catch (error) {
      console.error("Error accepting ticket:", error);
      toast.error("Failed to accept ticket. Please try again.");
    }
  };

  const handleDecline = async (id: string) => {
    if (!ticket || !currentUser) {
      toast.error("Please log in to decline tickets");
      return;
    }

    try {
      await updateFoodTicket(id, {
        status: "declined"
      });

      setTicket({ ...ticket, status: "declined" });
      toast.success("Ticket declined");
      navigate("/notifications");

    } catch (error) {
      console.error("Error declining ticket:", error);
      toast.error("Failed to decline ticket. Please try again.");
    }
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
