import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SettingsHeader } from "@/components/settings/settings-header";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { PersonalTab } from "@/components/settings/personal-tab";
import { SecurityTab } from "@/components/settings/security-tab";
import { NotificationsTab } from "@/components/settings/notifications-tab";
import { LanguageTab } from "@/components/settings/language-tab";
import { HistoryTab } from "@/components/settings/history-tab";
import { LegalTab } from "@/components/settings/legal-tab";
import { AccountTab } from "@/components/settings/account-tab";
import { BottomNav } from "@/components/ui/bottom-nav";
import { PasswordDialog } from "@/components/settings/password-dialog";
import { SubscriptionDialog } from "@/components/settings/subscription-dialog";

export default function CharitySettings() {
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
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setUserData({
      username: currentUser.name || "",
      email: currentUser.email || "",
      type: currentUser.type === "charity" ? "Charity/Shelter" : currentUser.type || ""
    });

    const subscriptionStatus = localStorage.getItem("isPremiumSubscribed");
    if (subscriptionStatus === "true") {
      setIsSubscribed(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isEditMode");
    localStorage.removeItem("isPremiumSubscribed");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    // This is now handled by the PasswordDialog component itself
    // Just close the dialog - the success message is shown by the dialog
    setIsPasswordDialogOpen(false);
  };

  const handleSubscribe = () => {
    setIsPaymentDialogOpen(true);
  };

  const handleSubscriptionCompleted = () => {
    localStorage.setItem("isPremiumSubscribed", "true");
    setIsSubscribed(true);
    setIsPaymentDialogOpen(false);
    toast.success("Subscription activated successfully! You now have access to premium analytics.");
  };

  return (
    <>

      <main className="flex-1 px-4 py-6 pb-20">
        <SettingsLayout
          userRole="charity"
          userData={userData}
          onLogout={handleLogout}
          profileTabContent={
            <PersonalTab
              userData={userData}
              onPasswordChange={() => setIsPasswordDialogOpen(true)}
              onLogout={handleLogout}
            />
          }
          securityTabContent={
            <SecurityTab
              onPasswordChange={handlePasswordChange}
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
              userType="charity"
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
            <BottomNav userRole="charity" />
    </>
  );
}
