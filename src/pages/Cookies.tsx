import React, { useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { motion } from "framer-motion";
import { Shield, Cookie, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCookiePreferences, saveCookiePreferences } from "@/utils/cookiePreferences";
import { toast } from "sonner";

const Cookies = () => {
  // Load saved preferences from localStorage on component mount
  const [analyticsConsent, setAnalyticsConsent] = useState(() => {
    const preferences = getCookiePreferences();
    return preferences.analytics;
  });

  const [marketingConsent, setMarketingConsent] = useState(() => {
    const preferences = getCookiePreferences();
    return preferences.marketing;
  });

  const handleSavePreferences = () => {
    // Debug: Log current state before saving
    console.log("Saving preferences:", {
      analytics: analyticsConsent,
      marketing: marketingConsent
    });

    // Save cookie preferences using utility function
    saveCookiePreferences({
      analytics: analyticsConsent,
      marketing: marketingConsent
    });

    // Debug: Log what was actually saved
    const saved = getCookiePreferences();
    console.log("Preferences after saving:", saved);

    toast.success("Cookie preferences saved successfully");
  };

  const handleAcceptAll = () => {
    setAnalyticsConsent(true);
    setMarketingConsent(true);
    saveCookiePreferences({
      analytics: true,
      marketing: true
    });
    toast.success("All cookies accepted and preferences saved");
  };

  const handleRejectAll = () => {
    setAnalyticsConsent(false);
    setMarketingConsent(false);
    saveCookiePreferences({
      analytics: false,
      marketing: false
    });
    toast.success("Optional cookies rejected and preferences saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <BackButton />
        <nav className="flex gap-2 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Cookies Policy</span>
        </nav>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden mb-8 shadow-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Cookies Policy</h1>
          <p className="text-white/90 max-w-2xl mb-6">
            Learn about how we use cookies to enhance your experience on our platform.
          </p>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* Do You Use Cookies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Cookie className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">Do You Use Cookies?</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Yes. We use cookies to:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Remember your login
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Track how users use the app
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Improve performance and personalization
            </li>
          </ul>
        </motion.section>

        {/* Types of Cookies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">Types of Cookies</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Essential cookies (for login and security)
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Performance cookies (Google Analytics etc.)
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Preference cookies (remembering settings)
            </li>
          </ul>
        </motion.section>

        {/* Disable Cookies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-full">
              <Settings className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-600">Can I Disable Cookies?</h2>
          </div>
          <p className="text-muted-foreground">
            Yes, you can disable cookies from your browser settings. However, please note that this may affect how our app works and some features may not function properly.
          </p>
        </motion.section>

        {/* Cookie Preferences Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Settings className="h-5 w-5 text-emerald-600" />
                </div>
                Cookie Preferences
              </CardTitle>
              <CardDescription>
                Manage your cookie preferences. You can enable or disable different types of cookies below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="necessary">
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full mr-4">
                      <span>Necessary Cookies</span>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={true} disabled />
                        <Label className="text-sm text-muted-foreground">Always Active</Label>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      These cookies are essential for the website to function properly. They enable basic features like page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="analytics">
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full mr-4">
                      <span>Analytics Cookies</span>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={analyticsConsent}
                          onCheckedChange={(checked) => {
                            console.log("Analytics checkbox changed to:", checked);
                            setAnalyticsConsent(checked === true);
                          }}
                        />
                        <Label className="text-sm">
                          {analyticsConsent ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance and user experience.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="marketing">
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full mr-4">
                      <span>Marketing Cookies</span>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={marketingConsent}
                          onCheckedChange={(checked) => {
                            console.log("Marketing checkbox changed to:", checked);
                            setMarketingConsent(checked === true);
                          }}
                        />
                        <Label className="text-sm">
                          {marketingConsent ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={handleAcceptAll}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Accept All Cookies
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                >
                  Reject Optional Cookies
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="bg-charity-primary hover:bg-charity-dark"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  </div>
  );
};

export default Cookies;
