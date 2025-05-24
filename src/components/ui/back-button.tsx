import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/utils/auth";

export function BackButton({ className = "mr-2" }: { className?: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    const userString = localStorage.getItem("currentUser");
    console.log("BackButton - currentUser:", userString);
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        console.log("BackButton - parsed user:", user);
        
        switch(user.type) {
          case 'charity':
            console.log("BackButton - navigating to /charity");
            navigate('/charity');
            break;
          case 'organization':
            console.log("BackButton - navigating to /organization");
            navigate('/organization');
            break;
          case 'factory':
            console.log("BackButton - navigating to /factory");
            navigate('/factory');
            break;
          case 'guest':
            console.log("BackButton - navigating to /guest");
            navigate('/guest', { replace: true });
            break;
          default:
            console.log("BackButton - no matching type, using navigate(-1)");
            navigate(-1);
        }
      } catch (error) {
        console.error("BackButton - error parsing user:", error);
        navigate(-1);
      }
    } else {
      console.log("BackButton - no currentUser found, using navigate(-1)");
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className={className}
      aria-label="Go back to dashboard"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
