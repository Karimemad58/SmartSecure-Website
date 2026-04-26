import api from "./axios";

// ─── GET ALL LOCATIONS ───────────────────────────────────────────────
// Supports optional filters: city, category
export const getLocations = ({ city, category } = {}) => {
  const params = new URLSearchParams();
  if (city && city.trim())         params.append("city", city);
  if (category && category.trim()) params.append("category", category);
  const query = params.toString();
  return api.get(query ? `/locations?${query}` : "/locations");
};

// ─── GET ONE LOCATION BY ID ──────────────────────────────────────────
export const getLocationById = (location_id) => {
  return api.get(`/locations/${location_id}`);
};

// ─── CREATE LOCATION ─────────────────────────────────────────────────
// Required fields: name, address, city, category, num_lockers
export const createLocation = (data) => {
  return api.post("/locations", {
    name:        data.name,
    address:     data.address,
    city:        data.city,
    category:    data.category,
    num_lockers: data.num_lockers,
  });
};

// ─── UPDATE LOCATION ─────────────────────────────────────────────────
export const updateLocation = (location_id, data) => {
  return api.put(`/locations/${location_id}`, {
    name:        data.name,
    address:     data.address,
    city:        data.city,
    category:    data.category,
    num_lockers: data.num_lockers,
  });
};

// ─── DELETE LOCATION ─────────────────────────────────────────────────
export const deleteLocation = (location_id) => {
  return api.delete(`/locations/${location_id}`);
};