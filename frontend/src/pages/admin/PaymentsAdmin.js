import { useEffect, useState } from "react";
import api from "../../api/axios";

function PaymentsAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPayment, setEditingPayment] = useState(null);
  const [form, setForm] = useState({
    user_id: "",
    reservation_id: "",
    amount: "",
    method: "",
    status: "",
    transaction_date: "",
  });

  const loadPayments = async () => {
    try {
      const res = await api.get("/payment");
      setPayments(res.data);
    } catch (err) {
      alert("Error loading payments");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const deletePayment = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await api.delete(`/payment?payment_id=${id}`);
      loadPayments();
    } catch (err) {
      alert("Error deleting payment");
    }
  };

  const startEdit = (payment) => {
    setEditingPayment(payment);
    setForm({
      user_id: payment.user_id,
      reservation_id: payment.reservation_id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transaction_date: payment.transaction_date?.slice(0, 10),
    });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/payment?payment_id=${editingPayment.payment_id}`, form);
      setEditingPayment(null);
      loadPayments();
    } catch (err) {
      alert("Error updating payment");
    }
  };

  const statusColor = (status) => {
    if (status === "paid") return "bg-emerald-100 text-emerald-700";
    if (status === "pending") return "bg-amber-100 text-amber-700";
    return "bg-rose-100 text-rose-700";
  };

  if (loading) return <p className="text-center text-slate-500 mt-10">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Payments</h1>
      <p className="text-sm text-slate-500">
        Track all transactions and payment history.
      </p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Reservation</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.payment_id} className="border-b">
                  <td className="px-4 py-2">{p.payment_id}</td>
                  <td className="px-4 py-2">{p.user_id}</td>
                  <td className="px-4 py-2">{p.reservation_id}</td>
                  <td className="px-4 py-2">{p.amount} EGP</td>
                  <td className="px-4 py-2 capitalize">{p.method}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${statusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{p.transaction_date?.slice(0, 10)}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button className="text-xs text-indigo-600" onClick={() => startEdit(p)}>Edit</button>
                    <button className="text-xs text-rose-600" onClick={() => deletePayment(p.payment_id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center text-slate-500 py-4">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingPayment && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-3">
            <h2 className="text-lg font-semibold">Edit Payment #{editingPayment.payment_id}</h2>

            <div>
              <label className="text-sm font-medium">User ID</label>
              <input
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Reservation ID</label>
              <input
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.reservation_id}
                onChange={(e) => setForm({ ...form, reservation_id: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Amount (EGP)</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Method</label>
              <select
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
              >
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="visa">Visa</option>
                <option value="mastercard">MasterCard</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="">Select status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Transaction Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.transaction_date}
                onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setEditingPayment(null)} className="px-4 py-2 rounded bg-slate-200">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 rounded bg-indigo-600 text-white">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsAdmin;