import { useEffect, useState } from "react";
import api from "../../api/axios";

function PlansAdmin() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    plan_id: null,
    name: "",
    description: "",
    price: "",
    duration_days: "",
    discount_rate: "",
    locker_access: "",
    is_active: 1,
  });

  const fetchPlans = async () => {
    try {
      const res = await api.get("/subscription_plan");
      setPlans(res.data);
    } catch (err) {
      alert("Error fetching plans");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const resetForm = () => {
    setForm({ plan_id: null, name: "", description: "", price: "", duration_days: "", discount_rate: "", locker_access: "", is_active: 1 });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { plan_id, ...body } = form;

    if (!body.name || !body.price || !body.duration_days) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/subscription_plan?plan_id=${plan_id}`, body);
        alert("Plan updated!");
      } else {
        await api.post("/subscription_plan", body);
        alert("Plan added!");
      }
      resetForm();
      fetchPlans();
    } catch (err) {
      alert("Error saving plan");
    }
  };

  const handleEdit = (plan) => {
    setForm(plan);
    setIsEditing(true);
  };

  const handleDelete = async (plan_id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await api.delete(`/subscription_plan?plan_id=${plan_id}`);
      fetchPlans();
    } catch (err) {
      alert("Error deleting plan");
    }
  };

  if (loading) return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Subscription Plans</h1>
      <p className="text-sm text-slate-500">
        Manage SmartSecure Lockers subscription plans and pricing.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit Plan #${form.plan_id}` : "Add New Plan"}
        </h2>

        <div>
          <label className="text-sm">Name</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Basic, Premium"
          />
        </div>

        <div>
          <label className="text-sm">Description</label>
          <textarea
            className="w-full border rounded-xl p-2 mt-1"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Plan description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Price (EGP)</label>
            <input
              type="number"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm">Duration (Days)</label>
            <input
              type="number"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.duration_days}
              onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
              placeholder="30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Discount Rate (%)</label>
            <input
              type="number"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.discount_rate}
              onChange={(e) => setForm({ ...form, discount_rate: e.target.value })}
              placeholder="0"
            />
          </div>

          <div>
            <label className="text-sm">Locker Access</label>
            <input
              type="number"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.locker_access}
              onChange={(e) => setForm({ ...form, locker_access: e.target.value })}
              placeholder="Number of lockers"
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Is Active</label>
          <select
            className="w-full border rounded-xl p-2 mt-1"
            value={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
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
            {isEditing ? "Update Plan" : "Add Plan"}
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

      {/* PLANS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Discount</th>
              <th className="px-4 py-2 text-left">Locker Access</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.plan_id} className="border-b">
                <td className="px-4 py-2">{p.plan_id}</td>
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2">{p.price} EGP</td>
                <td className="px-4 py-2">{p.duration_days} days</td>
                <td className="px-4 py-2">{p.discount_rate}%</td>
                <td className="px-4 py-2">{p.locker_access}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button className="text-indigo-600 text-xs" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="text-rose-600 text-xs" onClick={() => handleDelete(p.plan_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-slate-500">No plans found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlansAdmin;