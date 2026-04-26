import api from "./axios";

// ─── GET ALL RESERVATIONS ─────────────────────────────────────────────
// Supports optional filters: user_id, locker_id, status
export const getReservations = ({ user_id, locker_id, status } = {}) => {
  const params = new URLSearchParams();
  if (user_id)   params.append("user_id", user_id);
  if (locker_id) params.append("locker_id", locker_id);
  if (status)    params.append("status", status);
  const query = params.toString();
  return api.get(query ? `/reservations?${query}` : "/reservations");
};

// ─── GET ONE RESERVATION BY ID ────────────────────────────────────────
export const getReservationById = (reservation_id) => {
  return api.get(`/reservations/${reservation_id}`);
};

// ─── GET RESERVATIONS FOR LOGGED-IN USER ─────────────────────────────
export const getMyReservations = (user_id) => {
  return api.get(`/reservations?user_id=${user_id}`);
};

// ─── CREATE RESERVATION ───────────────────────────────────────────────
// Required fields: user_id, locker_id, start_time, end_time, total_amount
// status defaults to "pending" on creation
export const createReservation = (data) => {
  return api.post("/reservations", {
    user_id:      data.user_id,
    locker_id:    data.locker_id,
    start_time:   data.start_time,   // format: "YYYY-MM-DD HH:MM:SS"
    end_time:     data.end_time,     // format: "YYYY-MM-DD HH:MM:SS"
    status:       data.status || "pending",
    total_amount: data.total_amount,
  });
};

// ─── UPDATE RESERVATION ───────────────────────────────────────────────
export const updateReservation = (reservation_id, data) => {
  return api.put(`/reservations/${reservation_id}`, {
    user_id:      data.user_id,
    locker_id:    data.locker_id,
    start_time:   data.start_time,
    end_time:     data.end_time,
    status:       data.status,
    total_amount: data.total_amount,
  });
};

// ─── UPDATE RESERVATION STATUS ONLY ──────────────────────────────────
// status options: "pending" | "active" | "completed" | "cancelled"
export const updateReservationStatus = (reservation_id, status) => {
  return api.patch(`/reservations/${reservation_id}`, { status });
};

// ─── CANCEL RESERVATION ───────────────────────────────────────────────
export const cancelReservation = (reservation_id) => {
  return api.patch(`/reservations/${reservation_id}`, { status: "cancelled" });
};

// ─── DELETE RESERVATION ───────────────────────────────────────────────
export const deleteReservation = (reservation_id) => {
  return api.delete(`/reservations/${reservation_id}`);
};