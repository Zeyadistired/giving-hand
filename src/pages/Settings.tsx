import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { BottomNav } from "@/components/ui/bottom-nav";
import { getUserRole } from "@/utils/auth";
import { ThemeToggle } from "@/components/theme/theme-toggle"; // Assuming a theme toggle component

export default function Settings() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [theme, setTheme] = useState("light"); // State to store the theme
  const [language, setLanguage] = useState("en"); // State to store the language
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    // Load from localStorage on initial render
    const savedNotificationsEnabled = localStorage.getItem("notificationsEnabled");
    return savedNotificationsEnabled ? JSON.parse(savedNotificationsEnabled) : true;
  }); // State for notifications
  const [receiveUpdates, setReceiveUpdates] = useState(() => {
    // Load from localStorage on initial render
    const savedReceiveUpdates = localStorage.getItem("receiveUpdates");
    return savedReceiveUpdates ? JSON.parse(savedReceiveUpdates) : true;
  }); // Option to toggle receiving updates
  const [receiveMessages, setReceiveMessages] = useState(() => {
    // Load from localStorage on initial render
    const savedReceiveMessages = localStorage.getItem("receiveMessages");
    return savedReceiveMessages ? JSON.parse(savedReceiveMessages) : true;
  }); // Option to toggle receiving messages

  // Function to apply light or dark theme
  const toggleTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme); // Save theme preference to localStorage
    document.documentElement.classList.toggle("dark", selectedTheme === "dark"); // Apply dark class
  };

  // Function to save notifications preferences to localStorage
  const saveNotificationPreferences = () => {
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
    localStorage.setItem("receiveUpdates", JSON.stringify(receiveUpdates));
    localStorage.setItem("receiveMessages", JSON.stringify(receiveMessages));
  };

  useEffect(() => {
    // Check for saved theme preference in localStorage and apply it
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark"); // Apply dark mode
      }
    }

    // Get user role using our auth utility
    const role = getUserRole();
    if (role) {
      setUserRole(role);
      
      if (role === "charity") {
        navigate("/charity/settings", { replace: true });
      } else if (role === "organization") {
        navigate("/organization/settings", { replace: true });
      } else if (role === "admin") {
        navigate("/admin/system-settings", { replace: true });
      }
    } else {
      setUserRole("guest");
    }
  }, [navigate]);

  useEffect(() => {
    // Whenever any of the notification preferences change, save them
    saveNotificationPreferences();
  }, [notificationsEnabled, receiveUpdates, receiveMessages]);

  // If we're a guest, show some basic settings
  if (userRole === "guest") {
    return (
      <div className={`min-h-screen flex flex-col bg-background ${theme === "dark" ? "dark" : ""}`}>
        <main className="flex-1 px-4 py-6 pb-20">
          <h1 className="text-2xl font-bold text-charity-primary mb-6">Guest Settings</h1>
          
          {/* Appearance Section */}
          <div className="p-4 border rounded-lg">
            <h2 className="font-medium text-lg mb-2">Appearance</h2>
            <p className="text-muted-foreground text-sm mb-4">Customize how the application looks</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleTheme("light")}
                className={`px-6 py-2 rounded-lg font-medium ${theme === "light" ? "bg-charity-primary text-white" : "bg-transparent"} hover:bg-charity-dark transition-colors`}
              >
                Light Mode
              </button>
              <button
                onClick={() => toggleTheme("dark")}
                className={`px-6 py-2 rounded-lg font-medium ${theme === "dark" ? "bg-charity-primary text-white" : "bg-transparent"} hover:bg-charity-dark transition-colors`}
              >
                Dark Mode
              </button>
            </div>
          </div>

          {/* Language Section */}
          <div className="p-4 border rounded-lg mt-6">
            <h2 className="font-medium text-lg mb-2">Language</h2>
            <p className="text-muted-foreground text-sm mb-4">Choose your preferred language</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 border rounded w-full"
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          {/* Notifications Section */}
          <div className="p-4 border rounded-lg mt-6">
            <h2 className="font-medium text-lg mb-2">Notifications</h2>
            <p className="text-muted-foreground text-sm mb-4">Manage your notification preferences</p>
            <label className="flex items-center space-x-2">
              <span>Enable Notifications</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="toggle-checkbox"
              />
            </label>

            {notificationsEnabled && (
              <div className="mt-4">
                <h3 className="font-medium text-lg mb-2">Notification Preferences</h3>
                <label className="flex items-center space-x-2">
                  <span>Receive Updates</span>
                  <input
                    type="checkbox"
                    checked={receiveUpdates}
                    onChange={() => setReceiveUpdates(!receiveUpdates)}
                    className="toggle-checkbox"
                  />
                </label>
                <label className="flex items-center space-x-2 mt-2">
                  <span>Receive Messages</span>
                  <input
                    type="checkbox"
                    checked={receiveMessages}
                    onChange={() => setReceiveMessages(!receiveMessages)}
                    className="toggle-checkbox"
                  />
                </label>
              </div>
            )}
          </div>
        </main>
        
        {/* Bottom Navigation for Guest */}
        <BottomNav userRole="guest" />
      </div>
    );
  }

  // Redirecting or loading message for other roles
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to {userRole} settings page...</p>
    </div>
  );
}