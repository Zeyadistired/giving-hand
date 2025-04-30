
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/ui/back-button";
import { Logo } from "@/components/ui/logo";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically trigger an email verification process
    setStep("reset");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setStep("success");
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
            <Button type="submit" className="w-full bg-charity-primary hover:bg-charity-dark">
              Send Reset Link
            </Button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*?&])[A-Za-z\d-_@$!%*?&]{8,}$"
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters with upper and lowercase letters, numbers, and special characters
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-charity-primary hover:bg-charity-dark">
              Reset Password
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-charity-primary">Password Reset Successful!</h2>
            <p>Your password has been successfully reset.</p>
            <Button onClick={() => window.location.href = '/login'} className="w-full bg-charity-primary hover:bg-charity-dark">
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
