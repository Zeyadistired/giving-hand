import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BottomNav } from "@/components/ui/bottom-nav";
import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { PersonalTab } from "@/components/settings/personal-tab";
import { NotificationsTab } from "@/components/settings/notifications-tab";
import { LanguageTab } from "@/components/settings/language-tab";
import { HistoryTab } from "@/components/settings/history-tab";
import { LegalTab } from "@/components/settings/legal-tab";
import { AccountTab } from "@/components/settings/account-tab";
import { PasswordDialog } from "@/components/settings/password-dialog";
import { SubscriptionDialog } from "@/components/settings/subscription-dialog";
import { getUserSession, clearUserSession, getUserPreference, saveUserPreference } from "@/utils/auth";

export default function OrganizationSettings() {
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
      type: user.type === "organization" ? "Organization" : user.type || ""
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
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password changed successfully");
    setIsPasswordDialogOpen(false);
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

  return (
    <>
      <SettingsHeader userType={userData.type} onLogout={handleLogout} />
      <main className="flex-1 px-4 py-6 pb-20">
        <SettingsLayout
          userRole="organization"
          userData={userData}
          onLogout={handleLogout}
          profileTabContent={
            <PersonalTab 
              userData={userData}
              onPasswordChange={() => setIsPasswordDialogOpen(true)}
              onLogout={handleLogout}
            />
          }
          notificationsTabContent={
            <NotificationsTab />
          }
          languageTabContent={
            <LanguageTab />
            
          }
          historyTabContent={
            <HistoryTab 
              isSubscribed={isSubscribed} 
              onSubscribe={handleSubscribe}
              userType="organization"
            />
          }
          legalTabContent={
            <LegalTab />
          }
          accountTabContent={
            <AccountTab userEmail={userData.email} />
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
                  <BottomNav userRole="organization" />
    </>
  );
}