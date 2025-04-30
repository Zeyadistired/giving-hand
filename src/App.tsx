
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GuestHome from "./pages/guest/GuestHome";
import GuestHelp from "./pages/guest/GuestHelp";
import Payment from "./pages/guest/Payment";
import ThankYou from "./pages/guest/ThankYou";
import CharityHome from "./pages/charity/CharityHome";
import Notifications from "./pages/charity/Notifications";
import TicketDetail from "./pages/charity/TicketDetail";
import Collaborations from "./pages/charity/Collaborations";
import CharitySettings from "./pages/charity/CharitySettings";
import CharityHelp from "./pages/charity/CharityHelp";
import OrganizationHome from "./pages/organization/OrganizationHome";
import OrganizationHelp from "./pages/organization/OrganizationHelp";
import CreateTicket from "./pages/organization/CreateTicket";
import FoodHandling from "./pages/organization/FoodHandling";
import OrganizationSettings from "./pages/organization/OrganizationSettings";
import Profile from "./pages/user/Profile";
import NotFound from "./pages/NotFound";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import EditHomepage from "./pages/admin/EditHomepage";
import ManageUsers from "./pages/admin/ManageUsers";
import SystemSettings from "./pages/admin/SystemSettings";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import { MainHeader } from "@/components/ui/main-header";
import { Footer } from "@/components/ui/footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import { MealTracking } from "./components/tracking/meal-tracking";
import { ThemeProvider } from "@/components/theme/theme-provider";
import FactoryHome from "./pages/factory/FactoryHome";
import FactoryHelp from "./pages/factory/FactoryHelp";
import FactorySettings from "./pages/factory/FactorySettings";
import FactoryTicketDetail from "./pages/factory/FactoryTicketDetail";
import { initializeDatabase } from "./utils/initializeDatabase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  
  // Initialize database on app startup
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainHeader />
            <div className="min-h-[calc(100vh-5rem-250px)] flex flex-col">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/guest" element={<GuestHome />} />
                <Route path="/guest/help" element={<GuestHelp />} />
                <Route path="/payment/:charityId" element={<Payment />} />
                <Route path="/thank-you" element={<ThankYou />} />
                
                <Route path="/charity" element={<CharityHome />} />
                <Route path="/charity/tickets/:orgId" element={<TicketDetail />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ticket/:ticketId" element={<TicketDetail />} />
                <Route path="/charity/collaborations" element={<Collaborations />} />
                <Route path="/charity/settings" element={<CharitySettings />} />
                <Route path="/charity/help" element={<CharityHelp />} />
                <Route path="/charity/meal-tracking" element={<MealTracking />} />
                
                <Route path="/organization" element={<OrganizationHome />} />
                <Route path="/organization/help" element={<OrganizationHelp />} />
                <Route path="/organization/create-ticket" element={<CreateTicket />} />
                <Route path="/create-ticket" element={<CreateTicket />} />
                <Route path="/food-handling" element={<FoodHandling />} />
                <Route path="/organization/settings" element={<OrganizationSettings />} />
                
                <Route path="/profile" element={<Profile />} />
                
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<HelpCenter />} />
                
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />

                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/edit-homepage" element={<EditHomepage />} />
                <Route path="/admin/manage-users" element={<ManageUsers />} />
                <Route path="/admin/system-settings" element={<SystemSettings />} />

                {/* Factory Routes */}
                <Route path="/factory" element={<FactoryHome />} />
                <Route path="/factory/help" element={<FactoryHelp />} />
                <Route path="/factory/settings" element={<FactorySettings />} />
                <Route path="/factory/ticket/:ticketId" element={<FactoryTicketDetail />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
