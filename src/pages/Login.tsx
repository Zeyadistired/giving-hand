
import { LoginForm } from "@/components/auth/login-form";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex flex-col">
      <main className="flex-1 pb-16 flex items-center justify-center">
        <div className="flex w-full h-full bg-white shadow-lg">
          {/* Side PNG Image */}
          <div className="hidden md:flex items-center justify-center w-1/4 bg-gray-100 p-4">
            <img
          src="/lovable-uploads/login1.webp" // Update this path to your image
              alt="Side Illustration"
              className="max-h-48 w-auto"
            />
          </div>

          {/* Login Form */}
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
      <BottomNav userRole="guest" hideHelp={true} hideHome={true} />
    </div>
  );
}
