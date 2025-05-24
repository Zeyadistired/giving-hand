"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import { Search, Heart, LogOut, Filter, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CharityCard } from "@/components/guest/charity-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNav } from "@/components/ui/bottom-nav"
import type { Charity, CharityType } from "@/types"
import { EditableWrapper } from "@/components/ui/editable-wrapper"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getUsersByType } from '@/utils/users'

const CHARITY_CATEGORIES = [
  { key: "all", label: "All", icon: "🌍" },
  { key: "children", label: "Children", icon: "👶" },
  { key: "elderly", label: "Elderly", icon: "👵" },
  { key: "homeless", label: "Homeless", icon: "🏠" },
  { key: "animal", label: "Animal Welfare", icon: "🐾" },
  { key: "foodbank", label: "Food Bank", icon: "🍎" },
]

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

// Main content component
function GuestHomeContent() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "date">("name")
  const [isScrolled, setIsScrolled] = useState(false)
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check session
  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (!userRole) {
      localStorage.setItem("userRole", "guest")
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch charities with retry
  const fetchCharities = useCallback(async () => {
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount < maxRetries) {
      try {
        setLoading(true);
        setError(null);

        const orgs = await getUsersByType('charity');
        if (orgs) {
          // Transform the data to match the Charity type
          const transformedCharities: Charity[] = orgs.map(charity => ({
            id: charity.id,
            name: charity.name || "Unnamed Charity",
            type: 'charity' as CharityType,
            email: charity.email,
            description: charity.description || 'No description available',
            category: charity.category || 'all',
            image: charity.image || '/placeholder.svg?height=200&width=400',
          }));
          setCharities(transformedCharities);
          break;
        }
      } catch (error: any) {
        retryCount++;
        if (retryCount === maxRetries) {
          console.error('Error fetching charities:', error);
          setError(error.message || 'Failed to load charities');
          toast.error(error.message || 'Failed to load charities');
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
        }
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchCharities();
  }, [fetchCharities]);

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userSession")
    navigate("/login", { replace: true })
  }

  const filteredCharities = charities
    .filter((charity) => {
      const matchesSearch = charity.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || charity.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return b.id.localeCompare(a.id)
        default:
          return 0
      }
    })

  const handleCharityClick = (charityId: string) => {
    setSelectedCharity(charityId)
  }

  const handleProceedToPayment = () => {
    if (selectedCharity) {
      navigate(`/payment/${selectedCharity}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading charities...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load charities</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchCharities} variant="outline">
              Try again
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </div>
    )
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
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-sm font-medium"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img
            src="/lovable-uploads/money.jpeg"
            alt="Charity Banner"
            className="w-full h-64 object-cover object-[center_55%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-3xl font-bold text-white mb-2">Make a Difference Today</h1>
              <p className="text-white/90 max-w-md">
                Your donation can change lives. Choose a charity and start your journey of giving.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="mb-8">
          <EditableWrapper onSave={(value) => console.log("Title edited:", value)}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent inline-block mb-2">
              Support a Charity
            </h2>
          </EditableWrapper>
          <EditableWrapper onSave={(value) => console.log("Description edited:", value)}>
            <p className="text-muted-foreground">Choose a charity that aligns with your values</p>
          </EditableWrapper>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 rounded-full border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all"
              placeholder="Search for charities"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setSortBy(sortBy === "name" ? "date" : "name")}
          >
            <Filter className="h-4 w-4" />
            <span>{sortBy === "name" ? "Sort by Name" : "Sort by Date"}</span>
          </Button>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="flex justify-start gap-2 px-0 py-2 mb-4 overflow-x-auto hide-scrollbar">
            {CHARITY_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white py-1.5 px-4 rounded-full whitespace-nowrap text-sm font-medium flex items-center gap-2 transition-all"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCharities.length > 0 ? (
                filteredCharities.map((charity) => (
                  <motion.div
                    key={charity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CharityCard
                      charity={charity}
                      onClick={() => handleCharityClick(charity.id)}
                      isSelected={selectedCharity === charity.id}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-muted-foreground text-lg">No charities found</p>
                  <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {selectedCharity && (
          <motion.div
            className="mt-8 sticky bottom-20 z-10 px-4 py-4 bg-white dark:bg-gray-900 rounded-t-xl shadow-lg border-t border-x"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Button
              onClick={handleProceedToPayment}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl py-6 text-lg font-medium flex items-center justify-center gap-2"
            >
              Proceed to Payment
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </main>

      <BottomNav userRole="guest" />
    </div>
  )
}

// Main component with error boundary
export default function GuestHome() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <GuestHomeContent />
    </ErrorBoundary>
  );
}
