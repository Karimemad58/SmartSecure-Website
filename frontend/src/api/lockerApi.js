import api from "./axios";

// ─── GET ALL LOCKERS ──────────────────────────────────────────────────
// Supports optional filters: location_id, status
export const getLockers = ({ location_id, status } = {}) => {
  const params = new URLSearchParams();
  if (location_id) params.append("location_id", location_id);
  if (status)      params.append("status", status);
  const query = params.toString();
  return api.get(query ? `/lockers?${query}` : "/lockers");
};

// ─── GET ONE LOCKER BY ID ─────────────────────────────────────────────
export const getLockerById = (locker_id) => {
  return api.get(`/lockers/${locker_id}`);
};

// ─── GET LOCKERS BY LOCATION ──────────────────────────────────────────
export const getLockersByLocation = (location_id) => {
  return api.get(`/lockers?location_id=${location_id}`);
};

// ─── GET AVAILABLE LOCKERS ────────────────────────────────────────────
export const getAvailableLockers = (location_id) => {
  const params = new URLSearchParams({ status: "available" });
  if (location_id) params.append("location_id", location_id);
  return api.get(`/lockers?${params.toString()}`);
};

// ─── CREATE LOCKER ────────────────────────────────────────────────────
// Required fields: locker_code, status, location_id, smart_device_id,
//                  installation_date, last_maintenance
// status options: "available" | "reserved" | "maintenance"
export const createLocker = (data) => {
  return api.post("/lockers", {
    locker_code:       data.locker_code,
    status:            data.status,
    location_id:       data.location_id,
    smart_device_id:   data.smart_device_id,
    installation_date: data.installation_date,
    last_maintenance:  data.last_maintenance,
  });
};

// ─── UPDATE LOCKER ────────────────────────────────────────────────────
export const updateLocker = (locker_id, data) => {
  return api.put(`/lockers/${locker_id}`, {
    locker_code:       data.locker_code,
    status:            data.status,
    location_id:       data.location_id,
    smart_device_id:   data.smart_device_id,
    installation_date: data.installation_date,
    last_maintenance:  data.last_maintenance,
  });
};

// ─── UPDATE LOCKER STATUS ONLY ────────────────────────────────────────
// Useful for quick status changes: available | reserved | maintenance
export const updateLockerStatus = (locker_id, status) => {
  return api.patch(`/lockers/${locker_id}`, { status });
};

// ─── DELETE LOCKER ────────────────────────────────────────────────────
export const deleteLocker = (locker_id) => {
  return api.delete(`/lockers/${locker_id}`);
};