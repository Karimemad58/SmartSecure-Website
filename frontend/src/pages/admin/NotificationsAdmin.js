import { useEffect, useState } from "react";
import api from "../../api/axios";

function NotificationsAdmin() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    notification_id: null,
    user_id: "",
    type: "",
    message: "",
    is_read: 0,
    sent_at: "",
  });

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notification");
      setNotifications(res.data);
    } catch (err) {
      alert("Error fetching notifications");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const resetForm = () => {
    setForm({ notification_id: null, user_id: "", type: "", message: "", is_read: 0, sent_at: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { notification_id, ...body } = form;

    if (!body.user_id || !body.type || !body.message) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/notification?notification_id=${notification_id}`, body);
        alert("Notification updated!");
      } else {
        await api.post("/notification", body);
        alert("Notification added!");
      }
      resetForm();
      fetchNotifications();
    } catch (err) {
      alert("Error saving notification");
    }
  };

  const handleEdit = (n) => {
    setForm(n);
    setIsEditing(true);
  };

  const handleDelete = async (notification_id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await api.delete(`/notification?notification_id=${notification_id}`);
      fetchNotifications();
    } catch (err) {
      alert("Error deleting notification");
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
      <p className="text-sm text-slate-500">
        Manage system notifications sent to users.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit Notification #${form.notification_id}` : "Add New Notification"}
        </h2>

        <div>
          <label className="text-sm">User ID</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            placeholder="User ID"
          />
        </div>

        <div>
          <label className="text-sm">Type</label>
          <select
            className="w-full border rounded-xl p-2 mt-1"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="reservation">Reservation</option>
            <option value="payment">Payment</option>
            <option value="maintenance">Maintenance</option>
            <option value="alert">Alert</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Message</label>
          <textarea
            className="w-full border rounded-xl p-2 mt-1"
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Notification message..."
          />
        </div>

        <div>
          <label className="text-sm">Is Read</label>
          <select
            className="w-full border rounded-xl p-2 mt-1"
            value={form.is_read}
            onChange={(e) => setForm({ ...form, is_read: Number(e.target.value) })}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Sent At</label>
          <input
            type="datetime-local"
            className="w-full border rounded-xl p-2 mt-1"
            value={form.sent_at}
            onChange={(e) => setForm({ ...form, sent_at: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            {isEditing ? "Update Notification" : "Add Notification"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="px-4 py-2 bg-slate-200 rounded-xl text-sm"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* NOTIFICATIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Read</th>
              <th className="px-4 py-2 text-left">Sent At</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.notification_id} className="border-b">
                <td className="px-4 py-2">{n.notification_id}</td>
                <td className="px-4 py-2">{n.user_id}</td>
                <td className="px-4 py-2 capitalize">{n.type}</td>
                <td className="px-4 py-2 max-w-xs truncate">{n.message}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${n.is_read ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {n.is_read ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2">{n.sent_at?.slice(0, 16).replace("T", " ")}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button className="text-indigo-600 text-xs" onClick={() => handleEdit(n)}>Edit</button>
                  <button className="text-rose-600 text-xs" onClick={() => handleDelete(n.notification_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-slate-500">No notifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotificationsAdmin;