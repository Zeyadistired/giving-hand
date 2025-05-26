import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Search, ArrowDownUp, Utensils, Store, Hotel, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { BottomNav } from "@/components/ui/bottom-nav";
import { Charity, CharityType } from "@/types";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { LocationConsentDialog } from "@/components/tracking/location-consent-dialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getCurrentUser, getUserSession, clearUserSession } from '@/utils/auth';
import { supabase } from '@/utils/supabaseClient';

const mockOrganizations: Charity[] = [
  {
    id: "1",
    name: "Nile Ritz Restaurant",
    type: "restaurant",
    category: "foodbank",
    email: "contact@nileritz.com",
    description: "Premium restaurant serving surplus gourmet meals for charity.",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    name: "Fairmart Supermarket",
    type: "supermarket",
    category: "foodbank",
    email: "info@fairmart.com",
    description: "Leading supermarket donating food essentials for communities.",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    name: "Green Leaf Hotel",
    type: "hotel",
    category: "foodbank",
    email: "help@greenleafhotel.com",
    description: "Luxury hotel donating fresh food for social programs.",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    name: "City Supermarket Express",
    type: "supermarket",
    category: "foodbank",
    email: "contact@citysuper.com",
    description: "Neighborhood supermarket supporting multiple food charity drives.",
    image: "/placeholder.svg?height=200&width=400",
  },
];

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={resetErrorBoundary} variant="outline">
            Try again
          </Button>
          <Button onClick={() => window.location.reload()} variant="destructive">
            Reload page
          </Button>
        </div>
      </div>
    </div>
  );
}

