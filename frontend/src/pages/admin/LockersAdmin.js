import { useEffect, useState } from "react";
import api from "../../api/axios";

function LockersAdmin() {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    locker_id: null,
    locker_code: "",
    status: "",
    location_id: "",
    smart_device_id: "",
    installation_date: "",
    last_maintenance: "",
  });

  const fetchLockers = async () => {
    try {
      const res = await api.get("/locker");
      setLockers(res.data);
    } catch (err) {
      console.log(err);
      alert("Error fetching lockers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { locker_id, ...body } = form;

    if (!body.locker_code || !body.status || !body.location_id) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/locker?locker_id=${locker_id}`, body);
        alert("Locker updated!");
      } else {
        await api.post("/locker", body);
        alert("Locker added!");
      }
      setForm({ locker_id: null, locker_code: "", status: "", location_id: "", smart_device_id: "", installation_date: "", last_maintenance: "" });
      setIsEditing(false);
      fetchLockers();
    } catch (err) {
      alert("Error saving locker");
    }
  };

  const handleEdit = (locker) => {
    setForm(locker);
    setIsEditing(true);
  };

  const handleDelete = async (locker_id) => {
    if (!window.confirm("Delete this locker?")) return;
    try {
      await api.delete(`/locker?locker_id=${locker_id}`);
      fetchLockers();
    } catch (err) {
      alert("Error deleting locker");
    }
  };

  const statusColor = (status) => {
    if (status === "available") return "bg-emerald-100 text-emerald-700";
    if (status === "occupied") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  if (loading) return <p>Loading lockers...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Lockers</h1>
      <p className="text-sm text-slate-500">
        Manage all SmartSecure lockers, their status and maintenance.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit Locker #${form.locker_id}` : "Add New Locker"}
        </h2>

        <div>
          <label className="text-sm">Locker Code</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={form.locker_code}
            onChange={(e) => setForm({ ...form, locker_code: e.target.value })}
            placeholder="e.g. LK-001"
          />
        </div>

        <div>
          <label className="text-sm">Status</label>
          <select
            className="w-full border rounded-xl p-2 mt-1"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="">Select status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Location ID</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={form.location_id}
            onChange={(e) => setForm({ ...form, location_id: e.target.value })}
            placeholder="Location ID"
          />
        </div>

        <div>
          <label className="text-sm">Smart Device ID</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={form.smart_device_id}
            onChange={(e) => setForm({ ...form, smart_device_id: e.target.value })}
            placeholder="Smart Device ID"
          />
        </div>

        <div>
          <label className="text-sm">Installation Date</label>
          <input
            type="date"
            className="w-full border rounded-xl p-2 mt-1"
            value={form.installation_date}
            onChange={(e) => setForm({ ...form, installation_date: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm">Last Maintenance</label>
          <input
            type="date"
            className="w-full border rounded-xl p-2 mt-1"
            value={form.last_maintenance}
            onChange={(e) => setForm({ ...form, last_maintenance: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            {isEditing ? "Update Locker" : "Add Locker"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="px-4 py-2 bg-slate-200 rounded-xl text-sm"
              onClick={() => { setIsEditing(false); setForm({ locker_id: null, locker_code: "", status: "", location_id: "", smart_device_id: "", installation_date: "", last_maintenance: "" }); }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LOCKERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Device</th>
              <th className="px-4 py-2 text-left">Installed</th>
              <th className="px-4 py-2 text-left">Last Maintenance</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lockers.map((l) => (
              <tr key={l.locker_id} className="border-b">
                <td className="px-4 py-2">{l.locker_id}</td>
                <td className="px-4 py-2">{l.locker_code}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${statusColor(l.status)}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-2">{l.location_id}</td>
                <td className="px-4 py-2">{l.smart_device_id}</td>
                <td className="px-4 py-2">{l.installation_date?.slice(0, 10)}</td>
                <td className="px-4 py-2">{l.last_maintenance?.slice(0, 10)}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button className="text-indigo-600 text-xs" onClick={() => handleEdit(l)}>Edit</button>
                  <button className="text-rose-600 text-xs" onClick={() => handleDelete(l.locker_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {lockers.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-slate-500">No lockers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LockersAdmin;