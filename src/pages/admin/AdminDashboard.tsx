import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, X, LogOut, Home, BarChart, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableWrapper } from "@/components/ui/editable-wrapper";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/back-button";
import { LocationConsentDialog } from "@/components/tracking/location-consent-dialog";
import { AdminTrackingDashboard } from "@/components/tracking/admin-tracking-dashboard";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showTracking, setShowTracking] = useState(false);

  useEffect(() => {
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
    }

    // Initialize edit mode from localStorage
    const storedEditMode = localStorage.getItem('isEditMode') === 'true';
    setIsEditMode(storedEditMode);
  }, [navigate]);

  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    localStorage.setItem('isEditMode', newEditMode.toString());
    
    // Dispatch a custom event to notify other components about the change
    window.dispatchEvent(new Event('editModeChanged'));
    
    toast(newEditMode ? "Edit mode enabled" : "Edit mode disabled");
  };

  // Sample function for saving edited content
  const handleSaveContent = (id: string, newValue: string) => {
    console.log(`Saving content for ${id}:`, newValue);
    toast.success("Content saved successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BackButton className="mr-4 text-white hover:bg-white/10" />
            <EditableWrapper onSave={(value) => handleSaveContent('dashboard-title', value)}>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </EditableWrapper>
          </div>
          <div className="flex items-center space-x-4">
            <span className="mr-4">{currentUser?.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userRole');
                localStorage.removeItem('isEditMode');
                navigate('/login');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {showTracking ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">User Tracking & Logistics</h2>
              <Button variant="outline" onClick={() => setShowTracking(false)}>
                Back to Dashboard
              </Button>
            </div>
            <AdminTrackingDashboard />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('user-management-title', value)}>
                  <h2 className="text-xl font-semibold mb-4">User Management</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('user-management-desc', value)}>
                  <p className="text-gray-600 mb-4">Manage users, roles and permissions</p>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => console.log('Button text edited:', value)}>
                  <Button onClick={() => navigate('/admin/manage-users')}>Manage Users</Button>
                </EditableWrapper>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('content-management-title', value)}>
                  <h2 className="text-xl font-semibold mb-4">Content Management</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('content-management-desc', value)}>
                  <p className="text-gray-600 mb-4">Edit website content and pages</p>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => console.log('Button text edited:', value)}>
                  <Button onClick={() => navigate('/admin/edit-homepage')}>Edit All Content</Button>
                </EditableWrapper>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('analytics-reports-title', value)}>
                  <h2 className="text-xl font-semibold mb-4">Analytics Reports</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('analytics-reports-desc', value)}>
                  <p className="text-gray-600 mb-4">View system analytics and generate reports</p>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => console.log('Button text edited:', value)}>
                  <Button onClick={() => navigate('/admin/reports')} className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>View Reports</span>
                  </Button>
                </EditableWrapper>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <EditableWrapper onSave={(value) => handleSaveContent('tracking-logistics-title', value)}>
                  <h2 className="text-xl font-semibold mb-4">User Tracking & Logistics</h2>
                </EditableWrapper>
                <EditableWrapper onSave={(value) => handleSaveContent('tracking-logistics-desc', value)}>
                  <p className="text-gray-600 mb-4">Monitor user locations and delivery routes</p>
                </EditableWrapper>
                <Button onClick={() => setShowTracking(true)} className="flex items-center">
                  <Map className="mr-2 h-4 w-4" />
                  <span>Track Users</span>
                </Button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg shadow">
              <EditableWrapper onSave={(value) => handleSaveContent('edit-mode-title', value)}>
                <h2 className="text-xl font-semibold mb-4">Edit Mode</h2>
              </EditableWrapper>
              <div className="flex items-center justify-between">
                <EditableWrapper onSave={(value) => handleSaveContent('edit-mode-desc', value)}>
                  <p className="text-gray-600">
                    {isEditMode 
                      ? "Edit mode is currently ON. You can edit content across the entire website." 
                      : "Edit mode is currently OFF. Enable it to edit content across the entire website."}
                  </p>
                </EditableWrapper>
                <Button 
                  variant={isEditMode ? "default" : "outline"}
                  className={isEditMode ? "bg-green-500 hover:bg-green-600" : ""}
                  onClick={toggleEditMode}
                >
                  {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
                </Button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg shadow">
              <EditableWrapper onSave={(value) => handleSaveContent('site-navigation-title', value)}>
                <h2 className="text-xl font-semibold mb-4">Site Navigation</h2>
              </EditableWrapper>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button onClick={() => navigate('/guest')} className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                <span>View Guest Home</span>
              </Button>
              <Button onClick={() => navigate('/charity')} className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                <span>View Charity Home</span>
              </Button>
              <Button onClick={() => navigate('/organization')} className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                <span>View Organization Home</span>
              </Button>
              </div>
            </div>
          </>
        )}
      </main>
      
      {!showTracking && (
        <div className="fixed bottom-6 right-6">
          {isEditMode ? (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-white shadow-lg"
                onClick={toggleEditMode}
              >
                <X className="h-6 w-6" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                onClick={toggleEditMode}
              >
                <Save className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full bg-primary hover:bg-primary/90 shadow-lg"
              onClick={toggleEditMode}
            >
              <Edit className="h-6 w-6" />
            </Button>
          )}
        </div>
      )}
      
      <LocationConsentDialog userType="admin" />
    </div>
  );
}
