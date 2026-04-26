import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editReservation, setEditReservation] = useState(null);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const res = await api.get(
          `/reservation/search?keyword=user_id&keyvalue=${user.user_id}&sort=DESC`
        );
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setReservations(data || []);
      } catch (error) {
        console.error(error);
        alert("Error loading reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveUpdate = async () => {
    if (!editReservation) return;

    try {
      const res = await api.put(
        `/reservation?reservation_id=${editReservation.reservation_id}`,
        {
          user_id: editReservation.user_id,
          locker_id: editReservation.locker_id,
          start_time: newStart,
          end_time: newEnd,
          status: newStatus,
          total_amount: editReservation.total_amount,
          created_at: editReservation.created_at,
        }
      );

      if (res.data.Status === "OK") {
        alert("Reservation updated!");
        setReservations((prev) =>
          prev.map((r) =>
            r.reservation_id === editReservation.reservation_id
              ? { ...r, start_time: newStart, end_time: newEnd, status: newStatus }
              : r
          )
        );
        setEditReservation(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update reservation");
    }
  };

  const handleDelete = async (reservation_id) => {
    if (!window.confirm("Cancel this reservation?")) return;

    try {
      const res = await api.delete(
        `/reservation?reservation_id=${reservation_id}`
      );
      if (res.data.Status === "OK") {
        setReservations((prev) =>
          prev.filter((r) => r.reservation_id !== reservation_id)
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete reservation");
    }
  };
  function formatDateTime(isoString) {
    return new Date(isoString).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Usage in JSX
  
  const statusStyles = {
    active:    "bg-green-50 text-green-700",
    pending:   "bg-yellow-50 text-yellow-700",
    completed: "bg-blue-50 text-blue-700",
    cancelled: "bg-red-50 text-red-700",
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">My Reservations</h1>
      <p className="text-sm text-slate-500">All your current and past locker reservations.</p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Locker ID</th>
              <th className="text-left px-4 py-2">Start</th>
              <th className="text-left px-4 py-2">End</th>
              <th className="text-left px-4 py-2">Total</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r) => (
              <tr key={r.reservation_id} className="border-b border-slate-100">
                <td className="px-4 py-2">{r.reservation_id}</td>
                <td className="px-4 py-2">{r.locker_id}</td>
                <td className="px-4 py-2">{formatDateTime(r.start_time)}</td>
                <td className="px-4 py-2">{formatDateTime(r.end_time)}</td>
                <td className="px-4 py-2">{r.total_amount ?? "—"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[r.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditReservation(r);
                      setNewStart(r.start_time);
                      setNewEnd(r.end_time);
                      setNewStatus(r.status);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.reservation_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}

            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-slate-500">
                  No reservations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT POPUP */}
      {editReservation && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-[350px] space-y-4">
            <h2 className="text-lg font-semibold">
              Edit Reservation #{editReservation.reservation_id}
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
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditReservation(null)}
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

export default MyReservations;