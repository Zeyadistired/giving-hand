import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, X, Home, BarChart, Map, Users, FileText, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { toast } from "sonner";
import { LocationConsentDialog } from "@/components/tracking/location-consent-dialog";
import { AdminTrackingDashboard } from "@/components/tracking/admin-tracking-dashboard";
import { getAdminStats, saveContent, loadContent, AdminStats } from "@/utils/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true);

        // Check if user is admin
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

        // Initialize edit mode from localStorage
        const storedEditMode = localStorage.getItem('isEditMode') === 'true';
        setIsEditMode(storedEditMode);

        // Load admin statistics from database
        const stats = await getAdminStats();
        setAdminStats(stats);

      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error('Failed to load admin dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [navigate]);

  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    localStorage.setItem('isEditMode', newEditMode.toString());

    // Dispatch a custom event to notify other components about the change
    window.dispatchEvent(new Event('editModeChanged'));

    toast(newEditMode ? "Edit mode enabled" : "Edit mode disabled");
  };

  // Function for saving edited content to database
  const handleSaveContent = async (id: string, newValue: string) => {
    try {
      await saveContent(id, newValue, 'dashboard');
      console.log(`Content saved for ${id}:`, newValue);
      toast.success("Content saved successfully");
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Failed to save content");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <EditableWrapper onSave={(value) => handleSaveContent('dashboard-title', value)}>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </EditableWrapper>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 font-medium">Welcome, {currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {showTracking ? (
          <AdminTrackingDashboard
            onClose={() => setShowTracking(false)}
            currentUser={currentUser}
          />
        ) : (
          <>
            {/* Statistics Overview */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : adminStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        <p className="text-sm font-medium text-gray-600">Pending Tickets</p>
                        <p className="text-2xl font-bold text-gray-900">{adminStats.pendingTickets}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Donations</p>
                        <p className="text-2xl font-bold text-gray-900">EGP {adminStats.totalDonationAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('user-management-title', value)}>
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">User Management</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('user-management-desc', value)}>
                  <p className="text-gray-600 mb-4 text-sm">Manage users, roles and permissions</p>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => console.log('Button text edited:', value)}>
                  <Button
                    onClick={() => navigate('/admin/manage-users')}
                    className="w-full h-10 bg-primary hover:bg-primary/90"
                  >
                    Manage Users
                  </Button>
                </EditableWrapper>
              </div>

              <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('content-management-title', value)}>
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">Content Management</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('content-management-desc', value)}>
                  <p className="text-gray-600 mb-4 text-sm">Edit website content and pages</p>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => console.log('Button text edited:', value)}>
                  <Button
                    onClick={() => navigate('/admin/edit-homepage')}
                    className="w-full h-10 bg-primary hover:bg-primary/90"
                  >
                    Edit All Content
                  </Button>
                </EditableWrapper>
              </div>

              <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('analytics-reports-title', value)}>
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">Analytics Reports</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('analytics-reports-desc', value)}>
                  <p className="text-gray-600 mb-4 text-sm">View system analytics and generate reports</p>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => console.log('Button text edited:', value)}>
                  <Button
                    onClick={() => navigate('/admin/reports')}
                    className="w-full h-10 bg-primary hover:bg-primary/90 flex items-center justify-center"
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>View Reports</span>
                  </Button>
                </EditableWrapper>
              </div>

              <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('tracking-logistics-title', value)}>
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">User Tracking & Logistics</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('tracking-logistics-desc', value)}>
                  <p className="text-gray-600 mb-4 text-sm">Monitor user locations and delivery routes</p>
                </EditableWrapper>
                <Button
                  onClick={() => setShowTracking(true)}
                  className="w-full h-10 bg-primary hover:bg-primary/90 flex items-center justify-center"
                >
                  <Map className="mr-2 h-4 w-4" />
                  <span>Track Users</span>
                </Button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border shadow-sm">
              <EditableWrapper onSave={(value) => handleSaveContent('edit-mode-title', value)}>
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Edit Mode</h2>
              </EditableWrapper>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <EditableWrapper onSave={(value) => handleSaveContent('edit-mode-desc', value)}>
                  <p className="text-gray-600 text-sm">
                    {isEditMode
                      ? "Edit mode is currently ON. You can edit content across the entire website."
                      : "Edit mode is currently OFF. Enable it to edit content across the entire website."}
                  </p>
                </EditableWrapper>
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  className={isEditMode ? "bg-green-500 hover:bg-green-600 text-white h-10" : "h-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                  onClick={toggleEditMode}
                >
                  {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
                </Button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border shadow-sm">
              <EditableWrapper onSave={(value) => handleSaveContent('site-navigation-title', value)}>
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Site Navigation</h2>
              </EditableWrapper>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => navigate('/guest')}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  <span>View Guest Home</span>
                </Button>
                <Button
                  onClick={() => navigate('/charity')}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  <span>View Charity Home</span>
                </Button>
                <Button
                  onClick={() => navigate('/organization')}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  <span>View Organization Home</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {!showTracking && (
        <div className="fixed bottom-6 right-6 z-50">
          {isEditMode ? (
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                onClick={toggleEditMode}
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg text-white"
                onClick={toggleEditMode}
              >
                <Save className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90 shadow-lg text-white"
              onClick={toggleEditMode}
            >
              <Edit className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}

      <LocationConsentDialog userType="admin" />
    </div>
  );
}
