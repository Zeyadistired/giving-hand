import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Refrigerator, Boxes, PackageCheck, Clock, CheckCircle, X, Home as HomeIcon, Baby, Cat, PersonStanding, Soup, HelpCircle, ChevronRight } from "lucide-react";
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
import { getCurrentUser } from "@/utils/auth";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { getFoodTickets, getDeliveryRequests, updateDeliveryRequest } from "@/utils/tickets";
import { supabase } from "@/utils/supabaseClient";
import { getUsersByType } from '@/utils/users';

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
  const [activeTab, setActiveTab] = useState('guidelines');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<CharityCategory | "all">("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const categoryIcons = {
    homeless: HomeIcon,
    children: Baby,
    animal: Cat,
    elderly: PersonStanding,
    foodbank: Soup,
  };

  const filteredCharities = charities.filter(
    charity => selectedCategory === "all" || charity.category === selectedCategory
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }
        setCurrentUser(user);

        // Get charities
        const charitiesData = await getUsersByType('charity');
        setCharities(charitiesData);

        // Get delivery requests
        const requests = await getDeliveryRequests({ organizationId: user.id });
        setDeliveryRequests(requests);

        // Get donation history
        const tickets = await getFoodTickets({
          organizationId: user.id,
          status: 'delivered'
        });
        setDonationHistory(tickets);

      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };

    loadData();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleAcceptDeliveryRequest = async (requestId: string) => {
    try {
      const updatedRequest = await updateDeliveryRequest(requestId, 'accepted');
      
      // Update local state
      setDeliveryRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: 'accepted' } : req
        )
      );
      
      toast.success(`Delivery request accepted!`);
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleRejectDeliveryRequest = async (requestId: string) => {
    try {
      const updatedRequest = await updateDeliveryRequest(requestId, 'rejected');
      
      // Update local state
      setDeliveryRequests(prev => 
        prev.filter(req => req.id !== requestId)
      );
      
      toast.error(`Delivery request rejected.`);
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
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
            src="/lovable-uploads/org-banner.jpg"
            alt="Organization Banner"
            className="w-full h-64 object-cover object-[center_64%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, Organization!</h1>
              <p className="text-white/90 max-w-md">
                Share your excess food with those who need it most
              </p>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <Button
              className="w-full bg-charity-primary hover:bg-charity-dark text-lg py-3"
              onClick={() => navigate("/organization/create-ticket")}
            >
              <Heart className="h-5 w-5 mr-2" />
              Create Food Ticket
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="w-full max-w-sm"
          >
            <Button
              variant="outline"
              className="w-full text-lg py-3"
              onClick={() => navigate("/organization/help")}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Help Center
            </Button>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            <TabsTrigger value="deliveryRequests">Delivery Requests</TabsTrigger>
            <TabsTrigger value="donationHistory">Donation History</TabsTrigger>
            <TabsTrigger value="charitiesShelters">Charities/Shelters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guidelines" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-3 text-emerald-600 text-center">
                Food Handling Guidelines
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guidelines.map((guideline, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <guideline.icon className="h-6 w-6 text-emerald-600" />
                        <div>
                          <h3 className="font-medium text-emerald-600">{guideline.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{guideline.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="deliveryRequests" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-3 text-emerald-600 text-center">
                Delivery Requests
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-emerald-600">{request.charityName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Request Date: {request.requestDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Delivery Fee: ${request.fee}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptDeliveryRequest(request.id)}
                            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectDeliveryRequest(request.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="donationHistory" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-3 text-emerald-600 text-center">
                Donation History
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donationHistory.map((donation) => (
                  <Card key={donation.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-emerald-600">{donation.charityName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Food Type: {donation.foodType}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {donation.date}
                          </p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          {donation.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="charitiesShelters" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-3 text-emerald-600 text-center">
                Charities & Shelters
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className={`flex items-center gap-2 ${
                    selectedCategory === "all" 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                      : "hover:bg-emerald-50"
                  }`}
                >
                  All Categories
                </Button>
                {Object.entries(categoryIcons).map(([category, Icon]) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category as CharityCategory)}
                    className={`flex items-center gap-2 ${
                      selectedCategory === category 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                        : "hover:bg-emerald-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="flex flex-col gap-4 max-w-lg mx-auto">
                {filteredCharities.length > 0 ? (
                  filteredCharities.map((charity, index) => (
                    <motion.div
                      key={charity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CharityCard
                        charity={charity}
                        onClick={() => {}}
                        isSelected={false}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No charities or shelters found in this category.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav userRole="organization" hideHelp />
      <LocationConsentDialog userType="organization" />
    </div>
  );
}
