"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { addLeadNote, deleteLead, fetchLeadById, fetchLeadNotes } from "@/lib/leads/api";
import { Lead, LeadNote } from "@/lib/leads/types";
import { LeadStatusBadge } from "./lead-status-badge";

export function LeadDetailClient({ leadId }: { leadId: number }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("skycode_access_token") : null;

  const load = async () => {
    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [leadRes, notesRes] = await Promise.all([fetchLeadById(token, leadId), fetchLeadNotes(token, leadId)]);
      setLead(leadRes.data);
      setNotes(notesRes.data);
      setError("");
    } catch {
      setError("Failed to load lead details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [leadId]);

  const submitNote = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !noteText.trim()) return;

    try {
      const noteRes = await addLeadNote(token, leadId, noteText.trim());
      setNotes((prev) => [noteRes.data, ...prev]);
      setNoteText("");
    } catch {
      setError("Unable to add note.");
    }
  };

  const onDelete = async () => {
    if (!token || !confirm("Delete this lead?")) return;

    try {
      await deleteLead(token, leadId);
      window.location.href = "/leads";
    } catch {
      setError("Unable to delete lead.");
    }
  };

  if (loading) return <p className="text-sm text-slate-600">Loading lead detail...</p>;
  if (error) return <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!lead) return <p className="text-sm">Lead not found.</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <p className="text-sm text-slate-600">{lead.phone} · {lead.email || "No email"}</p>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>
        <p className="mt-4 text-sm text-slate-700">{lead.requirement || "No requirement notes."}</p>
        <p className="mt-2 text-sm text-slate-600">Assigned to: {lead.assigned_to_name || "Unassigned"}</p>
        <p className="mt-1 text-sm text-slate-600">Next follow-up: {lead.next_follow_up_at ? new Date(lead.next_follow_up_at).toLocaleString() : "Not scheduled"}</p>

        <div className="mt-4 space-x-2">
          <Link href={`/leads/${lead.id}/edit`} className="rounded border px-3 py-2 text-sm">Edit</Link>
          <button onClick={onDelete} className="rounded border border-red-300 px-3 py-2 text-sm text-red-700">Delete</button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Lead Notes</h2>
        <form onSubmit={submitNote} className="space-y-3">
          <textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} className="w-full rounded-md border px-3 py-2" rows={3} placeholder="Add a follow-up note..." />
          <button className="rounded-md bg-slate-900 px-4 py-2 text-white">Add Note</button>
        </form>

        <div className="mt-4 space-y-3">
          {notes.length === 0 ? <p className="text-sm text-slate-600">No notes added yet.</p> : null}
          {notes.map((note) => (
            <div key={note.id} className="rounded border p-3">
              <p className="text-sm">{note.note}</p>
              <p className="mt-1 text-xs text-slate-500">{note.created_by_name || "Team"} · {new Date(note.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
