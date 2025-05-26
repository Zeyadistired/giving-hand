import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { clearUserSession, isLoggedIn } from "@/utils/auth";

const navLinks = [
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

export function MainHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserSession();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isAuthScreen = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
  const showLogout = !isAuthScreen && isLoggedIn();

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between h-16 sm:h-20">


          <Logo size="md" showText={true} />

        <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              asChild
              className={`text-sm sm:text-base font-medium ${
                pathname === link.path
                  ? "text-foreground underline underline-offset-4"
                  : "text-muted-foreground"
              }`}
            >
              <Link to={link.path}>
                {link.name}
              </Link>
            </Button>
          ))}
          {showLogout && (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-sm sm:text-base font-medium"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
