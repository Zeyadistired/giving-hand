
import { RegisterForm } from "@/components/auth/register-form";

export default function Register() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <RegisterForm />
      </main>
    </div>
  );
}
