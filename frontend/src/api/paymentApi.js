import api from "./axios";

// ─── GET ALL PAYMENTS ─────────────────────────────────────────────────
// Supports optional filters: user_id, reservation_id, status, method
export const getPayments = ({ user_id, reservation_id, status, method } = {}) => {
  const params = new URLSearchParams();
  if (user_id)        params.append("user_id", user_id);
  if (reservation_id) params.append("reservation_id", reservation_id);
  if (status)         params.append("status", status);
  if (method)         params.append("method", method);
  const query = params.toString();
  return api.get(query ? `/payments?${query}` : "/payments");
};

// ─── GET ONE PAYMENT BY ID ────────────────────────────────────────────
export const getPaymentById = (payment_id) => {
  return api.get(`/payments/${payment_id}`);
};

// ─── GET PAYMENTS FOR A USER ──────────────────────────────────────────
export const getMyPayments = (user_id) => {
  return api.get(`/payments?user_id=${user_id}`);
};

// ─── GET PAYMENT FOR A RESERVATION ───────────────────────────────────
export const getPaymentByReservation = (reservation_id) => {
  return api.get(`/payments?reservation_id=${reservation_id}`);
};

// ─── CREATE PAYMENT ───────────────────────────────────────────────────
// Required fields: user_id, reservation_id, amount, method
// method options: "credit_card" | "cash" | "online"
// status options: "completed" | "pending" | "failed"
export const createPayment = (data) => {
  return api.post("/payments", {
    user_id:          data.user_id,
    reservation_id:   data.reservation_id,
    amount:           data.amount,
    method:           data.method,
    status:           data.status || "pending",
    transaction_date: data.transaction_date || new Date().toISOString(),
  });
};

// ─── UPDATE PAYMENT ───────────────────────────────────────────────────
export const updatePayment = (payment_id, data) => {
  return api.put(`/payments/${payment_id}`, {
    user_id:          data.user_id,
    reservation_id:   data.reservation_id,
    amount:           data.amount,
    method:           data.method,
    status:           data.status,
    transaction_date: data.transaction_date,
  });
};

// ─── UPDATE PAYMENT STATUS ONLY ───────────────────────────────────────
// status options: "completed" | "pending" | "failed"
export const updatePaymentStatus = (payment_id, status) => {
  return api.patch(`/payments/${payment_id}`, { status });
};

// ─── DELETE PAYMENT ───────────────────────────────────────────────────
export const deletePayment = (payment_id) => {
  return api.delete(`/payments/${payment_id}`);
};