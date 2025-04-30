import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Refrigerator, Boxes, PackageCheck, Clock, CheckCircle, X, LogOut, Home as HomeIcon, Baby, Cat, PersonStanding, Soup, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BottomNav } from "@/components/ui/bottom-nav";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CharityCard } from "@/components/guest/charity-card";
import { Input } from "@/components/ui/input";
import { Charity, CharityType, CharityCategory } from "@/types";
import { LocationConsentDialog } from "@/components/tracking/location-consent-dialog";
import { toast } from "sonner";
import { getUserSession, saveUserPreference, getUserPreference, clearUserSession } from "@/utils/auth";

const mockCharities: Charity[] = [
  {
    id: "1",
    name: "Nile Ritz-Carlton Shelter",
    type: "charity",
    category: "homeless",
    email: "shelter@nileritz.org",
    description: "Providing shelter and support services for homeless individuals in Cairo.",
  },
  {
    id: "2",
    name: "Fairmont Children's Haven",
    type: "charity",
    category: "children",
    email: "kids@fairmontcharity.org",
    description: "Supporting underprivileged children with education and care services.",
  },
  {
    id: "3",
    name: "Kempinski Animal Sanctuary",
    type: "charity",
    category: "animal",
    email: "pets@kempinskisanctuary.org",
    description: "Rescuing and rehabilitating street animals in the Cairo area.",
  },
  {
    id: "4",
    name: "Marriott Elderly Care Center",
    type: "charity",
    category: "elderly",
    email: "care@marriottelderly.org",
    description: "Providing care and support for elderly residents in need.",
  },
  {
    id: "5",
    name: "Four Seasons Food Bank",
    type: "charity",
    category: "foodbank",
    email: "food@fourseasonsbank.org",
    description: "Distributing meals and groceries to families in need.",
  },
  {
    id: "6",
    name: "InterContinental Youth Shelter",
    type: "charity",
    category: "homeless",
    email: "youth@interconshelter.org",
    description: "Specialized shelter focusing on homeless youth and young adults.",
  },
  {
    id: "7",
    name: "Hilton Children's Foundation",
    type: "charity",
    category: "children",
    email: "support@hiltonkids.org",
    description: "Providing educational support and meals for underprivileged children.",
  },
  {
    id: "8",
    name: "Zamalek Animal Rescue",
    type: "charity",
    category: "animal",
    email: "rescue@zamalekpets.org",
    description: "Animal rescue and adoption services in the Zamalek district.",
  },
  {
    id: "9",
    name: "Pyramids Senior Care",
    type: "charity",
    category: "elderly",
    email: "care@pyramidssenior.org",
    description: "Comprehensive care services for elderly individuals in Giza area.",
  },
  {
    id: "10",
    name: "Cairo Community Food Bank",
    type: "charity",
    category: "foodbank",
    email: "help@cairofoodbank.org",
    description: "Large-scale food distribution network serving Greater Cairo.",
  },
  {
    id: "11",
    name: "Guardian House Shelter",
    type: "charity",
    category: "homeless",
    email: "info@guardianhouse.org",
    description: "Emergency shelter and long-term housing assistance programs.",
  },
  {
    id: "12",
    name: "Bella Casa Children's Home",
    type: "charity",
    category: "children",
    email: "home@bellacasa.org",
    description: "Providing safe housing and care for orphaned children.",
  },
  {
    id: "13",
    name: "Happy City Pet Sanctuary",
    type: "charity",
    category: "animal",
    email: "pets@happycity.org",
    description: "No-kill animal shelter providing care and adoption services.",
  },
  {
    id: "14",
    name: "Golden Years Foundation",
    type: "charity",
    category: "elderly",
    email: "support@goldenyears.org",
    description: "Supporting elderly residents with meals and social programs.",
  },
  {
    id: "15",
    name: "Nile Valley Food Relief",
    type: "charity",
    category: "foodbank",
    email: "relief@nilevalley.org",
    description: "Emergency food assistance and regular meal distribution programs.",
  }
];

