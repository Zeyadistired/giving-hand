
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";

interface UserData {
  username: string;
  email: string;
  type: string;
}

interface PersonalTabProps {
  userData: UserData;
  onPasswordChange: () => void;
  onLogout: () => void;
}

export function PersonalTab({ userData, onPasswordChange, onLogout }: PersonalTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Username</h3>
            <p className="text-sm text-muted-foreground">{userData.username}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Organization Type</h3>
            <p className="text-sm text-muted-foreground">{userData.type}</p>
          </div>

          <Separator className="my-4" />

          <div className="pt-2">
            <Button
              variant="outline" 
              className="w-full border-charity-tertiary text-charity-tertiary hover:bg-charity-light hover:text-charity-tertiary"
              onClick={onPasswordChange}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button 
        variant="destructive" 
        className="w-full"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
