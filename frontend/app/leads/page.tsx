import Link from "next/link";
import { LeadListClient } from "@/components/leads/lead-list-client";

export default function LeadsPage() {
  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-sm text-slate-600">Track pipeline, assignments, and follow-ups.</p>
        </div>
        <Link href="/leads/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Add Lead</Link>
      </div>
      <LeadListClient />
    </main>
  );
}