const mockDeliveryRequests = [
  {
    id: "dr1",
    charityName: "Nile Ritz-Carlton Shelter",
    ticketId: "t123",
    requestDate: "2025-04-21",
    status: "pending",
    fee: 25,
  },
  {
    id: "dr2",
    charityName: "Fairmont Children's Haven",
    ticketId: "t456",
    requestDate: "2025-04-20",
    status: "accepted",
    fee: 35,
  },
];

const mockDonationHistory = [
  {
    id: "d1",
    charityName: "Nile Ritz-Carlton Shelter",
    foodType: "Prepared Meals",
    date: "2025-04-18",
    status: "delivered",
  },
  {
    id: "d2",
    charityName: "Kempinski Animal Sanctuary",
    foodType: "Packaged Food",
    date: "2025-04-15",
    status: "delivered",
  },
];

export default function OrganizationHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    return getUserPreference('orgHomeActiveTab', 'guidelines');
  });
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [deliveryRequests, setDeliveryRequests] = useState(() => {
    const savedRequests = localStorage.getItem("org-delivery-requests");
    if (savedRequests) {
      return JSON.parse(savedRequests);
    }
    
    const userRequests = getUserPreference('orgDeliveryRequests', mockDeliveryRequests);
    return userRequests;
  });
  const [selectedCategory, setSelectedCategory] = useState<CharityCategory | "all">("all");

  const categoryIcons = {
    homeless: HomeIcon,
    children: Baby,
    animal: Cat,
    elderly: PersonStanding,
    foodbank: Soup,
  };

  const filteredCharities = mockCharities.filter(
    charity => selectedCategory === "all" || charity.category === selectedCategory
  );

  useEffect(() => {
    saveUserPreference('orgHomeActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    saveUserPreference('orgDeliveryRequests', deliveryRequests);
  }, [deliveryRequests]);

  useEffect(() => {
    const hasShownLocationPrompt = getUserPreference('orgLocationPromptShown', false);
    if (!hasShownLocationPrompt) {
      setShowLocationPrompt(true);
      saveUserPreference('orgLocationPromptShown', true);
    }
    
    const user = getUserSession();
    if (!user) {
      navigate("/login");
      return;
    }
    


    const foodTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    const pendingDeliveryRequests = foodTickets
      .filter((ticket: any) => ticket.orgDeliveryStatus === "pending")
      .map((ticket: any) => ({
        id: `dr-${ticket.id}`,
        charityName: ticket.acceptedBy || "Charity",
        ticketId: ticket.id,
        requestDate: new Date().toISOString().split("T")[0],
        status: "pending",
        fee: Math.floor(Math.random() * 40) + 20,
      }));
    
    if (pendingDeliveryRequests.length > 0) {
      const newDeliveryRequests = [...deliveryRequests];
      
      pendingDeliveryRequests.forEach((request: any) => {
        if (!newDeliveryRequests.some(r => r.ticketId === request.ticketId)) {
          newDeliveryRequests.push(request);
        }
      });
      
      setDeliveryRequests(newDeliveryRequests);
      saveUserPreference('orgDeliveryRequests', newDeliveryRequests);
    }
  }, [navigate, deliveryRequests]);

  const guidelines = [
    {
      icon: Refrigerator,
      title: "Keep food in refrigerator",
      description: "Store perishable foods at appropriate temperatures to maintain freshness and safety.",
    },
    {
      icon: Boxes,
      title: "Keep every food kind separated",
      description: "Separate different types of food to prevent cross-contamination and maintain quality.",
    },
    {
      icon: PackageCheck,
      title: "Easily spoiled food has to be in a sealed box",
      description: "Use airtight containers for foods that spoil quickly to extend shelf life and prevent contamination.",
    },
    {
      icon: Heart,
      title: "Deliver the food safely",
      description: "Ensure proper handling during transport to maintain food quality and safety standards.",
    },
  ];

  const handleAcceptDeliveryRequest = (requestId: string) => {
    const requestIndex = deliveryRequests.findIndex((req: any) => req.id === requestId);
    if (requestIndex === -1) return;
    
    const request = deliveryRequests[requestIndex];
    
    const updatedRequests = [...deliveryRequests];
    updatedRequests[requestIndex] = {
      ...request,
      status: "accepted"
    };
    
    saveUserPreference('orgDeliveryRequests', updatedRequests);
    localStorage.setItem("org-delivery-requests", JSON.stringify(updatedRequests));
    setDeliveryRequests(updatedRequests);
    
    const ticketId = request.ticketId;
    const foodTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    const ticketIndex = foodTickets.findIndex((t: any) => t.id === ticketId);
    
    if (ticketIndex !== -1) {
      const updatedTickets = [...foodTickets];
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        orgDeliveryStatus: "accepted"
      };
      localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
    }
    
    const newTracking = {
      id: `track-${Date.now()}`,
      ticketId: ticketId,
      organizationName: "Your Organization",
      category: "prepared",
      quantity: "Package",
      status: "in-transit",
      deliveryMethod: "organization-delivery",
      deliveryDate: new Date().toISOString(),
    };
    
    const existingTracking = JSON.parse(localStorage.getItem('meal-tracking') || '[]');
    const updatedTracking = [...existingTracking, newTracking];
    localStorage.setItem('meal-tracking', JSON.stringify(updatedTracking));
    saveUserPreference('mealTracking', updatedTracking);
    
    toast.success(`Delivery request from ${request.charityName} accepted!`);
  };

  const handleRejectDeliveryRequest = (requestId: string) => {
    const requestIndex = deliveryRequests.findIndex((req: any) => req.id === requestId);
    if (requestIndex === -1) return;
    
    const request = deliveryRequests[requestIndex];
    
    const updatedRequests = deliveryRequests.filter((req: any) => req.id !== requestId);
    
    saveUserPreference('orgDeliveryRequests', updatedRequests);
    localStorage.setItem("org-delivery-requests", JSON.stringify(updatedRequests));
    setDeliveryRequests(updatedRequests);
    
    const ticketId = request.ticketId;
    const foodTickets = JSON.parse(localStorage.getItem("foodTickets") || "[]");
    const ticketIndex = foodTickets.findIndex((t: any) => t.id === ticketId);
    
    if (ticketIndex !== -1) {
      const updatedTickets = [...foodTickets];
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        orgDeliveryStatus: "declined"
      };
      localStorage.setItem("foodTickets", JSON.stringify(updatedTickets));
    }
    
    toast.error(`Delivery request from ${request.charityName} rejected.`);
  };

  const handleLogout = () => {
    clearUserSession();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 px-4 py-6 pb-20">
        <img
          src="/lovable-uploads/org-banner.jpg"
          alt="Organization Banner"
          className="w-full max-h-52 object-cover object-[center_64%] mt-2 rounded-xl mb-6 shadow-md"
        />
        <EditableWrapper>
          <h1 className="text-2xl font-bold text-charity-primary mb-6 text-center">
            Welcome, Organization!
          </h1>
        </EditableWrapper>
        <div className="flex flex-col items-center gap-4 mb-8">
          <EditableWrapper>
            <Button
              className="w-full max-w-sm bg-charity-primary hover:bg-charity-dark text-lg py-3"
              onClick={() => navigate("/organization/create-ticket")}
            >
              <Heart className="h-5 w-5 mr-2" />
              Create Food Ticket
            </Button>
          </EditableWrapper>
          <EditableWrapper>
            <Button
              variant="outline"
              className="w-full max-w-sm text-lg py-3"
              onClick={() => navigate("/organization/help")}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Help Center
            </Button>
          </EditableWrapper>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="deliveryRequests">Delivery Requests</TabsTrigger>
            <TabsTrigger value="donationHistory">Donation History</TabsTrigger>
            <TabsTrigger value="charitiesShelters">Charities/Shelters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guidelines" className="space-y-4">
            <EditableWrapper>
              <h2 className="text-xl font-semibold mb-3 text-charity-primary text-center">
                Food Handling Instructions
              </h2>
            </EditableWrapper>

            <div className="space-y-4 mb-6 max-w-lg mx-auto">
              {guidelines.map((guideline, index) => (
                <Card key={index} className="overflow-hidden border-gray-200">
                  <CardContent className="p-4 flex items-start">
                    <div className="bg-charity-light p-3 rounded-full mr-4">
                      <guideline.icon className="h-6 w-6 text-charity-primary" />
                    </div>
                    <div>
                      <EditableWrapper>
                        <h3 className="font-medium text-charity-primary">{guideline.title}</h3>
                      </EditableWrapper>
                      <EditableWrapper>
                        <p className="text-sm text-muted-foreground mt-1">{guideline.description}</p>
                      </EditableWrapper>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground px-4">
              <EditableWrapper>
                Following these guidelines helps ensure that donated food remains safe and high-quality for those in need. Thank you for your contribution to food safety!
              </EditableWrapper>
            </div>
          </TabsContent>
          
          <TabsContent value="deliveryRequests" className="space-y-4">
            <h2 className="text-xl font-semibold mb-3 text-charity-primary text-center">
              Delivery Requests
            </h2>
            
            {deliveryRequests.length > 0 ? (
              deliveryRequests
                .filter((request: any) => request.status === "pending")
                .map((request: any) => (
                <Card key={request.id} className="overflow-hidden border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-charity-primary">{request.charityName}</h3>
                        <p className="text-sm text-muted-foreground">Ticket: {request.ticketId}</p>
                        <p className="text-sm text-muted-foreground">Date: {request.requestDate}</p>
                        <p className="text-sm font-medium mt-1">Delivery Fee: EGP {request.fee}</p>
                      </div>
                      <div className="flex gap-2">
                        {request.status === "pending" ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                              onClick={() => handleRejectDeliveryRequest(request.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptDeliveryRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {request.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No delivery requests at this time.</p>
              </div>
            )}
            
            {deliveryRequests.filter((request: any) => request.status !== "pending").length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2 text-charity-primary">
                  Handled Requests
                </h3>
                <div className="space-y-3 opacity-75">
                  {deliveryRequests
                    .filter((request: any) => request.status !== "pending")
                    .map((request: any) => (
                    <Card key={request.id} className="overflow-hidden border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-charity-primary">{request.charityName}</h3>
                            <p className="text-sm text-muted-foreground">Ticket: {request.ticketId}</p>
                            <p className="text-sm text-muted-foreground">Date: {request.requestDate}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {request.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="donationHistory" className="space-y-4">
            <h2 className="text-xl font-semibold mb-3 text-charity-primary text-center">
              Donation History
            </h2>
            
            {mockDonationHistory.length > 0 ? (
              mockDonationHistory.map((donation) => (
                <Card key={donation.id} className="overflow-hidden border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-charity-primary">{donation.charityName}</h3>
                        <p className="text-sm text-muted-foreground">Type: {donation.foodType}</p>
                        <p className="text-sm text-muted-foreground">Date: {donation.date}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {donation.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No donation history available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="charitiesShelters" className="space-y-4">
            <h2 className="text-xl font-semibold mb-3 text-charity-primary text-center">
              Charities & Shelters
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="flex items-center gap-2"
              >
                All Categories
              </Button>
              {Object.entries(categoryIcons).map(([category, Icon]) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category as CharityCategory)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex flex-col gap-4 max-w-lg mx-auto">
              {filteredCharities.length > 0 ? (
                filteredCharities.map((charity) => (
                  <CharityCard
                    key={charity.id}
                    charity={charity}
                    onClick={() => {}}
                    isSelected={false}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No charities or shelters found in this category.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav userRole="organization" hideHelp />
      <LocationConsentDialog userType="organization" />
    </div>
  );
}
