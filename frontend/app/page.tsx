import { EmptyState } from "@/components/ui/empty-state";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <h1 className="mb-2 text-3xl font-bold">SkyCode CRM</h1>
      <p className="mb-8 text-slate-600">Phase 1 foundation is ready. Feature modules will be added incrementally.</p>
      <EmptyState
        title="No CRM data yet"
        description="Next phase will add authentication, business profile, and lead management flows."
      />
    </main>
  );
}
