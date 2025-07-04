import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Info, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BackButton } from "@/components/ui/back-button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { signUp } from "@/utils/auth";

type OrganizationType = "hotel" | "supermarket" | "restaurant" | "other" | "";
type CharityCategory = "homeless" | "children" | "animal" | "elderly" | "foodbank" | "";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

export function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    selectedRole: "" as UserRole | "",
    organizationType: "" as OrganizationType,
    charityCategory: "" as CharityCategory,
  });

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    organizationType: "",
    charityCategory: "",
    selectedRole: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {
      email: "",
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      organizationType: "",
      charityCategory: "",
      selectedRole: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (!USERNAME_REGEX.test(formData.username)) {
      newErrors.username = "Username must be 3-20 characters, using only letters, numbers, and underscore";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password = "Password must be 8+ characters with uppercase, lowercase, and a number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.selectedRole) {
      newErrors.selectedRole = "Please select an account type";
    }

    if (formData.selectedRole === "organization" && !formData.organizationType) {
      newErrors.organizationType = "Please select your organization type";
    }

    if (formData.selectedRole === "charity" && !formData.charityCategory) {
      newErrors.charityCategory = "Please select your charity category";
    }

    setErrors(newErrors);

    const isBasicInfoValid = 
      formData.email !== "" &&
      formData.fullName !== "" &&
      formData.username !== "" &&
      formData.password !== "" &&
      formData.confirmPassword !== "" &&
      formData.selectedRole !== "" &&
      !newErrors.email &&
      !newErrors.fullName &&
      !newErrors.username &&
      !newErrors.password &&
      !newErrors.confirmPassword;

    const isRoleInfoValid = 
      (formData.selectedRole !== "organization" || formData.organizationType !== "") &&
      (formData.selectedRole !== "charity" || formData.charityCategory !== "");

    setIsFormValid(isBasicInfoValid && isRoleInfoValid);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      validateForm();
      return;
    }
    setShowTermsModal(true);
    setPendingSubmit(true);
    setTermsAccepted(false);
  };

  const handleFinalRegister = async () => {
    setSubmitting(true);
    try {
      // Sign up with Supabase
      const user = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        userType: formData.selectedRole,
        organizationType: formData.organizationType,
        charityCategory: formData.charityCategory,
      });

      toast.success("Account created successfully! Please login.");
      setShowTermsModal(false);
      setPendingSubmit(false);
      setSubmitting(false);
      navigate("/login");
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        setErrors(prev => ({
          ...prev,
          email: "Email already exists"
        }));
      } else {
        toast.error(error.message || 'Failed to create account');
      }
      setShowTermsModal(false);
      setSubmitting(false);
      setPendingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 w-full max-w-md mx-auto">
      <Dialog open={showTermsModal} onOpenChange={(v) => {setShowTermsModal(v); if (!v) setPendingSubmit(false);} }>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Info className="text-blue-500" /> Please Accept Terms and Conditions
            </DialogTitle>
          </DialogHeader>
          <div className="my-2 flex items-start gap-2">
            <Checkbox
              id="accept-terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="mt-1"
            />
            <label htmlFor="accept-terms" className="text-sm leading-5">
              I have read and accept the&nbsp;
              <Link to="/terms" className="underline text-charity-primary hover:text-charity-dark" target="_blank" rel="noopener noreferrer">
                Terms and Conditions
              </Link>
              .
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setShowTermsModal(false); setPendingSubmit(false); }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-charity-primary hover:bg-charity-dark"
              onClick={handleFinalRegister}
              disabled={!termsAccepted || submitting}
            >
              {submitting ? "Processing..." : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full flex items-center mb-6">
        <BackButton />
      </div>

      <Logo size="lg" className="mb-8" />

      <h1 className="text-2xl font-bold text-charity-primary mb-6">Create Your Account</h1>

      <form onSubmit={handleRegister} className="w-full space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange("email")}
            className={errors.email ? "border-red-500" : ""}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange("fullName")}
            className={errors.fullName ? "border-red-500" : ""}
            required
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleInputChange("username")}
            className={errors.username ? "border-red-500" : ""}
            required
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Account Type <span className="text-red-500">*</span></Label>
          <RadioGroup
            value={formData.selectedRole}
            onValueChange={(value) => setFormData(prev => ({ ...prev, selectedRole: value as UserRole | "" }))}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="charity" id="charity" />
              <Label htmlFor="charity" className="flex items-center gap-1">
                Charity
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shelter" id="shelter" />
              <Label htmlFor="shelter">Shelter</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organization" id="organization" />
              <Label htmlFor="organization" className="flex items-center gap-1">
                Organization
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="factory" id="factory" />
              <Label htmlFor="factory">Factory</Label>
            </div>
          </RadioGroup>
          {errors.selectedRole && (
            <p className="text-sm text-red-500">{errors.selectedRole}</p>
          )}
        </div>

        {formData.selectedRole === "organization" && (
          <div className="space-y-2">
            <Label>Organization Type</Label>
            <RadioGroup
              value={formData.organizationType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, organizationType: value as OrganizationType }))}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hotel" id="hotel" />
                <Label htmlFor="hotel">Hotel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supermarket" id="supermarket" />
                <Label htmlFor="supermarket">Supermarket</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="restaurant" id="restaurant" />
                <Label htmlFor="restaurant">Restaurant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
            {errors.organizationType && (
              <p className="text-sm text-red-500">{errors.organizationType}</p>
            )}
          </div>
        )}

        {formData.selectedRole === "charity" && (
          <div className="space-y-2">
            <Label>Charity Category</Label>
            <RadioGroup
              value={formData.charityCategory}
              onValueChange={(value) => setFormData(prev => ({ ...prev, charityCategory: value as CharityCategory }))}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="children" id="children" />
                <Label htmlFor="children">Children</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="elderly" id="elderly" />
                <Label htmlFor="elderly">Elderly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="homeless" id="homeless" />
                <Label htmlFor="homeless">Homeless</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="foodbank" id="foodbank" />
                <Label htmlFor="foodbank">Food Bank</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="animal" id="animal" />
                <Label htmlFor="animal">Animal Welfare</Label>
              </div>
            </RadioGroup>
            {errors.charityCategory && (
              <p className="text-sm text-red-500">{errors.charityCategory}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange("password")}
              className={errors.password ? "border-red-500" : ""}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-charity-primary hover:bg-charity-dark"
          disabled={!isFormValid}
        >
          Create Account
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-charity-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
