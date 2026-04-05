"use client";

import { FormEvent, useState } from "react";
import { loginUser } from "@/lib/auth/auth-api";
import { AuthFormError } from "./auth-form-error";

type LoginState = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [form, setForm] = useState<LoginState>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(form);
      if (typeof window !== "undefined") {
        localStorage.setItem("skycode_access_token", response.data.access);
        localStorage.setItem("skycode_refresh_token", response.data.refresh);
      }
      setSuccess("Login successful. Tokens stored locally for development.");
    } catch (err) {
      const fallback = "Unable to login. Please check your credentials.";
      if (typeof err === "object" && err && "detail" in err) {
        setError(String((err as { detail?: string }).detail || fallback));
      } else {
        setError(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      <AuthFormError message={error} />
      {success ? <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          className="w-full rounded-md border px-3 py-2"
          placeholder="you@business.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          className="w-full rounded-md border px-3 py-2"
          placeholder="********"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
