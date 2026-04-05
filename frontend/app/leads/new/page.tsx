"use client";

import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/leads/lead-form";
import { createLead } from "@/lib/leads/api";

export default function CreateLeadPage() {
  const router = useRouter();

  const onSubmit = async (payload: Parameters<typeof createLead>[1]) => {
    const token = localStorage.getItem("skycode_access_token");
    if (!token) {
      throw new Error("Missing token");
    }

    const response = await createLead(token, payload);
    router.push(`/leads/${response.data.id}`);
  };

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <h1 className="mb-6 text-3xl font-bold">Add Lead</h1>
      <LeadForm onSubmit={onSubmit} submitLabel="Create Lead" />
    </main>
  );
}
