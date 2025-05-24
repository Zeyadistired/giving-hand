import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";

export function LanguageTab() {
  const [language, setLanguage] = useState("en");
  const { theme, setTheme } = useTheme();
  
  const handleLanguageChange = (value: string) => {
    if (value === "ar") {
      toast.info("Arabic language support coming soon!");
      return;
    }
    setLanguage(value);
  };

  const handleSaveLanguage = () => {
    toast.success(`Language updated to ${language === "en" ? "English" : "Arabic"}`);
  };

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    toast.success(`Theme changed to ${selectedTheme === "dark" ? "Dark" : "Light"} mode`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language & Display</CardTitle>
        <CardDescription>Set your preferred language and display options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Select Language</h3>
          
          <RadioGroup 
            value={language} 
            onValueChange={handleLanguageChange}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="english" />
              <Label htmlFor="english">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ar" id="arabic" />
              <Label htmlFor="arabic">العربية (Arabic)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Select Theme</h3>
          
          <RadioGroup 
            value={theme} 
            onValueChange={handleThemeChange}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light-theme" />
              <Label htmlFor="light-theme" className="flex items-center">
                <Sun className="mr-2 h-4 w-4" /> Light Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark-theme" />
              <Label htmlFor="dark-theme" className="flex items-center">
                <Moon className="mr-2 h-4 w-4" /> Dark Mode
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          className="w-full mt-4 bg-charity-primary hover:bg-charity-dark"
          onClick={handleSaveLanguage}
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
