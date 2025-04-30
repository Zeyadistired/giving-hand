import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "@/components/admin/analytics/DateRangeFilter";
import { ExportOptions } from "@/components/admin/analytics/ExportOptions";
import { AnalyticsSummary } from "@/components/admin/analytics/AnalyticsSummary";
import { UsersByTypeChart } from "@/components/admin/analytics/UsersByTypeChart";
import { TicketsActivityChart } from "@/components/admin/analytics/TicketsActivityChart";
import { DonationTrendsChart } from "@/components/admin/analytics/DonationTrendsChart";
import { PromoCodesTable, PromoCode } from "@/components/admin/analytics/PromoCodesTable";
import { ImpactMetricsCard } from "@/components/admin/analytics/ImpactMetricsCard";
import { SubscriptionsTable, Subscription } from "@/components/admin/analytics/SubscriptionsTable";
import { OrganizationReportsTable, OrganizationReport } from "@/components/admin/analytics/OrganizationReportsTable";
import { OrganizationActivityChart } from "@/components/admin/analytics/OrganizationActivityChart";
import { toast } from "sonner";

const mockSummaryData = {
  totalUsers: 256,
  ticketsCreated: 512,
  ticketsAccepted: 387,
  ticketsDeclined: 125,
  totalDonations: 183,
  totalSubscriptions: 42,
};

const mockUsersTypeData = [
  { name: "Guests", value: 120, color: "#8884d8" },
  { name: "Charities", value: 45, color: "#82ca9d" },
  { name: "Organizations", value: 86, color: "#ffc658" },
  { name: "Admins", value: 5, color: "#ff8042" },
];

const mockTicketsData = [
  { name: "Jan", created: 45, accepted: 30, declined: 15 },
  { name: "Feb", created: 52, accepted: 42, declined: 10 },
  { name: "Mar", created: 68, accepted: 55, declined: 13 },
  { name: "Apr", created: 82, accepted: 65, declined: 17 },
  { name: "May", created: 75, accepted: 60, declined: 15 },
  { name: "Jun", created: 92, accepted: 75, declined: 17 },
];

const mockDonationsData = [
  { name: "Jan", donations: 15, amount: 7500 },
  { name: "Feb", donations: 18, amount: 9000 },
  { name: "Mar", donations: 22, amount: 11000 },
  { name: "Apr", donations: 28, amount: 14000 },
  { name: "May", donations: 32, amount: 16000 },
  { name: "Jun", donations: 36, amount: 18000 },
];

const mockPromoCodesData: PromoCode[] = [
  { id: "1", code: "MEALKHIER", discount: 15, organization: "Oscar Market", status: "active", usageCount: 143 },
  { id: "2", code: "VITAMEAL", discount: 10, organization: "Marriott Hotel", status: "active", usageCount: 87 },
  { id: "3", code: "FOODHELP", discount: 20, organization: "Food Network", status: "expired", usageCount: 253 },
  { id: "4", code: "RAMADAN23", discount: 25, organization: "All Partners", status: "expired", usageCount: 418 },
];

const mockImpactData = [
  { label: "Meals Donated", value: 12568, target: 15000, unit: "meals" },
  { label: "Charities/Shelters Helped", value: 823, target: 1000, unit: "helped" },
  { label: "Food Waste Reduced", value: 5230, target: 10000, unit: "kg" },
];

const mockSubscriptionsData: Subscription[] = [
  { id: "1", userType: "charity", name: "Hope Foundation", email: "info@hope.org", startDate: "2023-01-15", status: "active" },
  { id: "2", userType: "organization", name: "Cairo Hotel", email: "manager@cairohotel.com", startDate: "2023-02-10", status: "active" },
  { id: "3", userType: "charity", name: "Care Center", email: "admin@carecenter.org", startDate: "2022-11-05", status: "expired" },
  { id: "4", userType: "charity", name: "Shelter House", email: "contact@shelter.org", startDate: "2023-03-22", status: "active" },
  { id: "5", userType: "organization", name: "Fresh Market", email: "support@freshmarket.com", startDate: "2023-01-30", status: "cancelled" },
];

