import api from "./axios";

// ─── GET ALL USERS ────────────────────────────────────────────────────
// Supports optional filters: role, status
export const getUsers = ({ role, status } = {}) => {
  const params = new URLSearchParams();
  if (role)   params.append("role", role);
  if (status) params.append("status", status);
  const query = params.toString();
  return api.get(query ? `/user/search?keyword=role&keyvalue=${role}` : "/user");
};

// ─── GET ONE USER BY ID ───────────────────────────────────────────────
export const getUserById = (user_id) => {
  return api.get(`/user?user_id=${user_id}`);
};

// ─── GET ONLY ADMINS ──────────────────────────────────────────────────
export const getAdmins = () => {
  return api.get("/user/search?keyword=role&keyvalue=admin");
};

// ─── GET ONLY CUSTOMERS ───────────────────────────────────────────────
export const getCustomers = () => {
  return api.get("/user/search?keyword=role&keyvalue=customer");
};

// ─── REGISTER (public) ───────────────────────────────────────────────
// Required fields: full_name, email, phone, password
// role defaults to "customer", status defaults to "active"
export const registerUser = (data) => {
  return api.post("/user", {
    full_name: data.full_name,
    email:     data.email,
    phone:     data.phone,
    password:  data.password,
    role:      data.role   || "customer",
    status:    data.status || "active",
  });
};

// ─── LOGIN (public) ───────────────────────────────────────────────────
export const loginUser = (data) => {
  return api.get(`/user/login?email=${data.email}&password=${data.password}`);
};

// ─── CREATE USER (admin) ─────────────────────────────────────────────
export const createUser = (data) => {
  return api.post("/user", {
    full_name: data.full_name,
    email:     data.email,
    phone:     data.phone,
    password:  data.password,
    role:      data.role   || "customer",
    status:    data.status || "active",
  });
};

// ─── UPDATE USER ──────────────────────────────────────────────────────
export const updateUser = (user_id, data) => {
  return api.put(`/user?user_id=${user_id}`, {
    full_name: data.full_name,
    email:     data.email,
    phone:     data.phone,
    role:      data.role,
    status:    data.status,
  });
};

// ─── UPDATE PASSWORD ONLY ─────────────────────────────────────────────
export const updatePassword = (user_id, data) => {
  return api.put(`/user?user_id=${user_id}`, {
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    status: data.status,
    old_password: data.old_password,
    new_password: data.new_password,
  });
};

// ─── UPDATE USER STATUS ONLY ──────────────────────────────────────────
// status options: "active" | "inactive"
export const updateUserStatus = (user_id, status) => {
  return api.put(`/user?user_id=${user_id}`, { status });
};

// ─── DELETE USER ──────────────────────────────────────────────────────
export const deleteUser = (user_id) => {
  return api.delete(`/user?user_id=${user_id}`);
};