import api from "./axios";

// ─── GET ALL PLANS ────────────────────────────────────────────────────
// Supports optional filter: is_active, locker_access
export const getSubscriptionPlans = ({ is_active, locker_access } = {}) => {
  const params = new URLSearchParams();
  if (is_active !== undefined)     params.append("is_active", is_active);
  if (locker_access !== undefined) params.append("locker_access", locker_access);
  const query = params.toString();
  return api.get(query ? `/subscription-plans?${query}` : "/subscription-plans");
};

// ─── GET ONLY ACTIVE PLANS ────────────────────────────────────────────
export const getActivePlans = () => {
  return api.get("/subscription-plans?is_active=true");
};

// ─── GET ONE PLAN BY ID ───────────────────────────────────────────────
export const getSubscriptionPlanById = (plan_id) => {
  return api.get(`/subscription-plans/${plan_id}`);
};

// ─── CREATE PLAN ──────────────────────────────────────────────────────
// Required fields: name, description, price, duration_days,
//                  discount_rate, locker_access, is_active
export const createSubscriptionPlan = (data) => {
  return api.post("/subscription-plans", {
    name:          data.name,
    description:   data.description,
    price:         data.price,
    duration_days: data.duration_days,
    discount_rate: data.discount_rate ?? 0,
    locker_access: data.locker_access ?? false,
    is_active:     data.is_active ?? true,
  });
};

// ─── UPDATE PLAN ──────────────────────────────────────────────────────
export const updateSubscriptionPlan = (plan_id, data) => {
  return api.put(`/subscription-plans/${plan_id}`, {
    name:          data.name,
    description:   data.description,
    price:         data.price,
    duration_days: data.duration_days,
    discount_rate: data.discount_rate,
    locker_access: data.locker_access,
    is_active:     data.is_active,
  });
};

// ─── TOGGLE PLAN ACTIVE STATUS ────────────────────────────────────────
export const togglePlanStatus = (plan_id, is_active) => {
  return api.patch(`/subscription-plans/${plan_id}`, { is_active });
};

// ─── DELETE PLAN ──────────────────────────────────────────────────────
export const deleteSubscriptionPlan = (plan_id) => {
  return api.delete(`/subscription-plans/${plan_id}`);
};