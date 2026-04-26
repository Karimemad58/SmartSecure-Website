import api from "./axios";

// ─── GET ALL NOTIFICATIONS ────────────────────────────────────────────
// Supports optional filters: user_id, type, is_read
export const getNotifications = ({ user_id, type, is_read } = {}) => {
  const params = new URLSearchParams();
  if (user_id !== undefined) params.append("user_id", user_id);
  if (type)                  params.append("type", type);
  if (is_read !== undefined) params.append("is_read", is_read);
  const query = params.toString();
  return api.get(query ? `/notifications?${query}` : "/notifications");
};

// ─── GET ONE NOTIFICATION BY ID ───────────────────────────────────────
export const getNotificationById = (notification_id) => {
  return api.get(`/notifications/${notification_id}`);
};

// ─── GET NOTIFICATIONS FOR A USER ────────────────────────────────────
export const getMyNotifications = (user_id) => {
  return api.get(`/notifications?user_id=${user_id}`);
};

// ─── GET UNREAD NOTIFICATIONS FOR A USER ─────────────────────────────
export const getUnreadNotifications = (user_id) => {
  return api.get(`/notifications?user_id=${user_id}&is_read=false`);
};

// ─── CREATE NOTIFICATION ──────────────────────────────────────────────
// Required fields: user_id, type, message
// type options: "system" | "payment" | "admin" | "locker" | "reservation"
// is_read defaults to false
export const createNotification = (data) => {
  return api.post("/notifications", {
    user_id: data.user_id,
    type:    data.type,
    message: data.message,
    is_read: data.is_read ?? false,
  });
};

// ─── MARK ONE NOTIFICATION AS READ ───────────────────────────────────
export const markAsRead = (notification_id) => {
  return api.patch(`/notifications/${notification_id}`, { is_read: true });
};

// ─── MARK ALL NOTIFICATIONS AS READ FOR A USER ───────────────────────
export const markAllAsRead = (user_id) => {
  return api.patch(`/notifications/read-all`, { user_id });
};

// ─── UPDATE NOTIFICATION ──────────────────────────────────────────────
export const updateNotification = (notification_id, data) => {
  return api.put(`/notifications/${notification_id}`, {
    user_id: data.user_id,
    type:    data.type,
    message: data.message,
    is_read: data.is_read,
  });
};

// ─── DELETE NOTIFICATION ──────────────────────────────────────────────
export const deleteNotification = (notification_id) => {
  return api.delete(`/notifications/${notification_id}`);
};

// ─── DELETE ALL NOTIFICATIONS FOR A USER ─────────────────────────────
export const deleteMyNotifications = (user_id) => {
  return api.delete(`/notifications?user_id=${user_id}`);
};