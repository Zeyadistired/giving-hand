
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/ui/back-button";
import { Logo } from "@/components/ui/logo";
import { resetPassword } from "@/utils/auth";
import { toast } from "sonner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "success">("email");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setStep("success");
      toast.success("Password reset email sent successfully! Check your inbox.");
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center px-4 py-3">
          <BackButton />
          <h1 className="text-lg font-medium">Reset Password</h1>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-6 py-12 w-full max-w-md mx-auto">
        <Logo size="lg" className="mb-8" />

        {step === "email" && (
          <form onSubmit={handleSubmitEmail} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-charity-primary hover:bg-charity-dark"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-charity-primary">Reset Email Sent!</h2>
            <p>We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.</p>
            <Button onClick={() => window.location.href = '/login'} className="w-full bg-charity-primary hover:bg-charity-dark">
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