// Separate component for the main content
function CharityHomeContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<CharityType | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "date">("name");
  const [isScrolled, setIsScrolled] = useState(false);
  const [organizations, setOrganizations] = useState<Charity[]>(mockOrganizations);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoize the session check function
  const checkSession = useCallback(async () => {
    try {
      const localUser = getUserSession();
      if (!localUser) {
        clearUserSession();
        navigate("/login", { replace: true });
        return null;
      }

      if (localUser.type !== 'charity') {
        clearUserSession();
        navigate("/login", { replace: true });
        return null;
      }

      return localUser;
    } catch (error) {
      console.error('Session check error:', error);
      clearUserSession();
      navigate("/login", { replace: true });
      return null;
    }
  }, [navigate]);

  // Memoize the data loading function
  const loadData = useCallback(async (user: any) => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const serverUser = await getCurrentUser();
      if (!serverUser || serverUser.type !== 'charity') {
        throw new Error('Invalid session');
      }

      if (JSON.stringify(serverUser) !== JSON.stringify(user)) {
        setCurrentUser(serverUser);
      }

      // Load only organization-type users
      try {
        console.log('Loading organizations...');
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('type', 'organization');

        if (error) {
          console.error('Error loading organizations:', error);
          console.warn('Using mock organizations due to fetch failure');
          setOrganizations(mockOrganizations);
        } else {
          console.log('Loaded organizations:', data);
          console.log('Organization types found:', data?.map(org => ({ name: org.name, organization_type: org.organization_type, type: org.type })));
          setOrganizations(data || []);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
        console.warn('Using mock organizations due to fetch failure');
        setOrganizations(mockOrganizations);
      }

      // Tickets are now handled only in the notifications page

    } catch (error: any) {
      console.error('Error loading data:', error);
      if (error.message === 'Invalid session') {
        clearUserSession();
        navigate("/login", { replace: true });
        return;
      }
      setError(error.message || 'Failed to load data. Please try again later.');
      toast.error(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [navigate]);

  // Session check effect
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      const user = await checkSession();
      if (isMounted && user) {
        setCurrentUser(user);
      }
    };

    initSession();
    return () => { isMounted = false; };
  }, [checkSession]);

  // Data loading effect
  useEffect(() => {
    let isMounted = true;

    if (currentUser) {
      loadData(currentUser);
    }

    const handleScroll = () => {
      if (isMounted) {
        setIsScrolled(window.scrollY > 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentUser, loadData]);

  const handleLogout = () => {
    clearUserSession();
    navigate("/login", { replace: true });
  };

  // Ticket handling is now done only in the notifications page

  // Filter + search + sort on organizations
  const filteredOrganizations = organizations
    .filter(org => {
      // Filter by organization type (restaurant, supermarket, hotel)
      if (selectedType === 'all') return true;
      // Use organization_type field that holds 'restaurant' | 'supermarket' | 'hotel'
      const orgType = (org as any).organization_type?.toLowerCase();
      const matches = orgType === selectedType;
      console.log(`Filtering org "${org.name}": organization_type="${orgType}", selectedType="${selectedType}", matches=${matches}`);
      return matches;
    })
    .filter(org =>
      // Search by name
      org.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      // Sort by name or date
      sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : new Date((a as any).created_at || a.id).getTime() - new Date((b as any).created_at || b.id).getTime()
    );

  if (isLoading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error && isInitialLoad) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex gap-4">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-2"
            >
              Try Again
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="mt-2"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 pb-20 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img
            src="/lovable-uploads/charity2.jpeg"
            alt="Charity Banner"
            className="w-full h-48 sm:h-64 object-cover object-[center_18%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 sm:p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Find Food Donations</h1>
              <p className="text-sm sm:text-base text-white/90 max-w-md">
                Connect with organizations and receive food donations for your cause.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Tickets are now handled only in the notifications page */}

        <div className="mb-8">
          <EditableWrapper onSave={(value) => console.log("Title edited:", value)}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent inline-block mb-2">
              Available Organizations
            </h2>
          </EditableWrapper>
          <EditableWrapper onSave={(value) => console.log("Description edited:", value)}>
            <p className="text-muted-foreground">Browse organizations offering food donations</p>
          </EditableWrapper>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 rounded-full border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all"
              placeholder="Search for organizations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setSortBy(sortBy === "name" ? "date" : "name")}
          >
            <ArrowDownUp className="h-4 w-4" />
            <span>{sortBy === "name" ? "Sort by Name" : "Sort by Date"}</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-start gap-2 mb-6 overflow-x-auto hide-scrollbar">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
            className="rounded-full whitespace-nowrap"
          >
            All Organizations
          </Button>
          <Button
            variant={selectedType === "restaurant" ? "default" : "outline"}
            onClick={() => setSelectedType("restaurant")}
            className="rounded-full whitespace-nowrap flex items-center gap-2"
          >
            <Utensils className="h-4 w-4" />
            Restaurants
          </Button>
          <Button
            variant={selectedType === "supermarket" ? "default" : "outline"}
            onClick={() => setSelectedType("supermarket")}
            className="rounded-full whitespace-nowrap flex items-center gap-2"
          >
            <Store className="h-4 w-4" />
            Supermarkets
          </Button>
          <Button
            variant={selectedType === "hotel" ? "default" : "outline"}
            onClick={() => setSelectedType("hotel")}
            className="rounded-full whitespace-nowrap flex items-center gap-2"
          >
            <Hotel className="h-4 w-4" />
            Hotels
          </Button>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.length > 0 ? (
            filteredOrganizations.map((org) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {(org as any).organization_type === 'restaurant' && <Utensils className="h-6 w-6 text-orange-500" />}
                      {(org as any).organization_type === 'supermarket' && <Store className="h-6 w-6 text-blue-500" />}
                      {(org as any).organization_type === 'hotel' && <Hotel className="h-6 w-6 text-purple-500" />}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{org.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {(org as any).organization_type || 'Organization'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {org.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {org.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {org.email}
                    </span>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => navigate(`/charity/tickets/${org.id}`)}
                    >
                      View Donations
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No organizations found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {selectedType === 'all'
                    ? 'No organizations are currently available.'
                    : `No ${selectedType}s found. Try selecting a different filter.`
                  }
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    className="mt-2"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav userRole="charity" />
      <LocationConsentDialog userType="charity" />
    </div>
  );
}

// Main component with error boundary
export default function CharityHome() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <CharityHomeContent />
    </ErrorBoundary>
  );
}
