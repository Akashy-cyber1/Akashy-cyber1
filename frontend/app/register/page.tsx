import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-2xl p-6 md:p-10">
      <h1 className="mb-2 text-3xl font-bold">Create SkyCode CRM Account</h1>
      <p className="mb-6 text-sm text-slate-600">Onboard your business and start tracking leads and payments with better follow-up discipline.</p>
      <RegisterForm />
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link className="font-medium text-slate-900 underline" href="/login">Login</Link>
      </p>
    </main>
  );
}
