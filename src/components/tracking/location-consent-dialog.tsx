
import { useState, useEffect } from "react";
import { Check, X, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LocationConsentDialogProps {
  userType: "charity" | "organization" | "admin";
}

export function LocationConsentDialog({ userType }: LocationConsentDialogProps) {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Check if user already gave consent
    const locationConsent = localStorage.getItem("locationConsent");
    if (locationConsent === null) {
      setOpen(true);
    }
  }, []);

  const handleAllow = async () => {
    try {
      // Request browser permission
      const permission = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      
      if (permission.state === "granted" || permission.state === "prompt") {
        // Watch position and store the watchId
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Save last known position in localStorage
            localStorage.setItem("lastKnownLocation", JSON.stringify({ latitude, longitude }));
            // In a real app, you would send this to your backend periodically
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error("Unable to track location. Please check your browser settings.");
          },
          { enableHighAccuracy: true }
        );
        
        // Store watchId to clear it later if needed
        localStorage.setItem("locationWatchId", watchId.toString());
        
        // Store consent
        localStorage.setItem("locationConsent", "granted");
        toast.success("Location tracking enabled");
      } else {
        // User denied permission at browser level
        localStorage.setItem("locationConsent", "denied");
        toast.warning("Location tracking was denied. Some features will be limited.");
      }
      
      setOpen(false);
    } catch (error) {
      console.error("Error requesting location permission:", error);
      toast.error("There was an error requesting location permission");
      setOpen(false);
    }
  };

  const handleDeny = () => {
    localStorage.setItem("locationConsent", "denied");
    toast.info("You've chosen not to share your location. Some features will be limited.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-charity-primary" />
            Location Permission
          </DialogTitle>
          <DialogDescription>
            Allow Giving Hand to track your location while using the app?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <p className="text-sm text-muted-foreground">This helps us:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-charity-primary mt-0.5" />
              <span>Match nearby donations and pickups</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-charity-primary mt-0.5" />
              <span>Track delivery routes for safety and transparency</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-charity-primary mt-0.5" />
              <span>Improve logistics and reporting accuracy</span>
            </li>
          </ul>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline"
            className="flex-1 sm:flex-none" 
            onClick={handleDeny}
          >
            <X className="h-4 w-4 mr-2" />
            Deny
          </Button>
          <Button 
            className="flex-1 sm:flex-none bg-charity-primary hover:bg-charity-primary/90" 
            onClick={handleAllow}
          >
            <Check className="h-4 w-4 mr-2" />
            Allow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
