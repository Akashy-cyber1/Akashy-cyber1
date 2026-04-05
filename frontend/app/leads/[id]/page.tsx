import { LeadDetailClient } from "@/components/leads/lead-detail-client";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <LeadDetailClient leadId={Number(params.id)} />
    </main>
  );
}
