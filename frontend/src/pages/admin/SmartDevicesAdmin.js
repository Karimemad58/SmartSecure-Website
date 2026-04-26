import { useEffect, useState } from "react";
import api from "../../api/axios";

function SmartDevicesAdmin() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    device_id: null,
    serial_number: "",
    firmware_version: "",
    status: "",
    location_id: "",
  });

  const fetchDevices = async () => {
    try {
      const res = await api.get("/smart_device");
      setDevices(res.data);
    } catch (err) {
      alert("Error fetching devices");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const resetForm = () => {
    setForm({ device_id: null, serial_number: "", firmware_version: "", status: "", location_id: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { device_id, ...body } = form;

    if (!body.serial_number || !body.status || !body.location_id) {
      return alert("Please fill all required fields");
    }

    try {
      if (isEditing) {
        await api.put(`/smart_device?device_id=${device_id}`, body);
        alert("Device updated!");
      } else {
        await api.post("/smart_device", body);
        alert("Device added!");
      }
      resetForm();
      fetchDevices();
    } catch (err) {
      alert("Error saving device");
    }
  };

  const handleEdit = (device) => {
    setForm(device);
    setIsEditing(true);
  };

  const handleDelete = async (device_id) => {
    if (!window.confirm("Delete this device?")) return;
    try {
      await api.delete(`/smart_device?device_id=${device_id}`);
      fetchDevices();
    } catch (err) {
      alert("Error deleting device");
    }
  };

  const statusColor = (status) => {
    if (status === "online") return "bg-emerald-100 text-emerald-700";
    if (status === "offline") return "bg-rose-100 text-rose-700";
    return "bg-amber-100 text-amber-700";
  };

  if (loading) return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Smart Devices</h1>
      <p className="text-sm text-slate-500">
        Manage all SmartSecure locker devices and their firmware.
      </p>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-4 border shadow-sm space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? `Edit Device #${form.device_id}` : "Add New Device"}
        </h2>

        <div>
          <label className="text-sm">Serial Number</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={form.serial_number}
            onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
            placeholder="e.g. SN-00123"
          />
        </div>

        <div>
          <label className="text-sm">Firmware Version</label>
          <input
            className="w-full border rounded-xl p-2 mt-1"
            value={form.firmware_version}
            onChange={(e) => setForm({ ...form, firmware_version: e.target.value })}
            placeholder="e.g. v2.1.4"
          />
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
              <option value="online">Online</option>
              <option value="offline">Offline</option>
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
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
          >
            {isEditing ? "Update Device" : "Add Device"}
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

      {/* DEVICES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Serial Number</th>
              <th className="px-4 py-2 text-left">Firmware</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.device_id} className="border-b">
                <td className="px-4 py-2">{d.device_id}</td>
                <td className="px-4 py-2">{d.serial_number}</td>
                <td className="px-4 py-2">{d.firmware_version}</td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${statusColor(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-2">{d.location_id}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button className="text-indigo-600 text-xs" onClick={() => handleEdit(d)}>Edit</button>
                  <button className="text-rose-600 text-xs" onClick={() => handleDelete(d.device_id)}>Delete</button>
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-slate-500">No devices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SmartDevicesAdmin;