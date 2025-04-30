import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { LifeBuoy, AlertTriangle, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AccountTabProps {
  userEmail: string;
}

export function AccountTab({ userEmail }: AccountTabProps) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [reportIssue, setReportIssue] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleContactSupport = () => {
    if (!supportMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    toast.success("Support request sent successfully");
    setSupportMessage("");
  };
  
  const handleReportProblem = () => {
    if (!reportIssue.trim()) {
      toast.error("Please describe the issue");
      return;
    }
    
    toast.success("Problem report submitted");
    setReportIssue("");
  };

  const handleDeleteAccount = () => {
    if (confirmEmail.toLowerCase() !== userEmail.toLowerCase()) {
      toast.error("Email does not match your account email");
      return;
    }
    
    toast.success("Account deletion request submitted");
    setIsDeleteDialogOpen(false);
    setConfirmEmail("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>Get help with your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="support-message">Contact Support</Label>
            <Textarea
              id="support-message"
              placeholder="Describe how we can help you..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={handleContactSupport}
            className="bg-charity-primary hover:bg-charity-dark"
          >
            <LifeBuoy className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Report a Problem</CardTitle>
          <CardDescription>Let us know if something isn't working</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-issue">Describe the Issue</Label>
            <Textarea
              id="report-issue"
              placeholder="What seems to be the problem?"
              value={reportIssue}
              onChange={(e) => setReportIssue(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={handleReportProblem}
            variant="outline"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Submit Report
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            <Trash className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
