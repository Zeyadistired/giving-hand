
import React, { useState, useEffect } from "react";
import { Lock, Key, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OtpInput } from "./otp-input";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export function TwoFactorSection() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [otp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // For demo, store in localStorage ('2faEnabled', '2faPhone')
  useEffect(() => {
    const f = localStorage.getItem("2faEnabled") === "true";
    setEnabled(f);
    if (f) setPhone(localStorage.getItem("2faPhone") || "");
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [resendCooldown]);

  const sendOtp = (targetPhone: string) => {
    // Simulate sending OTP code
    const generated = String(Math.floor(Math.random() * 900_000) + 100_000);
    setOtpCode(generated);
    setOtp("");
    setResendCooldown(15);
    toast.info(`A 6-digit code was sent to ${targetPhone} (Demo: ${generated})`);
    // In production: integrate SMS API!
  };

  const startEnable = () => {
    setShowSetup(true);
    setStep("input");
  };

  const onEnableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01[0-9]{9}$/.test(phone)) {
      toast.error("Enter a valid Egyptian phone number.");
      return;
    }
    sendOtp(phone);
    setStep("verify");
  };

  const verifyOtp = (type: "enable" | "disable") => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp === otpCode) {
        if (type === "enable") {
          setEnabled(true);
          localStorage.setItem("2faEnabled", "true");
          localStorage.setItem("2faPhone", phone);
          setShowSetup(false);
          toast.success("✅ 2FA Enabled Successfully");
        } else {
          setEnabled(false);
          localStorage.setItem("2faEnabled", "false");
          setShowDisable(false);
          setPhone("");
          toast.success("✅ 2FA Disabled Successfully");
        }
      } else {
        toast.error("Invalid code, please try again.");
      }
    }, 700);
  };

  const startDisable = () => {
    setShowDisable(true);
    setOtp("");
    sendOtp(phone);
  };

  const isSectionInactive = !enabled && !showSetup;
  const icon = enabled ? <Key className="h-5 w-5 text-charity-primary" /> : <Lock className="h-5 w-5 text-gray-400" />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <span>{icon}</span>
        <CardTitle className="flex-1 text-base">Two-Factor Authentication</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Info className="h-4 w-4 text-gray-400" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <span>
                Add extra protection to your account by verifying your identity using a code sent to your phone.
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Section toggle and status */}
        {!enabled && !showSetup && (
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa-switch" className="font-medium">Enable Two-Factor Authentication</Label>
            <Switch id="2fa-switch" checked={false} onCheckedChange={startEnable} />
          </div>
        )}
        {enabled && (
          <div className="flex items-center justify-between">
            <span className="text-charity-primary font-medium">2FA Enabled</span>
            <Button size="sm" variant="outline" onClick={startDisable}>
              Disable
            </Button>
          </div>
        )}

        {/* Enable 2FA Flow */}
        {showSetup && (
          <form onSubmit={step === "input" ? onEnableSubmit : (e) => { e.preventDefault(); verifyOtp("enable"); }}>
            {step === "input" && (
              <div className="space-y-4">
                <Label htmlFor="2fa-phone">Verify Your Phone Number</Label>
                <Input 
                  id="2fa-phone" 
                  type="tel" 
                  inputMode="tel"
                  maxLength={11}
                  pattern="^01[0-9]{9}$"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0,11))}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={!/^01[0-9]{9}$/.test(phone)}>Send Code</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowSetup(false)}>Cancel</Button>
                </div>
              </div>
            )}
            {step === "verify" && (
              <div className="space-y-4">
                <Label>Enter the 6-digit code sent to your phone</Label>
                <OtpInput value={otp} onChange={setOtp} length={6} disabled={loading} />
                <div className="flex gap-2 items-center mt-1">
                  <Button type="button" size="sm" variant="outline" onClick={() => sendOtp(phone)} disabled={resendCooldown > 0}>
                    {resendCooldown > 0 ? `Resend (${resendCooldown})` : "Resend"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={otp.length !== 6 || loading}>{loading ? "Verifying..." : "Verify & Enable"}</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowSetup(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Disable 2FA Flow */}
        {showDisable && (
          <form onSubmit={e => { e.preventDefault(); verifyOtp("disable"); }}>
            <div className="space-y-4">
              <Label>Enter the code sent to your phone to disable 2FA</Label>
              <OtpInput value={otp} onChange={setOtp} length={6} disabled={loading} />
              <div className="flex gap-2 items-center mt-1">
                <Button type="button" size="sm" variant="outline" onClick={() => sendOtp(phone)} disabled={resendCooldown > 0}>
                  {resendCooldown > 0 ? `Resend (${resendCooldown})` : "Resend"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={otp.length !== 6 || loading}>{loading ? "Verifying..." : "Disable 2FA"}</Button>
                <Button type="button" variant="ghost" onClick={() => setShowDisable(false)}>Cancel</Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
