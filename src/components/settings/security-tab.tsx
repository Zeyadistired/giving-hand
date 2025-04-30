
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { TwoFactorSection } from "./two-factor-section";

interface SecurityTabProps {
  onPasswordChange: (e: React.FormEvent) => void;
  onLogout: () => void;
  userEmail?: string;  // Making this prop optional
}

export function SecurityTab({ onPasswordChange, onLogout, userEmail }: SecurityTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setPasswordError("");
    
    if (!validatePassword(newPassword)) {
      setPasswordError("Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    onPasswordChange(e);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogoutAllDevices = () => {
    toast.success("Logged out from all devices");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Update your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters with at least one uppercase letter, 
                one lowercase letter, and one number
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            
            <Button 
              type="submit"
              className="w-full bg-charity-primary hover:bg-charity-dark"
            >
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <TwoFactorSection />

      <Card>
        <CardHeader>
          <CardTitle>Device Management</CardTitle>
          <CardDescription>Manage your logged in devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleLogoutAllDevices}
          >
            Logout from all devices
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
