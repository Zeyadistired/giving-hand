import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signIn } from "@/utils/auth";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await signIn(email, password);

      // Store user session
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userRole', user.type);

      // Navigate based on user type
      switch (user.type) {
        case 'charity':
          navigate('/charity');
          break;
        case 'organization':
          navigate('/organization');
          break;
        case 'factory':
          navigate('/factory');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }

      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    // Implement guest login logic here
    toast.success("Continuing as Guest");
    navigate("/guest");
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-emerald-600 mb-8">Welcome Back</h1>

      {error && (
        <div className="w-full p-3 mb-5 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center text-sm mt-6">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium">
            Create Account
          </Link>
        </div>
      </form>

      <div className="w-full mt-4">
        <Button
          variant="outline"
          onClick={handleContinueAsGuest}
          className="w-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 text-emerald-600 rounded-md py-2"
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
}
