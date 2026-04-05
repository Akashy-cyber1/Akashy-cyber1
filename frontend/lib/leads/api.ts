import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Lead, LeadListResponse, LeadNote, LeadPayload, LeadSource, StaffOption } from "./types";

export async function fetchLeads(token: string, query = "") {
  return apiGet<LeadListResponse>(`${API_ENDPOINTS.leads}${query}`, token);
}

export async function fetchLeadById(token: string, id: number) {
  return apiGet<Lead>(`${API_ENDPOINTS.leads}${id}/`, token);
}

export async function createLead(token: string, payload: LeadPayload) {
  return apiPost<Lead, LeadPayload>(API_ENDPOINTS.leads, payload, token);
}

export async function updateLead(token: string, id: number, payload: Partial<LeadPayload>) {
  return apiPatch<Lead, Partial<LeadPayload>>(`${API_ENDPOINTS.leads}${id}/`, payload, token);
}

export async function deleteLead(token: string, id: number) {
  return apiDelete(`${API_ENDPOINTS.leads}${id}/`, token);
}

export async function fetchStaff(token: string) {
  return apiGet<StaffOption[]>(API_ENDPOINTS.leadStaff, token);
}

export async function fetchLeadSources(token: string) {
  return apiGet<LeadSource[]>(API_ENDPOINTS.leadSources, token);
}

export async function fetchLeadNotes(token: string, leadId: number) {
  return apiGet<LeadNote[]>(`${API_ENDPOINTS.leads}${leadId}/notes/`, token);
}

export async function addLeadNote(token: string, leadId: number, note: string) {
  return apiPost<LeadNote, { note: string }>(`${API_ENDPOINTS.leads}${leadId}/notes/`, { note }, token);
}
