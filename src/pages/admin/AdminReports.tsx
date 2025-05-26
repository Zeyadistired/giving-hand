import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, TrendingUp, Users, Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getAdminStats, getDetailedAnalytics, AdminStats, DetailedAnalytics } from "@/utils/admin";

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
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [detailedAnalytics, setDetailedAnalytics] = useState<DetailedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        setIsLoading(true);

        const userString = localStorage.getItem('currentUser');
        if (!userString) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userString);
        setCurrentUser(user);

        if (user.type !== 'admin') {
          navigate('/login');
          return;
        }

        // Load admin statistics and detailed analytics
        const [stats, analytics] = await Promise.all([
          getAdminStats(),
          getDetailedAnalytics()
        ]);

        setAdminStats(stats);
        setDetailedAnalytics(analytics);

      } catch (error) {
        console.error('Error loading reports data:', error);
        toast.error('Failed to load reports data');
      } finally {
        setIsLoading(false);
      }
    };

    loadReportsData();
  }, [navigate]);

  const handleExport = (type: "pdf" | "csv", reportType: string = "all") => {
    toast.success(`Exporting ${reportType} report as ${type.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`${type.toUpperCase()} report downloaded successfully!`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Analytics Reports</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 font-medium">Welcome, {currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-8">
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

        {isLoading ? (
          <div className="space-y-8">
            {/* Loading skeleton */}
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : adminStats && detailedAnalytics ? (
          <div className="space-y-8">
            {/* Real-time Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Food Tickets</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.totalFoodTickets}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminStats.totalFoodTickets > 0
                          ? Math.round((adminStats.acceptedTickets / adminStats.totalFoodTickets) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Donations</p>
                      <p className="text-2xl font-bold text-gray-900">EGP {adminStats.totalDonationAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organization Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Top Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {detailedAnalytics.organizationActivity.slice(0, 5).map((org, index) => (
                    <div key={org.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-gray-600">{org.tickets} tickets created</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{org.accepted} accepted</p>
                        <p className="text-sm text-gray-600">
                          {org.tickets > 0 ? Math.round((org.accepted / org.tickets) * 100) : 0}% rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Food Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Food Categories Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {detailedAnalytics.topCategories.map((category) => (
                    <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium capitalize">{category.category}</h3>
                      <p className="text-2xl font-bold text-primary">{category.count}</p>
                      <p className="text-sm text-gray-600">{category.weight.toFixed(1)} kg total</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900">Active Users</h3>
                    <p className="text-2xl font-bold text-blue-600">{adminStats.totalUsers}</p>
                    <p className="text-sm text-blue-600">Total registered</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900">Food Saved</h3>
                    <p className="text-2xl font-bold text-green-600">{adminStats.totalFoodTickets}</p>
                    <p className="text-sm text-green-600">Tickets created</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-900">Money Raised</h3>
                    <p className="text-2xl font-bold text-purple-600">EGP {adminStats.totalDonationAmount.toFixed(2)}</p>
                    <p className="text-sm text-purple-600">Total donations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export and Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => handleExport('csv')} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={() => handleExport('pdf')} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={() => handleExport('excel')} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No data available</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
