
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { setUserSession } from "@/utils/auth";
import { initializeDatabase } from "@/utils/initializeDatabase";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Make sure database is initialized when login form is loaded
  useEffect(() => {
    initializeDatabase();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Force database initialization check
      initializeDatabase();

      console.log("Login attempt:", email);
      
      // First check the initial database
      const initialDb = JSON.parse(localStorage.getItem("initialDatabase") || "[]");
      // Then check the user database
      const existingUsers = JSON.parse(localStorage.getItem("usersDatabase") || "[]");
      
      const combinedUsers = [...initialDb, ...existingUsers];
      
      console.log("Available users:", combinedUsers);
      
      const user = combinedUsers.find(
        (u: any) => 
          (u.email && u.email.toLowerCase() === email.toLowerCase()) || 
          (u.username && u.username.toLowerCase() === email.toLowerCase())
      );
      
      if (!user) {
        console.log("User not found");
        setError("Invalid email or password.");
        setIsLoading(false);
        return;
      }
      
      if (user.password !== password) {
        console.log("Password mismatch");
        setError("Invalid email or password.");
        setIsLoading(false);
        return;
      }
      
      console.log("Login successful for user:", user);
      
      // Set the user session
      setUserSession({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        type: user.type,
      });
      
      toast.success("Login successful!");
      
      // Navigate based on user type
      switch (user.type) {
        case "charity":
          navigate("/charity");
          break;
        case "organization":
          navigate("/organization");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "factory":
          navigate("/factory");
          break;
        default:
          navigate("/guest");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    setUserSession({
      id: 'guest-' + Date.now(),
      name: 'Guest',
      email: '',
      username: 'guest',
      type: 'guest',
    });
    
    toast.success("Continuing as Guest");
    navigate("/guest");
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 w-full max-w-md mx-auto">
      <Logo size="lg" className="mb-8" />
      
      <h1 className="text-2xl font-bold text-charity-primary mb-2">Welcome Back</h1>
      <p className="text-muted-foreground mb-8">Sign in to your account</p>
      
      {error && (
        <div className="w-full p-3 mb-5 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email or Username</Label>
          <Input
            id="email"
            value={email}
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-charity-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-charity-primary hover:bg-charity-dark"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        
        <div className="text-center text-sm mt-6">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/register" className="text-charity-primary hover:underline font-medium">
            Create Account
          </Link>
        </div>
      </form>

      <div className="w-full mt-4">
        <Button
          variant="outline"
          onClick={handleContinueAsGuest}
          className="w-full"
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}
