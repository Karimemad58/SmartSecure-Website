import { useEffect, useState } from "react";
import api from "../../api/axios";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    user_id: null,
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    status: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user");
      setUsers(res.data);
    } catch (err) {
      alert("Error fetching users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setForm({
      user_id: null,
      full_name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      status: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user_id, ...body } = form;

    if (!body.full_name || !body.email || !body.role) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/user?user_id=${user_id}`, body);
        alert("User updated!");
      } else {
        await api.post("/user", body);
        alert("User added!");
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      alert("Error saving user");
    }
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: "" });
    setIsEditing(true);
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/user?user_id=${user_id}`);
      fetchUsers();
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const statusColor = (status) => {
    if (status === "active") return "bg-emerald-100 text-emerald-700";
    if (status === "inactive") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  const roleColor = (role) => {
    if (role === "admin") return "bg-indigo-100 text-indigo-700";
    return "bg-slate-100 text-slate-600";
  };

  if (loading)
    return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Users</h1>
      <p className="text-sm text-slate-500">
        Manage all SmartSecure Lockers registered users.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl">
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit User #${form.user_id}` : "Add New User"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Full Name</label>
            <input
              className="w-full border rounded-xl p-2 mt-1"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Phone</label>
            <input
              className="w-full border rounded-xl p-2 mt-1"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={
                isEditing ? "Leave blank to keep current" : "Password"
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Role</label>
            <select
              className="w-full border rounded-xl p-2 mt-1"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="customer">customer</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Status</label>
            <select
              className="w-full border rounded-xl p-2 mt-1"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            {isEditing ? "Update User" : "Add User"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="px-4 py-2 bg-slate-200 rounded-xl text-sm"
              onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-b">
                <td className="px-4 py-2">{u.user_id}</td>
                <td className="px-4 py-2">{u.full_name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.phone}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs ${statusColor(u.status)}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    className="text-indigo-600 text-xs"
                    onClick={() => handleEdit(u)}>
                    Edit
                  </button>
                  <button
                    className="text-rose-600 text-xs"
                    onClick={() => handleDelete(u.user_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersAdmin;
