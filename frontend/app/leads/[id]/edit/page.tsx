"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/leads/lead-form";
import { fetchLeadById, updateLead } from "@/lib/leads/api";
import { Lead, LeadPayload } from "@/lib/leads/types";

export default function EditLeadPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLead = async () => {
      const token = localStorage.getItem("skycode_access_token");
      if (!token) {
        setError("Please login first.");
        return;
      }

      try {
        const response = await fetchLeadById(token, Number(params.id));
        setLead(response.data);
      } catch {
        setError("Unable to load lead.");
      }
    };

    loadLead();
  }, [params.id]);

  const onSubmit = async (payload: Partial<LeadPayload>) => {
    const token = localStorage.getItem("skycode_access_token");
    if (!token) {
      throw new Error("Missing token");
    }

    await updateLead(token, Number(params.id), payload);
    router.push(`/leads/${params.id}`);
  };

  if (error) return <main className="mx-auto max-w-3xl p-6"><p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p></main>;
  if (!lead) return <main className="mx-auto max-w-3xl p-6"><p className="text-sm text-slate-600">Loading lead...</p></main>;

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <h1 className="mb-6 text-3xl font-bold">Edit Lead</h1>
      <LeadForm initial={lead} onSubmit={onSubmit} submitLabel="Update Lead" />
    </main>
  );
}
