"use client";

import { FormEvent, useEffect, useState } from "react";
import { fetchLeadSources, fetchStaff } from "@/lib/leads/api";
import { LEAD_STATUSES, Lead, LeadPayload, LeadSource, StaffOption } from "@/lib/leads/types";
import { AuthFormError } from "@/components/auth/auth-form-error";

type LeadFormProps = {
  initial?: Lead;
  onSubmit: (payload: LeadPayload) => Promise<void>;
  submitLabel: string;
};

export function LeadForm({ initial, onSubmit, submitLabel }: LeadFormProps) {
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<LeadPayload>({
    name: initial?.name || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    status: initial?.status || "new",
    source: initial?.source || null,
    budget: initial?.budget || null,
    requirement: initial?.requirement || "",
    next_follow_up_at: initial?.next_follow_up_at || null,
    assigned_to: initial?.assigned_to || null,
  });

  useEffect(() => {
    const loadMeta = async () => {
      const token = localStorage.getItem("skycode_access_token");
      if (!token) {
        setError("Please login first.");
        setLoadingMeta(false);
        return;
      }

      try {
        setLoadingMeta(true);
        const [staffRes, sourceRes] = await Promise.all([fetchStaff(token), fetchLeadSources(token)]);
        setStaff(staffRes.data);
        setSources(sourceRes.data);
      } catch {
        setError("Failed to load staff and lead sources.");
      } finally {
        setLoadingMeta(false);
      }
    };

    loadMeta();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.status) {
      setError("Name, phone, and status are required.");
      return;
    }

    try {
      setSaving(true);
      await onSubmit(form);
    } catch {
      setError("Unable to save lead. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingMeta) {
    return <p className="text-sm text-slate-600">Loading lead form...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6">
      <AuthFormError message={error} />

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="Lead name*" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        <input className="rounded-md border px-3 py-2" placeholder="Phone*" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-md border px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
        <select className="rounded-md border px-3 py-2" value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as LeadPayload["status"] }))}>
          {LEAD_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <select className="rounded-md border px-3 py-2" value={form.assigned_to ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, assigned_to: event.target.value ? Number(event.target.value) : null }))}>
          <option value="">Unassigned</option>
          {staff.map((user) => (
            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
          ))}
        </select>

        <select className="rounded-md border px-3 py-2" value={form.source ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value ? Number(event.target.value) : null }))}>
          <option value="">No source</option>
          {sources.map((source) => (
            <option key={source.id} value={source.id}>{source.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-md border px-3 py-2" placeholder="Budget" value={form.budget ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value || null }))} />
        <input className="rounded-md border px-3 py-2" type="datetime-local" value={form.next_follow_up_at ? form.next_follow_up_at.slice(0, 16) : ""} onChange={(event) => setForm((prev) => ({ ...prev, next_follow_up_at: event.target.value ? new Date(event.target.value).toISOString() : null }))} />
      </div>

      <textarea className="w-full rounded-md border px-3 py-2" rows={4} placeholder="Lead requirement" value={form.requirement} onChange={(event) => setForm((prev) => ({ ...prev, requirement: event.target.value }))} />

      <button type="submit" disabled={saving} className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60">{saving ? "Saving..." : submitLabel}</button>
    </form>
  );
}
