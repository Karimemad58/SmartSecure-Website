import { useEffect, useState } from "react";
import api from "../../api/axios";

function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    reservation_id: null,
    user_id: "",
    locker_id: "",
    start_time: "",
    end_time: "",
    status: "",
    total_amount: "",
    created_at: "",
  });

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservation");
      setReservations(res.data);
    } catch (err) {
      alert("Error fetching reservations");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const resetForm = () => {
    setForm({ reservation_id: null, user_id: "", locker_id: "", start_time: "", end_time: "", status: "", total_amount: "", created_at: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { reservation_id, ...body } = form;

    if (!body.user_id || !body.locker_id || !body.status) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/reservation?reservation_id=${reservation_id}`, body);
        alert("Reservation updated!");
      } else {
        await api.post("/reservation", body);
        alert("Reservation added!");
      }
      resetForm();
      fetchReservations();
    } catch (err) {
      alert("Error saving reservation");
    }
  };

  const handleEdit = (r) => {
    setForm({
      ...r,
      start_time: r.start_time?.slice(0, 16),
      end_time: r.end_time?.slice(0, 16),
      created_at: r.created_at?.slice(0, 16),
    });
    setIsEditing(true);
  };

  const handleDelete = async (reservation_id) => {
    if (!window.confirm("Delete this reservation?")) return;
    try {
      await api.delete(`/reservation?reservation_id=${reservation_id}`);
      fetchReservations();
    } catch (err) {
      alert("Error deleting reservation");
    }
  };

  const statusColor = (status) => {
    if (status === "active") return "bg-emerald-100 text-emerald-700";
    if (status === "pending") return "bg-amber-100 text-amber-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-rose-100 text-rose-700";
  };

  if (loading) return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Reservations</h1>
      <p className="text-sm text-slate-500">
        Manage all locker reservations.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit Reservation #${form.reservation_id}` : "Add New Reservation"}
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
            <label className="text-sm">Locker ID</label>
            <input
              className="w-full border rounded-xl p-2 mt-1"
              value={form.locker_id}
              onChange={(e) => setForm({ ...form, locker_id: e.target.value })}
              placeholder="Locker ID"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Start Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">End Time</label>
            <input
              type="datetime-local"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
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
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Total Amount (EGP)</label>
            <input
              type="number"
              className="w-full border rounded-xl p-2 mt-1"
              value={form.total_amount}
              onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="text-sm">Created At</label>
          <input
            type="datetime-local"
            className="w-full border rounded-xl p-2 mt-1"
            value={form.created_at}
            onChange={(e) => setForm({ ...form, created_at: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            {isEditing ? "Update Reservation" : "Add Reservation"}
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

      {/* RESERVATIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Locker</th>
              <th className="px-4 py-2 text-left">Start</th>
              <th className="px-4 py-2 text-left">End</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.reservation_id} className="border-b">
                <td className="px-4 py-2">{r.reservation_id}</td>
                <td className="px-4 py-2">{r.user_id}</td>
                <td className="px-4 py-2">{r.locker_id}</td>
                <td className="px-4 py-2">{r.start_time?.slice(0, 16).replace("T", " ")}</td>
                <td className="px-4 py-2">{r.end_time?.slice(0, 16).replace("T", " ")}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${statusColor(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2">{r.total_amount} EGP</td>
                <td className="px-4 py-2">{r.created_at?.slice(0, 10)}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button className="text-indigo-600 text-xs" onClick={() => handleEdit(r)}>Edit</button>
                  <button className="text-rose-600 text-xs" onClick={() => handleDelete(r.reservation_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-slate-500">No reservations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReservationsAdmin;