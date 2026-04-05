export const LEAD_STATUSES = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Interested", value: "interested" },
  { label: "Follow-up", value: "follow_up" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"];

export type Lead = {
  id: number;
  source: number | null;
  source_name?: string | null;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  budget: string | null;
  requirement: string;
  next_follow_up_at: string | null;
  assigned_to: number | null;
  assigned_to_name?: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
};

export type StaffOption = {
  id: number;
  email: string;
  name: string;
  role: "owner" | "staff";
};

export type LeadSource = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

export type LeadNote = {
  id: number;
  lead: number;
  note: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
};

export type LeadPayload = {
  source?: number | null;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  budget?: string | null;
  requirement?: string;
  next_follow_up_at?: string | null;
  assigned_to?: number | null;
};
