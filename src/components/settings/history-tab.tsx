
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportsCard } from "@/components/settings/reports-card";
import { FileDown } from "lucide-react";

interface HistoryTabProps {
  isSubscribed: boolean;
  onSubscribe: () => void;
  userType: "charity" | "organization";
}

export function HistoryTab({ isSubscribed, onSubscribe, userType }: HistoryTabProps) {
  const downloadReport = () => {
    // This would typically generate and download a report
    alert("Report downloading...");
  };

  return (
    <div className="space-y-4">
      <ReportsCard 
        isSubscribed={isSubscribed} 
        onSubscribe={onSubscribe}
        userType={userType}
      />
      
      {isSubscribed && (
        <Card>
          <CardHeader>
            <CardTitle>Download Reports</CardTitle>
            <CardDescription>Export your activity data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              As a premium subscriber, you can download detailed reports of your activity.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={downloadReport}>
                <FileDown className="h-4 w-4 mr-2" />
                Monthly Report
              </Button>
              
              <Button variant="outline" onClick={downloadReport}>
                <FileDown className="h-4 w-4 mr-2" />
                Quarterly Report
              </Button>
              
              <Button variant="outline" onClick={downloadReport}>
                <FileDown className="h-4 w-4 mr-2" />
                Annual Report
              </Button>
              
              <Button variant="outline" onClick={downloadReport}>
                <FileDown className="h-4 w-4 mr-2" />
                Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
