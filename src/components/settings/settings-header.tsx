
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SettingsHeaderProps {
  userType: string;
  onLogout: () => void;
}

export function SettingsHeader({ userType, onLogout }: SettingsHeaderProps) {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    // Navigate to the correct dashboard based on user type
    switch(userType.toLowerCase()) {
      case 'charity':
        navigate('/charity');
        break;
      case 'organization':
        navigate('/organization');
        break;
      case 'factory':
        navigate('/factory');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToHome}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium">Settings</h1>
      </div>
    </header>
  );
}
