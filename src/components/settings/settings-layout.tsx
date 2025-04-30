import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, TrendingUp, User, Globe, FileText, LockKeyhole } from "lucide-react";
import { UserRole } from "@/types";

export interface SettingsLayoutProps {
  userRole: UserRole;
  userData: {
    username: string;
    email: string;
    type: string;
  };
  onLogout: () => void;
  profileTabContent: React.ReactNode;
  historyTabContent: React.ReactNode;
  notificationsTabContent?: React.ReactNode;
  securityTabContent?: React.ReactNode;
  languageTabContent?: React.ReactNode;
  legalTabContent?: React.ReactNode;
  accountTabContent?: React.ReactNode;
}

export function SettingsLayout({
  userRole,
  userData,
  onLogout,
  profileTabContent,
  historyTabContent,
  notificationsTabContent,
  securityTabContent,
  languageTabContent,
  legalTabContent,
  accountTabContent,
}: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState("profile");

  // Combine profile and account content if both exist
  const combinedProfileContent = accountTabContent ? (
    <div className="space-y-8">
      {profileTabContent}
      {accountTabContent}
    </div>
  ) : (
    profileTabContent
  );

  return (
    <Tabs defaultValue="profile" className="w-full space-y-6" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8 p-1 bg-muted/10 rounded-xl gap-2">
        <TabsTrigger 
          value="profile" 
          className="data-[state=active]:bg-charity-primary data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-muted/20"
        >
          <User className="h-4 w-4 mr-1" /> Profile
        </TabsTrigger>
        <TabsTrigger 
          value="history" 
          className="data-[state=active]:bg-charity-primary data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-muted/20"
        >
          <TrendingUp className="h-4 w-4 mr-1" /> Analytics
        </TabsTrigger>
        {notificationsTabContent && (
          <TabsTrigger 
            value="notifications" 
            className="data-[state=active]:bg-charity-primary data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-muted/20"
          >
            <Bell className="h-4 w-4 mr-1" /> Notifications
          </TabsTrigger>
        )}
        {securityTabContent && (
          <TabsTrigger 
            value="security" 
            className="data-[state=active]:bg-charity-primary data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-muted/20"
          >
            <LockKeyhole className="h-4 w-4 mr-1" /> Security
          </TabsTrigger>
        )}
        {languageTabContent && (
          <TabsTrigger 
            value="language" 
            className="data-[state=active]:bg-charity-primary data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-muted/20"
          >
            <Globe className="h-4 w-4 mr-1" /> Language
          </TabsTrigger>
        )}
        {legalTabContent && (
          <TabsTrigger 
            value="legal" 
            className="data-[state=active]:bg-charity-primary data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-muted/20"
          >
            <FileText className="h-4 w-4 mr-1" /> Legal
          </TabsTrigger>
        )}
      </TabsList>

      <div className="space-y-8">
        <TabsContent value="profile" className="mt-6">
          {combinedProfileContent}
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          {historyTabContent}
        </TabsContent>
        
        {notificationsTabContent && (
          <TabsContent value="notifications" className="mt-6">
            {notificationsTabContent}
          </TabsContent>
        )}
        
        {securityTabContent && (
          <TabsContent value="security" className="mt-6">
            {securityTabContent}
          </TabsContent>
        )}
        
        {languageTabContent && (
          <TabsContent value="language" className="mt-6">
            {languageTabContent}
          </TabsContent>
        )}
        
        {legalTabContent && (
          <TabsContent value="legal" className="mt-6">
            {legalTabContent}
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
