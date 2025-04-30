
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalInfoCardProps {
  onLogout: () => void;
}

export function PersonalInfoCard({ onLogout }: PersonalInfoCardProps) {
  // In a real app, fetch this from user state
  const userData = {
    username: "Organization123",
    email: "org@example.com",
    orgType: "Restaurant",
    lastLogin: new Date().toLocaleDateString()
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="bg-charity-light p-3 rounded-full">
            <User className="h-6 w-6 text-charity-primary" />
          </div>
          <div>
            <h3 className="font-medium">{userData.username}</h3>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Organization Type</p>
            <p>{userData.orgType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Login</p>
            <p>{userData.lastLogin}</p>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <Button variant="outline" className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:text-red-600"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
