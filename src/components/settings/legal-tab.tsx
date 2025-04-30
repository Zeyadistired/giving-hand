
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function LegalTab() {
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  const handleSavePreferences = () => {
    toast.success("Cookie preferences saved successfully");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Legal Documents</CardTitle>
          <CardDescription>View our legal policies and terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/terms">Terms & Conditions</Link>
          </Button>
          
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/privacy">Privacy Policy</Link>
          </Button>
          
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/cookies">Cookie Policy</Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cookie Preferences</CardTitle>
          <CardDescription>Manage how we use cookies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="necessary">
              <AccordionTrigger>
                <div className="flex items-center">
                  <span>Necessary Cookies</span>
                  <span className="ml-2 text-xs px-2 py-1 bg-muted rounded-full">Required</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly. They cannot be disabled.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="analytics">
              <AccordionTrigger>Analytics Cookies</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="analytics" 
                    checked={analyticsConsent}
                    onCheckedChange={(checked) => setAnalyticsConsent(checked as boolean)}
                  />
                  <Label htmlFor="analytics">
                    Allow analytics cookies to help us improve our website
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="marketing">
              <AccordionTrigger>Marketing Cookies</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="marketing" 
                    checked={marketingConsent}
                    onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                  />
                  <Label htmlFor="marketing">
                    Allow marketing cookies to personalize your experience
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Button 
            className="w-full mt-4 bg-charity-primary hover:bg-charity-dark"
            onClick={handleSavePreferences}
          >
            Save Cookie Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
