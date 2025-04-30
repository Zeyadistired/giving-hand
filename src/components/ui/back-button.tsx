
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/utils/auth";

export function BackButton({ className = "mr-2" }: { className?: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      const user = JSON.parse(userString);
      switch(user.type) {
        case 'charity':
          navigate('/charity');
          break;
        case 'organization':
          navigate('/organization');
          break;
        case 'factory':
          navigate('/factory');
          break;
        case 'guest':
          navigate('/guest');
          break;
        default:
          navigate(-1);
      }
    } else {
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
