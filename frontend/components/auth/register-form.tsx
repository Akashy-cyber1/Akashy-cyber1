"use client";

import { FormEvent, useState } from "react";
import { registerUser } from "@/lib/auth/auth-api";
import { AuthFormError } from "./auth-form-error";

type RegisterState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  business_name: string;
  business_type: string;
  phone: string;
};

const initialState: RegisterState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  business_name: "",
  business_type: "",
  phone: "",
};

export function RegisterForm() {
  const [form, setForm] = useState<RegisterState>(initialState);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.first_name || !form.email || !form.password || !form.business_name || !form.business_type || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(form);
      if (typeof window !== "undefined") {
        localStorage.setItem("skycode_access_token", response.data.tokens.access);
        localStorage.setItem("skycode_refresh_token", response.data.tokens.refresh);
      }
      setSuccess("Account created and business onboarded successfully.");
      setForm(initialState);
    } catch (err) {
      const fallback = "Unable to register at the moment.";
      if (typeof err === "object" && err) {
        if ("email" in err && Array.isArray((err as { email?: string[] }).email)) {
          setError((err as { email: string[] }).email[0]);
          return;
        }
        if ("detail" in err) {
          setError(String((err as { detail?: string }).detail || fallback));
          return;
        }
      }
      setError(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <AuthFormError message={error} />
      {success ? <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="First name*" value={form.first_name} onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))} />
        <input className="rounded-md border px-3 py-2" placeholder="Last name" value={form.last_name} onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))} />
      </div>

      <input className="w-full rounded-md border px-3 py-2" type="email" placeholder="Email*" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
      <input className="w-full rounded-md border px-3 py-2" type="password" placeholder="Password*" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
      <input className="w-full rounded-md border px-3 py-2" placeholder="Business name*" value={form.business_name} onChange={(event) => setForm((prev) => ({ ...prev, business_name: event.target.value }))} />
      <input className="w-full rounded-md border px-3 py-2" placeholder="Business type* (Clinic, Coaching, etc.)" value={form.business_type} onChange={(event) => setForm((prev) => ({ ...prev, business_type: event.target.value }))} />
      <input className="w-full rounded-md border px-3 py-2" placeholder="Phone*" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />

      <button type="submit" disabled={loading} className="w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
