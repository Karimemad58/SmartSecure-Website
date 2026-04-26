import api from "./axios";

// ─── GET ALL SUBSCRIPTIONS ────────────────────────────────────────────
// Supports optional filters: user_id, plan_id, status
export const getSubscriptions = ({ user_id, plan_id, status } = {}) => {
  const params = new URLSearchParams();
  if (user_id) params.append("user_id", user_id);
  if (plan_id) params.append("plan_id", plan_id);
  if (status)  params.append("status", status);
  const query = params.toString();
  return api.get(query ? `/subscriptions?${query}` : "/subscriptions");
};

// ─── GET ONE SUBSCRIPTION BY ID ───────────────────────────────────────
export const getSubscriptionById = (subscription_id) => {
  return api.get(`/subscriptions/${subscription_id}`);
};

// ─── GET SUBSCRIPTIONS FOR A USER ────────────────────────────────────
export const getMySubscriptions = (user_id) => {
  return api.get(`/subscriptions?user_id=${user_id}`);
};

// ─── GET ACTIVE SUBSCRIPTION FOR A USER ──────────────────────────────
export const getMyActiveSubscription = (user_id) => {
  return api.get(`/subscriptions?user_id=${user_id}&status=active`);
};

// ─── CREATE SUBSCRIPTION ──────────────────────────────────────────────
// Required fields: user_id, plan_id, start_date, end_date
// status options: "active" | "expired" | "cancelled"
// auto_renew: boolean
export const createSubscription = (data) => {
  return api.post("/subscriptions", {
    user_id:         data.user_id,
    plan_id:         data.plan_id,
    status:          data.status || "active",
    start_date:      data.start_date,
    end_date:        data.end_date,
    auto_renew:      data.auto_renew ?? false,
    last_payment_id: data.last_payment_id ?? null,
  });
};

// ─── UPDATE SUBSCRIPTION ──────────────────────────────────────────────
export const updateSubscription = (subscription_id, data) => {
  return api.put(`/subscriptions/${subscription_id}`, {
    user_id:         data.user_id,
    plan_id:         data.plan_id,
    status:          data.status,
    start_date:      data.start_date,
    end_date:        data.end_date,
    auto_renew:      data.auto_renew,
    last_payment_id: data.last_payment_id,
  });
};

// ─── CANCEL SUBSCRIPTION ──────────────────────────────────────────────
export const cancelSubscription = (subscription_id) => {
  return api.patch(`/subscriptions/${subscription_id}`, { status: "cancelled" });
};

// ─── TOGGLE AUTO RENEW ────────────────────────────────────────────────
export const toggleAutoRenew = (subscription_id, auto_renew) => {
  return api.patch(`/subscriptions/${subscription_id}`, { auto_renew });
};

// ─── DELETE SUBSCRIPTION ──────────────────────────────────────────────
export const deleteSubscription = (subscription_id) => {
  return api.delete(`/subscriptions/${subscription_id}`);
};