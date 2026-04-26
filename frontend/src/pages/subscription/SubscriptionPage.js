import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function SubscriptionPage() {
  const navigate = useNavigate();

  const [planId, setPlanId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [autoRenew, setAutoRenew] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!planId || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      alert("Start date cannot be before today");
      return;
    }

    if (end < start) {
      alert("End date cannot be before start date");
      return;
    }

    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      alert("Please login first");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const res = await api.post("/subscription", {
        user_id: user.user_id,
        plan_id: planId,
        status: "active",
        start_date: startDate,
        end_date: endDate,
        auto_renew: autoRenew ? 1 : 0,
        last_payment_id: null,
      });

      if (res.data.Status === "OK") {
        alert("Subscription created successfully!");
        setSubscriptionSuccess(true);
      } else {
        alert(res.data.Message || "Subscription failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating subscription");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-6">
      <h1 className="text-3xl font-bold mb-6">Subscribe to a Plan</h1>

      <label className="block mb-2 font-medium">Plan ID</label>
      <input
        type="number"
        className="w-full border rounded p-3 mb-4"
        placeholder="Enter plan ID"
        value={planId}
        onChange={(e) => setPlanId(e.target.value)}
      />

      <label className="block mb-2 font-medium">Start Date</label>
      <input
        type="date"
        className="w-full border rounded p-3 mb-4"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label className="block mb-2 font-medium">End Date</label>
      <input
        type="date"
        className="w-full border rounded p-3 mb-4"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="autoRenew"
          checked={autoRenew}
          onChange={(e) => setAutoRenew(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="autoRenew" className="text-sm font-medium">
          Auto Renew
        </label>
      </div>

      {!subscriptionSuccess && (
        <button
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          onClick={handleSubmit}
        >
          Confirm Subscription
        </button>
      )}

      {subscriptionSuccess && (
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4"
          onClick={() => navigate("/my-subscriptions")}
        >
          View My Subscriptions
        </button>
      )}
    </div>
  );
}

export default SubscriptionPage;