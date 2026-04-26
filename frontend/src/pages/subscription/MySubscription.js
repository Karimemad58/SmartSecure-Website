import { useState, useEffect } from "react";
import api from "../../api/axios";

function MySubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editSubscription, setEditSubscription] = useState(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newAutoRenew, setNewAutoRenew] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user) {
          alert("Please login first");
          return;
        }

        const res = await api.get(
          `/subscription/search?keyword=user_id&keyvalue=${user.user_id}&sort=DESC`
        );
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setSubscriptions(data || []);
      } catch (error) {
        console.error(error);
        alert("Error loading subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveUpdate = async () => {
    if (!editSubscription) return;

    try {
      const res = await api.put(
        `/subscription?subscription_id=${editSubscription.subscription_id}`,
        {
          user_id: editSubscription.user_id,
          plan_id: editSubscription.plan_id,
          start_date: newStart,
          end_date: newEnd,
          status: newStatus,
          auto_renew: newAutoRenew ? 1 : 0,
          last_payment_id: editSubscription.last_payment_id,
        }
      );

      if (res.data.Status === "OK") {
        alert("Subscription updated!");
        setSubscriptions((prev) =>
          prev.map((s) =>
            s.subscription_id === editSubscription.subscription_id
              ? { ...s, start_date: newStart, end_date: newEnd, status: newStatus, auto_renew: newAutoRenew ? 1 : 0 }
              : s
          )
        );
        setEditSubscription(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update subscription");
    }
  };

  const handleDelete = async (subscription_id) => {
    if (!window.confirm("Cancel this subscription?")) return;

    try {
      const res = await api.delete(
        `/subscription?subscription_id=${subscription_id}`
      );
      if (res.data.Status === "OK") {
        setSubscriptions((prev) =>
          prev.filter((s) => s.subscription_id !== subscription_id)
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to cancel subscription");
    }
  };

  const statusStyles = {
    active:    "bg-green-50 text-green-700",
    inactive:  "bg-slate-100 text-slate-600",
    expired:   "bg-red-50 text-red-700",
    cancelled: "bg-yellow-50 text-yellow-700",
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">My Subscriptions</h1>
      <p className="text-sm text-slate-500">Manage your active and past plans.</p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Plan ID</th>
              <th className="text-left px-4 py-2">Start</th>
              <th className="text-left px-4 py-2">End</th>
              <th className="text-left px-4 py-2">Auto Renew</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.subscription_id} className="border-b border-slate-100">
                <td className="px-4 py-2">{s.subscription_id}</td>
                <td className="px-4 py-2">{s.plan_id}</td>
                <td className="px-4 py-2">{s.start_date}</td>
                <td className="px-4 py-2">{s.end_date}</td>
                <td className="px-4 py-2">
                  {s.auto_renew ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[s.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditSubscription(s);
                      setNewStart(s.start_date);
                      setNewEnd(s.end_date);
                      setNewStatus(s.status);
                      setNewAutoRenew(s.auto_renew === 1);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.subscription_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}

            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-slate-500">
                  No subscriptions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT POPUP */}
      {editSubscription && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-[350px] space-y-4">
            <h2 className="text-lg font-semibold">
              Edit Subscription #{editSubscription.subscription_id}
            </h2>

            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded-xl"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded-xl"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                className="w-full border p-2 rounded-xl"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="editAutoRenew"
                checked={newAutoRenew}
                onChange={(e) => setNewAutoRenew(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="editAutoRenew" className="text-sm font-medium">
                Auto Renew
              </label>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditSubscription(null)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySubscription;