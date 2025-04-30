import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CharityCard } from "@/components/guest/charity-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Charity, CharityType, CharityCategory } from "@/types";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const CHARITY_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "children", label: "Children" },
  { key: "elderly", label: "Elderly" },
  { key: "homeless", label: "Homeless" },
  { key: "animal", label: "Animal Welfare" },
  { key: "foodbank", label: "Food Bank" },
];

const mockCharities: Charity[] = [
  {
    id: "1",
    name: "Hope for Kids",
    type: "charity" as CharityType,
    email: "kids@hope.org",
    description: "Supporting children in need with meals, education, and care.",
    category: "children",
  },
  {
    id: "2",
    name: "Elderly Care Foundation",
    type: "charity" as CharityType,
    email: "info@elderlycare.org",
    description: "Supporting the elderly community through food and essentials donations.",
    category: "elderly",
  },
  {
    id: "3",
    name: "Green Life Food Bank",
    type: "charity" as CharityType,
    email: "help@greenlife.org",
    description: "Fighting hunger and food insecurity in our local communities.",
    category: "foodbank",
  },
  // More mock charities...
];

export default function GuestHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "date">("name");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const filteredCharities = mockCharities
    .filter((charity) => {
      const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || charity.category === selectedCategory;
      return matchesSearch && matchesCategory;
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

  const handleCharityClick = (charityId: string) => {
    setSelectedCharity(charityId);
  };

  const handleProceedToPayment = () => {
    if (selectedCharity) {
      navigate(`/payment/${selectedCharity}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        {/* Banner Image */}
        <img
          src="/lovable-uploads/money.jpeg"
          alt="Charity Banner"
          className="w-full max-h-72 object-cover object-[center_55%] mt-2 rounded-xl mb-6 shadow-md"
        />
        <div className="mb-6">
          <EditableWrapper onSave={value => console.log("Title edited:", value)}>
            <h1 className="text-2xl font-bold text-charity-primary mb-1">
              Support a Charity
            </h1>
          </EditableWrapper>
          <EditableWrapper onSave={value => console.log("Description edited:", value)}>
            <p className="text-muted-foreground">Choose a charity to donate to</p>
          </EditableWrapper>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search for charities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex justify-center gap-2 px-4 py-2 mb-4">
            {CHARITY_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="data-[state=active]:bg-charity-tertiary data-[state=active]:text-white py-0.5 px-4 whitespace-nowrap text-base flex items-center gap-2"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={selectedCategory} className="space-y-4 mt-0">
            {filteredCharities.length > 0 ? (
              filteredCharities.map((charity) => (
                <CharityCard
                  key={charity.id}
                  charity={charity}
                  onClick={() => handleCharityClick(charity.id)}
                  isSelected={selectedCharity === charity.id}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No charities found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedCharity && (
          <div className="mt-8">
            <Button
              className="w-full bg-charity-primary hover:bg-charity-dark"
              onClick={handleProceedToPayment}
            >
              Proceed to Donation
            </Button>
          </div>
        )}
      </main>

      <BottomNav userRole="guest" />
    </div>
  );
}