const mockOrganizationReportsData: OrganizationReport[] = [
  { 
    id: "org1", 
    name: "Cairo Grand Hotel", 
    type: "hotel", 
    totalDonations: 87, 
    quantity: 432, 
    pickups: 81, 
    cancellations: 6, 
    violations: 0, 
    lastActive: "2025-04-15" 
  },
  { 
    id: "org2", 
    name: "Fresh Valley Market", 
    type: "supermarket", 
    totalDonations: 124, 
    quantity: 896, 
    pickups: 112, 
    cancellations: 12, 
    violations: 2, 
    lastActive: "2025-04-18" 
  },
  { 
    id: "org3", 
    name: "Nile View Restaurant", 
    type: "restaurant", 
    totalDonations: 63, 
    quantity: 215, 
    pickups: 58, 
    cancellations: 5, 
    violations: 1, 
    lastActive: "2025-04-20" 
  },
  { 
    id: "org4", 
    name: "Pyramid Plaza Hotel", 
    type: "hotel", 
    totalDonations: 41, 
    quantity: 187, 
    pickups: 38, 
    cancellations: 3, 
    violations: 0, 
    lastActive: "2025-04-17" 
  },
  { 
    id: "org5", 
    name: "Al Qasr Bakery", 
    type: "restaurant", 
    totalDonations: 29, 
    quantity: 102, 
    pickups: 25, 
    cancellations: 4, 
    violations: 3, 
    lastActive: "2025-04-12" 
  },
  { 
    id: "org6", 
    name: "Oasis Community Shelter", 
    type: "shelter", 
    totalDonations: 18, 
    quantity: 320, 
    pickups: 18, 
    cancellations: 0, 
    violations: 0, 
    lastActive: "2025-04-19" 
  },
];

const mockOrganizationActivityData = [
  {
    id: "org1",
    name: "Cairo Grand Hotel",
    activity: [
      { date: "Jan", donations: 12, pickups: 11, cancellations: 1 },
      { date: "Feb", donations: 15, pickups: 14, cancellations: 1 },
      { date: "Mar", donations: 18, pickups: 16, cancellations: 2 },
      { date: "Apr", donations: 22, pickups: 20, cancellations: 2 },
      { date: "May", donations: 20, pickups: 20, cancellations: 0 },
    ]
  },
  {
    id: "org2",
    name: "Fresh Valley Market",
    activity: [
      { date: "Jan", donations: 20, pickups: 18, cancellations: 2 },
      { date: "Feb", donations: 24, pickups: 22, cancellations: 2 },
      { date: "Mar", donations: 28, pickups: 25, cancellations: 3 },
      { date: "Apr", donations: 32, pickups: 28, cancellations: 4 },
      { date: "May", donations: 20, pickups: 19, cancellations: 1 },
    ]
  },
  {
    id: "org3",
    name: "Nile View Restaurant",
    activity: [
      { date: "Jan", donations: 8, pickups: 7, cancellations: 1 },
      { date: "Feb", donations: 12, pickups: 11, cancellations: 1 },
      { date: "Mar", donations: 15, pickups: 14, cancellations: 1 },
      { date: "Apr", donations: 18, pickups: 16, cancellations: 2 },
      { date: "May", donations: 10, pickups: 10, cancellations: 0 },
    ]
  },
];

export default function AdminReports() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userString);
    setCurrentUser(user);
    
    if (user.type !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleExport = (type: "pdf" | "csv", reportType: string = "all") => {
    toast.success(`Exporting ${reportType} report as ${type.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`${type.toUpperCase()} report downloaded successfully!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8">
      <header className="bg-primary text-white p-6 shadow-md rounded-lg mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/admin/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Analytics Reports</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>{currentUser?.name}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold w-full text-center sm:text-left">System Analytics Dashboard</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <DateRangeFilter 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange} 
              className="mb-2 sm:mb-0 w-full sm:w-auto" 
            />
            <ExportOptions 
              onExport={handleExport} 
              className="w-full sm:w-auto" 
            />
          </div>
        </div>

        <div className="space-y-16">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <AnalyticsSummary data={mockSummaryData} />
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <OrganizationReportsTable data={mockOrganizationReportsData} />
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm h-[700px]">
            <OrganizationActivityChart data={mockOrganizationActivityData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card p-6 rounded-lg shadow-sm h-[400px]">
              <UsersByTypeChart data={mockUsersTypeData} />
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm h-[400px]">
              <TicketsActivityChart data={mockTicketsData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card p-6 rounded-lg shadow-sm h-[400px]">
              <DonationTrendsChart data={mockDonationsData} />
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm h-[400px]">
              <ImpactMetricsCard data={mockImpactData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <SubscriptionsTable data={mockSubscriptionsData} />
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <PromoCodesTable data={mockPromoCodesData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
