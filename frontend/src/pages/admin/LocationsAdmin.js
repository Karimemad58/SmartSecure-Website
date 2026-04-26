import { useEffect, useState } from "react";
import api from "../../api/axios";

function LocationsAdmin() {
  const [locations, setLocations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", city: "", category: "", num_lockers: "" });

  const fetchLocations = async () => {
    try {
      const res = await api.get("/location");
      setLocations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const deleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      await api.delete(`/location?location_id=${id}`);
      fetchLocations();
    } catch (err) {
      alert("Error deleting location");
    }
  };

  const openEdit = (loc) => {
    setEditing(loc.location_id);
    setForm({
      name: loc.name,
      address: loc.address,
      city: loc.city,
      category: loc.category,
      num_lockers: loc.num_lockers,
    });
  };

  const saveLocation = async () => {
    try {
      await api.put(`/location?location_id=${editing}`, form);
      setEditing(null);
      fetchLocations();
    } catch (err) {
      alert("Error updating location");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Locations</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Address</th>
              <th className="text-left px-4 py-2">City</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Lockers</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((loc) => (
              <tr key={loc.location_id} className="border-b border-slate-100">
                <td className="px-4 py-2">{loc.location_id}</td>
                <td className="px-4 py-2">{loc.name}</td>
                <td className="px-4 py-2">{loc.address}</td>
                <td className="px-4 py-2">{loc.city}</td>
                <td className="px-4 py-2">{loc.category}</td>
                <td className="px-4 py-2">{loc.num_lockers}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    className="text-xs text-indigo-600"
                    onClick={() => openEdit(loc)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-rose-600"
                    onClick={() => deleteLocation(loc.location_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {locations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-slate-500">
                  No locations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-lg font-semibold">Edit Location #{editing}</h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Number of Lockers"
              value={form.num_lockers}
              onChange={(e) => setForm({ ...form, num_lockers: e.target.value })}
            />

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-slate-200"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-600 text-white"
                onClick={saveLocation}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationsAdmin;