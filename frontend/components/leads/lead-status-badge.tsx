import { LeadStatus } from "@/lib/leads/types";

const styleMap: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-cyan-100 text-cyan-700",
  interested: "bg-purple-100 text-purple-700",
  follow_up: "bg-amber-100 text-amber-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styleMap[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
