import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl p-6 md:p-10">
      <h1 className="mb-2 text-3xl font-bold">Login to SkyCode CRM</h1>
      <p className="mb-6 text-sm text-slate-600">Manage your leads, follow-ups, and business operations from one dashboard.</p>
      <LoginForm />
      <p className="mt-4 text-sm text-slate-600">
        New here? <Link className="font-medium text-slate-900 underline" href="/register">Create account</Link>
      </p>
    </main>
  );
}
