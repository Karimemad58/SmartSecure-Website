import api from "./axios";

// ─── GET ALL SMART DEVICES ────────────────────────────────────────────
// Supports optional filters: location_id, status, firmware_version
export const getSmartDevices = ({ location_id, status, firmware_version } = {}) => {
  const params = new URLSearchParams();
  if (location_id)       params.append("location_id", location_id);
  if (status)            params.append("status", status);
  if (firmware_version)  params.append("firmware_version", firmware_version);
  const query = params.toString();
  return api.get(query ? `/smart-devices?${query}` : "/smart-devices");
};

// ─── GET ONE DEVICE BY ID ─────────────────────────────────────────────
export const getSmartDeviceById = (device_id) => {
  return api.get(`/smart-devices/${device_id}`);
};

// ─── GET DEVICES BY LOCATION ──────────────────────────────────────────
export const getDevicesByLocation = (location_id) => {
  return api.get(`/smart-devices?location_id=${location_id}`);
};

// ─── GET ONLINE DEVICES ───────────────────────────────────────────────
export const getOnlineDevices = () => {
  return api.get("/smart-devices?status=online");
};

// ─── CREATE SMART DEVICE ──────────────────────────────────────────────
// Required fields: serial_number, firmware_version, status, location_id
// status options: "online" | "offline" | "error"
export const createSmartDevice = (data) => {
  return api.post("/smart-devices", {
    serial_number:    data.serial_number,
    firmware_version: data.firmware_version,
    status:           data.status || "online",
    location_id:      data.location_id,
  });
};

// ─── UPDATE SMART DEVICE ──────────────────────────────────────────────
export const updateSmartDevice = (device_id, data) => {
  return api.put(`/smart-devices/${device_id}`, {
    serial_number:    data.serial_number,
    firmware_version: data.firmware_version,
    status:           data.status,
    location_id:      data.location_id,
  });
};

// ─── UPDATE DEVICE STATUS ONLY ────────────────────────────────────────
// status options: "online" | "offline" | "error"
export const updateDeviceStatus = (device_id, status) => {
  return api.patch(`/smart-devices/${device_id}`, { status });
};

// ─── UPDATE FIRMWARE ONLY ─────────────────────────────────────────────
export const updateFirmware = (device_id, firmware_version) => {
  return api.patch(`/smart-devices/${device_id}`, { firmware_version });
};

// ─── DELETE SMART DEVICE ──────────────────────────────────────────────
export const deleteSmartDevice = (device_id) => {
  return api.delete(`/smart-devices/${device_id}`);
};