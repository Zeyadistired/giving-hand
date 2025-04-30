
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EditableWrapper } from "@/components/ui/editable-wrapper";

export default function SystemSettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin/dashboard')}
            className="mr-2 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <EditableWrapper onSave={(value) => console.log('Title edited:', value)}>
            <h1 className="text-xl font-bold">System Settings</h1>
          </EditableWrapper>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <EditableWrapper onSave={(value) => console.log('Section title edited:', value)}>
                <h2 className="text-lg font-semibold">General Settings</h2>
              </EditableWrapper>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <EditableWrapper onSave={(value) => console.log('Setting label edited:', value)}>
                    <Label>Enable User Registration</Label>
                  </EditableWrapper>
                  <EditableWrapper onSave={(value) => console.log('Setting description edited:', value)}>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </p>
                  </EditableWrapper>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <EditableWrapper onSave={(value) => console.log('Setting label edited:', value)}>
                    <Label>Email Notifications</Label>
                  </EditableWrapper>
                  <EditableWrapper onSave={(value) => console.log('Setting description edited:', value)}>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for important events
                    </p>
                  </EditableWrapper>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <EditableWrapper onSave={(value) => console.log('Section title edited:', value)}>
                <h2 className="text-lg font-semibold">Security Settings</h2>
              </EditableWrapper>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <EditableWrapper onSave={(value) => console.log('Setting label edited:', value)}>
                    <Label>Two-Factor Authentication</Label>
                  </EditableWrapper>
                  <EditableWrapper onSave={(value) => console.log('Setting description edited:', value)}>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </EditableWrapper>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <EditableWrapper onSave={(value) => console.log('Setting label edited:', value)}>
                    <Label>Session Timeout</Label>
                  </EditableWrapper>
                  <EditableWrapper onSave={(value) => console.log('Setting description edited:', value)}>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </EditableWrapper>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
