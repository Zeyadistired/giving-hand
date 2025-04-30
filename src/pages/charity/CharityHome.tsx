import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowDownUp, Utensils, Store, Hotel } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CharityCard } from "@/components/guest/charity-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Charity, CharityType, CharityCategory } from "@/types";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { LocationConsentDialog } from "@/components/tracking/location-consent-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const mockOrganizations: Charity[] = [
  {
    id: "1",
    name: "Nile Ritz Restaurant",
    type: "restaurant",
    category: "foodbank",
    email: "contact@nileritz.com",
    description: "Premium restaurant serving surplus gourmet meals for charity.",
  },
  {
    id: "2",
    name: "Fairmart Supermarket",
    type: "supermarket",
    category: "foodbank",
    email: "info@fairmart.com",
    description: "Leading supermarket donating food essentials for communities.",
  },
  {
    id: "3",
    name: "Green Leaf Hotel",
    type: "hotel",
    category: "foodbank",
    email: "help@greenleafhotel.com",
    description: "Luxury hotel donating fresh food for social programs.",
  },
  {
    id: "4",
    name: "City Supermarket Express",
    type: "supermarket",
    category: "foodbank",
    email: "contact@citysuper.com",
    description: "Neighborhood supermarket supporting multiple food charity drives.",
  },
];

export default function CharityHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<CharityType | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (!userString) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userString);
    // Allow charity users AND admin users
    if (user.type !== "charity" && user.type !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const filteredOrganizations = mockOrganizations
    .filter((org) => {
      const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedType === "all" || org.type.toLowerCase().includes(selectedType.toLowerCase());
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
        <img src="/lovable-uploads/white.avif" alt="Your Custom Logo" className="h-10 w-auto" />
          <ThemeToggle />
        </div>
      </header>
      

      <main className="flex-1 px-4 py-6 pb-20">
        {/* Banner Image */}
        <img
          src="/lovable-uploads/charity2.jpeg" // Update this path to your image
          alt="Charity Banner"
          className="w-full max-h-72 object-cover object-[center_18%] mt-2 rounded-xl mb-6 shadow-md"
        />

        <div className="mb-6">
          <EditableWrapper>
            <h1 className="text-2xl font-bold text-charity-primary mb-1">Find Organizations</h1>
          </EditableWrapper>
          <p className="text-muted-foreground">Browse organizations with food donations</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search for organizations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16h13M3 12h9m-9-4h9m13 8v-6a2 2 0 00-2-2h-4a2 2 0 00-2 2v6m4-6v6" /></svg>
                </span>
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date")}>
                Newest to Oldest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <Tabs defaultValue="all">
            <TabsList className="w-full flex gap-2 overflow-x-auto px-4 py-2 mb-4">
              <TabsTrigger
                value="all"
                onClick={() => setSelectedType("all")}
                className="data-[state=active]:bg-charity-tertiary data-[state=active]:text-white py-6.5 px-4 whitespace-nowrap text-base flex items-center gap-2"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="restaurant"
                onClick={() => setSelectedType("restaurant")}
                className="data-[state=active]:bg-charity-tertiary data-[state=active]:text-white py-6.5 px-4 whitespace-nowrap text-base flex items-center gap-2"
              >
                <Utensils className="h-4 w-4" />
                Restaurant
              </TabsTrigger>
              <TabsTrigger
                value="supermarket"
                onClick={() => setSelectedType("supermarket")}
                className="data-[state=active]:bg-charity-tertiary data-[state=active]:text-white py-6.5 px-4 whitespace-nowrap text-base flex items-center gap-2"
              >
                <Store className="h-4 w-4" />
                Supermarket
              </TabsTrigger>
              <TabsTrigger
                value="hotel"
                onClick={() => setSelectedType("hotel")}
                className="data-[state=active]:bg-charity-tertiary data-[state=active]:text-white py-6.5 px-4 whitespace-nowrap text-base flex items-center gap-2"
              >
                <Hotel className="h-4 w-4" />
                Hotel
              </TabsTrigger>
            </TabsList>

            {["all", "restaurant", "supermarket", "hotel"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations
                    .filter((org) => tab === "all" || org.type === tab)
                    .map((org) => (
                      <CharityCard key={org.id} charity={org} onClick={() => {}} isSelected={false} />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No organizations found</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <BottomNav userRole="charity" />
      <LocationConsentDialog userType="charity" />
    </div>
  );
}
