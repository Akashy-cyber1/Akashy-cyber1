"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchLeads } from "@/lib/leads/api";
import { LEAD_STATUSES, LeadListResponse } from "@/lib/leads/types";
import { LeadStatusBadge } from "./lead-status-badge";

type QueryState = {
  search: string;
  status: string;
  page: number;
};

export function LeadListClient() {
  const [data, setData] = useState<LeadListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState<QueryState>({ search: "", status: "", page: 1 });

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("skycode_access_token");
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.status) params.set("status", query.status);
      params.set("page", String(query.page));

      try {
        setLoading(true);
        setError("");
        const response = await fetchLeads(token, `?${params.toString()}`);
        setData(response.data);
      } catch {
        setError("Failed to load leads.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [query]);

  if (loading) return <p className="text-sm text-slate-600">Loading leads...</p>;
  if (error) return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;

  if (!data || data.results.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">No leads found</p>
        <p className="mt-1 text-sm text-slate-600">Create your first lead to start pipeline tracking.</p>
        <Link href="/leads/new" className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Add Lead</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Search by name, phone, email"
          value={query.search}
          onChange={(event) => setQuery((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
        />
        <select
          className="rounded-md border px-3 py-2"
          value={query.status}
          onChange={(event) => setQuery((prev) => ({ ...prev, status: event.target.value, page: 1 }))}
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Next follow-up</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="px-4 py-3">
                  <Link href={`/leads/${lead.id}`} className="font-medium underline">{lead.name}</Link>
                  <p className="text-xs text-slate-600">{lead.phone}</p>
                </td>
                <td className="px-4 py-3"><LeadStatusBadge status={lead.status} /></td>
                <td className="px-4 py-3">{lead.assigned_to_name || "Unassigned"}</td>
                <td className="px-4 py-3">{lead.next_follow_up_at ? new Date(lead.next_follow_up_at).toLocaleString() : "Not scheduled"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-600">Total: {data.count}</p>
        <div className="space-x-2">
          <button className="rounded border px-3 py-1 text-sm" disabled={!data.previous} onClick={() => setQuery((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}>Prev</button>
          <button className="rounded border px-3 py-1 text-sm" disabled={!data.next} onClick={() => setQuery((prev) => ({ ...prev, page: prev.page + 1 }))}>Next</button>
        </div>
      </div>
    </div>
  );
}
