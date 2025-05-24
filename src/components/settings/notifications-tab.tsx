import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NotificationsTab() {
  // Load initial state from localStorage or use defaults
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem("emailNotifications");
    return saved ? JSON.parse(saved) : true;
  });
  
  const [smsAlerts, setSmsAlerts] = useState(() => {
    const saved = localStorage.getItem("smsAlerts");
    return saved ? JSON.parse(saved) : false;
  });
  
  const [ticketUpdates, setTicketUpdates] = useState(() => {
    const saved = localStorage.getItem("ticketUpdates");
    return saved ? JSON.parse(saved) : true;
  });
  
  const [promoAlerts, setPromoAlerts] = useState(() => {
    const saved = localStorage.getItem("promoAlerts");
    return saved ? JSON.parse(saved) : false;
  });
  
  const [donationActivity, setDonationActivity] = useState(() => {
    const saved = localStorage.getItem("donationActivity");
    return saved ? JSON.parse(saved) : true;
  });

  const handleSavePreferences = () => {
    // Save all preferences to localStorage
    localStorage.setItem("emailNotifications", JSON.stringify(emailNotifications));
    localStorage.setItem("smsAlerts", JSON.stringify(smsAlerts));
    localStorage.setItem("ticketUpdates", JSON.stringify(ticketUpdates));
    localStorage.setItem("promoAlerts", JSON.stringify(promoAlerts));
    localStorage.setItem("donationActivity", JSON.stringify(donationActivity));
    
    toast.success("Notification preferences saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="text-xs text-muted-foreground">
                Receive notifications via email
              </span>
            </Label>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-alerts" className="flex flex-col space-y-1">
              <span>SMS Alerts</span>
              <span className="text-xs text-muted-foreground">
                Receive urgent alerts via SMS
              </span>
            </Label>
            <Switch 
              id="sms-alerts" 
              checked={smsAlerts} 
              onCheckedChange={setSmsAlerts}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Event Types</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="ticket-updates" className="flex flex-col space-y-1">
              <span>Ticket Updates</span>
              <span className="text-xs text-muted-foreground">
                Notifications about ticket status changes
              </span>
            </Label>
            <Switch 
              id="ticket-updates" 
              checked={ticketUpdates} 
              onCheckedChange={setTicketUpdates}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="promo-alerts" className="flex flex-col space-y-1">
              <span>Promotional Alerts</span>
              <span className="text-xs text-muted-foreground">
                Updates about new features and promotions
              </span>
            </Label>
            <Switch 
              id="promo-alerts" 
              checked={promoAlerts} 
              onCheckedChange={setPromoAlerts}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="donation-activity" className="flex flex-col space-y-1">
              <span>Donation Activity</span>
              <span className="text-xs text-muted-foreground">
                Updates about donation activity
              </span>
            </Label>
            <Switch 
              id="donation-activity" 
              checked={donationActivity} 
              onCheckedChange={setDonationActivity}
            />
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-charity-primary hover:bg-charity-dark"
          onClick={handleSavePreferences}
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
