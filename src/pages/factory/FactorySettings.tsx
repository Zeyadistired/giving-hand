import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { clearUserSession, getUserSession, getUserPreference, saveUserPreference } from "@/utils/auth";
import { toast } from "sonner";
import { FactoryHistory } from "@/components/factory/factory-history";
import { PasswordDialog } from "@/components/settings/password-dialog";
import { SecurityTab } from "@/components/settings/security-tab";
import { LanguageTab } from "@/components/settings/language-tab";
import { SubscriptionDialog } from "@/components/settings/subscription-dialog";

export default function FactorySettings() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    type: ""
  });

  useEffect(() => {
    const user = getUserSession();
    if (!user) {
      navigate('/login');
      return;
    }

    setUserData({
      username: user.name || "",
      email: user.email || "",
      type: "Factory"
    });

    // Check subscription status from user preferences
    const subscriptionStatus = getUserPreference('isPremium', false);
    setIsSubscribed(!!subscriptionStatus);
  }, [navigate]);

  const handleLogout = () => {
    clearUserSession();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSubscribe = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleSubscriptionCompleted = () => {
    saveUserPreference('isPremium', true);
    setIsSubscribed(true);
    setIsPaymentDialogOpen(false);
    toast.success("Subscription activated successfully! You now have access to premium analytics.");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    // This is now handled by the PasswordDialog component itself
    // Just close the dialog - the success message is shown by the dialog
    setIsPasswordDialogOpen(false);
  };

  return (
    <>
      <SettingsHeader userType={userData.type} onLogout={handleLogout} />
      <main className="flex-1 px-4 py-6 pb-20">
        <SettingsLayout
          userRole="factory"
          userData={userData}
          onLogout={handleLogout}
          profileTabContent={
            <div className="space-y-6">
              <div className="bg-white border rounded-lg p-5">
                <h2 className="font-semibold mb-2">Factory Information</h2>
                <p className="mb-1"><span className="text-muted-foreground">Name:</span> {userData.username}</p>
                <p className="mb-1"><span className="text-muted-foreground">Email:</span> {userData.email}</p>
                <p className="mb-1"><span className="text-muted-foreground">Account Type:</span> Factory</p>
              </div>
            </div>
          }
          historyTabContent={
            <FactoryHistory
              isSubscribed={isSubscribed}
              onSubscribe={handleSubscribe}
            />
          }
          securityTabContent={
            <SecurityTab
              onPasswordChange={handlePasswordChange}
              onLogout={handleLogout}
              userEmail={userData.email}
            />
          }
          languageTabContent={
            <LanguageTab />
          }
        />
      </main>

      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onPasswordChange={handlePasswordChange}
      />

      <SubscriptionDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onSubscriptionCompleted={handleSubscriptionCompleted}
      />
    </>
  );
}
