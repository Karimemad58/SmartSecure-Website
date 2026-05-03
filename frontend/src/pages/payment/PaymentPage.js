import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [method, setMethod] = useState("Debit_Card");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("reservation");
    if (stored) {
      setReservation(JSON.parse(stored));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchReservationAmount = async () => {
      try {
        const res = await api.get(
          `/reservation?reservation_id=${reservation.reservation_id}`
        );
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        const reservationRow = data && data.length > 0 ? data[0] : null;

        if (!reservationRow) {
          alert("Reservation not found");
          setAmount("");
          setLoading(false);
          return;
        }

        setAmount(reservationRow.total_amount ?? "");

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching total amount");
        setLoading(false);
      }
    };

    if (reservation) fetchReservationAmount();
  }, [reservation]);

  const handlePayment = async () => {
    if (!reservation) {
      alert("No reservation data found");
      return;
    }

    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        alert("Invalid payment amount");
        return;
      }

      const res = await api.post("/payment", {
        user_id: user.user_id,
        reservation_id: reservation.reservation_id,
        amount: numericAmount,
        method,
        status: "completed",
        transaction_date: reservation.start_time,
      });

      if (res.data.Status === "OK") {
        alert("Payment successful!");
        sessionStorage.removeItem("reservation");
        navigate("/reservations/my");
      } else {
        alert(res.data.Message || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing payment");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-lg font-semibold">
        Loading payment details...
      </p>
    );
  }

  if (!reservation) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-red-600">
        No reservation data found.<br />
        Please make a reservation first.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <div className="mb-5">
        <label className="font-semibold">Total Amount</label>
        <input
          type="text"
          className="w-full mt-2 p-3 border rounded-xl bg-gray-100"
          value={amount}
          disabled
        />
      </div>

      <div className="mb-5">
        <label className="font-semibold">Transaction Date</label>
        <input
          type="text"
          className="w-full mt-2 p-3 border rounded-xl bg-gray-100"
          value={reservation.start_time}
          disabled
        />
      </div>

      <div className="mb-5">
        <label className="font-semibold">Payment Method</label>
        <select
          className="w-full mt-2 p-3 border rounded-xl"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="Debit_Card">Visa</option>
          <option value="MasterCard">MasterCard</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 mt-4 rounded-xl font-semibold"
      >
        Confirm Payment
      </button>
    </div>
  );
}

export default PaymentPage;