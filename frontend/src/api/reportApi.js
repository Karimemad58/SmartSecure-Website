import api from "./axios";

// ─── GET ALL REPORTS ──────────────────────────────────────────────────
// Supports optional filters: user_id, report_type, status, generation_mode
export const getReports = ({ user_id, report_type, status, generation_mode } = {}) => {
  const params = new URLSearchParams();
  if (user_id)         params.append("user_id", user_id);
  if (report_type)     params.append("report_type", report_type);
  if (status)          params.append("status", status);
  if (generation_mode) params.append("generation_mode", generation_mode);
  const query = params.toString();
  return api.get(query ? `/reports?${query}` : "/reports");
};

// ─── GET ONE REPORT BY ID ─────────────────────────────────────────────
export const getReportById = (report_id) => {
  return api.get(`/reports/${report_id}`);
};

// ─── GET REPORTS FOR A USER ───────────────────────────────────────────
export const getMyReports = (user_id) => {
  return api.get(`/reports?user_id=${user_id}`);
};

// ─── CREATE REPORT ────────────────────────────────────────────────────
// Required fields: user_id, report_type, period_start, period_end
// report_type options:
//   "system_activity" | "payment_summary" | "system_overview" |
//   "usage_summary"   | "locker_activity" | "locker_usage"    |
//   "admin_activity"  | "reservation_summary"
// status options:        "pending" | "generated"
// generation_mode options: "manual" | "auto"
export const createReport = (data) => {
  return api.post("/reports", {
    user_id:         data.user_id,
    report_type:     data.report_type,
    status:          data.status          || "pending",
    generation_mode: data.generation_mode || "manual",
    period_start:    data.period_start,   // "YYYY-MM-DD"
    period_end:      data.period_end,     // "YYYY-MM-DD"
  });
};

// ─── UPDATE REPORT ────────────────────────────────────────────────────
export const updateReport = (report_id, data) => {
  return api.put(`/reports/${report_id}`, {
    user_id:         data.user_id,
    report_type:     data.report_type,
    status:          data.status,
    generation_mode: data.generation_mode,
    period_start:    data.period_start,
    period_end:      data.period_end,
  });
};

// ─── MARK REPORT AS GENERATED ─────────────────────────────────────────
export const markReportGenerated = (report_id) => {
  return api.patch(`/reports/${report_id}`, { status: "generated" });
};

// ─── DELETE REPORT ────────────────────────────────────────────────────
export const deleteReport = (report_id) => {
  return api.delete(`/reports/${report_id}`);
};