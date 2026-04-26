import { useEffect, useState } from "react";
import api from "../../api/axios";

function SubscriptionsAdmin() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    subscription_id: null,
    user_id: "",
    plan_id: "",
    status: "",
    start_date: "",
    end_date: "",
    auto_renew: 0,
    last_payment_id: "",
  });

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get("/subscription");
      setSubscriptions(res.data);
    } catch (err) {
      alert("Error fetching subscriptions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const resetForm = () => {
    setForm({ subscription_id: null, user_id: "", plan_id: "", status: "", start_date: "", end_date: "", auto_renew: 0, last_payment_id: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subscription_id, ...body } = form;

    if (!body.user_id || !body.plan_id || !body.status) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/subscription?subscription_id=${subscription_id}`, body);
        alert("Subscription updated!");
      } else {
        await api.post("/subscription", body);
        alert("Subscription added!");
      }
      resetForm();
      fetchSubscriptions();
    } catch (err) {
      alert("Error saving subscription");
    }
  };

  const handleEdit = (s) => {
    setForm({
      ...s,
      start_date: s.start_date?.slice(0, 10),
      end_date: s.end_date?.slice(0, 10),
    });
    setIsEditing(true);
  };

  const handleDelete = async (subscription_id) => {
    if (!window.confirm("Delete this subscription?")) return;
    try {
      await api.delete(`/subscription?subscription_id=${subscription_id}`);
      fetchSubscriptions();
    } catch (err) {
      alert("Error deleting subscription");
    }
  };

  const statusColor = (status) => {
    if (status === "active") return "bg-emerald-100 text-emerald-700";
    if (status === "expired") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  if (loading) return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Subscriptions</h1>
      <p className="text-sm text-slate-500">
        Manage all SmartSecure Lockers user subscriptions.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit Subscription #${form.subscription_id}` : "Add New Subscription"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
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
            <label className="text-sm">Plan ID</label>
            <input
              className="w-full border rounded-xl p-2 mt-1"
              value={form.plan_id}
              onChange={(e) => setForm({ ...form, plan_id: e.target.value })}
              placeholder="Plan ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Status</label>
            <select
              className="w-full border rounded-xl p-2 mt-1"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Last Payment ID</label>
            <input
              className="w-full border rounded-xl p-2 mt-1"
              value={form.last_payment_id}
              onChange={(e) => setForm({ ...form, last_payment_id: e.target.value })}
              placeholder="Payment ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Start Date</label>
            <input
              type="date"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">End Date</label>
            <input
              type="date"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Auto Renew</label>
          <select
            className="w-full border rounded-xl p-2 mt-1"
            value={form.auto_renew}
            onChange={(e) => setForm({ ...form, auto_renew: Number(e.target.value) })}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            {isEditing ? "Update Subscription" : "Add Subscription"}
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

      {/* SUBSCRIPTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">End</th>
              <th className="px-4 py-2 text-left">Auto Renew</th>
              <th className="px-4 py-2 text-left">Last Payment</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.subscription_id} className="border-b">
                <td className="px-4 py-2">{s.subscription_id}</td>
                <td className="px-4 py-2">{s.user_id}</td>
                <td className="px-4 py-2">{s.plan_id}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${statusColor(s.status)}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2">{s.start_date?.slice(0, 10)}</td>
                <td className="px-4 py-2">{s.end_date?.slice(0, 10)}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${s.auto_renew ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {s.auto_renew ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2">{s.last_payment_id}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button className="text-indigo-600 text-xs" onClick={() => handleEdit(s)}>Edit</button>
                  <button className="text-rose-600 text-xs" onClick={() => handleDelete(s.subscription_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-slate-500">No subscriptions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubscriptionsAdmin;