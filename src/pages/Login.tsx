import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/auth/login-form";
import { BottomNav } from "@/components/ui/bottom-nav";

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 flex flex-col">
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] bg-white flex flex-col md:flex-row">
          {/* Image Section - Larger and more prominent */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,transparent_60%)]"></div>
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-white max-w-md space-y-6 z-10">
                <div className="flex items-center justify-center h-full">
                  <img
                    src="/lovable-uploads/login1.webp"
                    alt="Login Illustration"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="flex-1 p-6 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Sign In</h2>
                <p className="text-gray-500">Access your account and get started</p>
              </div>

              {/* Mobile only image */}
              <div className="md:hidden flex justify-center mb-6">
                <img
                  src="/lovable-uploads/login1.webp"
                  alt="Login Illustration"
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              </div>

              <LoginForm />
            </div>
          </div>
        </div>
      </main>
      <BottomNav userRole="guest" hideHelp={true} hideHome={true} />
    </div>
  );
}