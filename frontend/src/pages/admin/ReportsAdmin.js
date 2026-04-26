import { useEffect, useState } from "react";
import api from "../../api/axios";

function ReportsAdmin() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    report_id: null,
    user_id: "",
    report_type: "",
    status: "",
    generation_mode: "",
    period_start: "",
    period_end: "",
    generated_at: "",
  });

  const fetchReports = async () => {
    try {
      const res = await api.get("/report");
      setReports(res.data);
    } catch (err) {
      alert("Error fetching reports");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resetForm = () => {
    setForm({ report_id: null, user_id: "", report_type: "", status: "", generation_mode: "", period_start: "", period_end: "", generated_at: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { report_id, ...body } = form;

    if (!body.user_id || !body.report_type || !body.status) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/report?report_id=${report_id}`, body);
        alert("Report updated!");
      } else {
        await api.post("/report", body);
        alert("Report added!");
      }
      resetForm();
      fetchReports();
    } catch (err) {
      alert("Error saving report");
    }
  };

  const handleEdit = (report) => {
    setForm({
      ...report,
      period_start: report.period_start?.slice(0, 10),
      period_end: report.period_end?.slice(0, 10),
      generated_at: report.generated_at?.slice(0, 16),
    });
    setIsEditing(true);
  };

  const handleDelete = async (report_id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await api.delete(`/report?report_id=${report_id}`);
      fetchReports();
    } catch (err) {
      alert("Error deleting report");
    }
  };

  const statusColor = (status) => {
    if (status === "completed") return "bg-emerald-100 text-emerald-700";
    if (status === "pending") return "bg-amber-100 text-amber-700";
    return "bg-rose-100 text-rose-700";
  };

  if (loading) return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Reports</h1>
      <p className="text-sm text-slate-500">
        Manage and generate SmartSecure Lockers reports.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit Report #${form.report_id}` : "Add New Report"}
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
          <label className="text-sm">Report Type</label>
          <select
            className="w-full border rounded-xl p-2 mt-1"
            value={form.report_type}
            onChange={(e) => setForm({ ...form, report_type: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="reservation">Reservation</option>
            <option value="payment">Payment</option>
            <option value="locker">Locker</option>
            <option value="subscription">Subscription</option>
          </select>
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Generation Mode</label>
            <select
              className="w-full border rounded-xl p-2 mt-1"
              value={form.generation_mode}
              onChange={(e) => setForm({ ...form, generation_mode: e.target.value })}
            >
              <option value="">Select mode</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Period Start</label>
            <input
              type="date"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.period_start}
              onChange={(e) => setForm({ ...form, period_start: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Period End</label>
            <input
              type="date"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.period_end}
              onChange={(e) => setForm({ ...form, period_end: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Generated At</label>
          <input
            type="datetime-local"
            className="w-full border rounded-xl p-2 mt-1"
            value={form.generated_at}
            onChange={(e) => setForm({ ...form, generated_at: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            {isEditing ? "Update Report" : "Add Report"}
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

      {/* REPORTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Mode</th>
              <th className="px-4 py-2 text-left">Period Start</th>
              <th className="px-4 py-2 text-left">Period End</th>
              <th className="px-4 py-2 text-left">Generated At</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.report_id} className="border-b">
                <td className="px-4 py-2">{r.report_id}</td>
                <td className="px-4 py-2">{r.user_id}</td>
                <td className="px-4 py-2 capitalize">{r.report_type}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${statusColor(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2 capitalize">{r.generation_mode}</td>
                <td className="px-4 py-2">{r.period_start?.slice(0, 10)}</td>
                <td className="px-4 py-2">{r.period_end?.slice(0, 10)}</td>
                <td className="px-4 py-2">{r.generated_at?.slice(0, 16).replace("T", " ")}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button className="text-indigo-600 text-xs" onClick={() => handleEdit(r)}>Edit</button>
                  <button className="text-rose-600 text-xs" onClick={() => handleDelete(r.report_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-slate-500">No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsAdmin;