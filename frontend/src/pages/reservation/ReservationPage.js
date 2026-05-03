import { useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const currentHour = new Date().getHours();

const formatDateTimeForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ReservationPage() {
  const { id: locker_id } = useParams();
  const navigate = useNavigate();

  const [reservationDate, setReservationDate] = useState(getTodayDateString());
  const [startHour, setStartHour] = useState("9");
  const [durationHours, setDurationHours] = useState("1");
  const [reservationSuccess, setReservationSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!reservationDate || !startHour || !durationHours) {
      alert("Please fill all fields");
      return;
    }

    const parsedStartHour = Number(startHour);
    const parsedDurationHours = Number(durationHours);
    if (
      Number.isNaN(parsedStartHour) ||
      parsedStartHour < 0 ||
      parsedStartHour > 23
    ) {
      alert("Start hour must be between 0 and 23");
      return;
    }

    if (
      Number.isNaN(parsedDurationHours) ||
      parsedDurationHours <= 0 ||
      !Number.isInteger(parsedDurationHours)
    ) {
      alert("Duration must be a positive whole number of hours");
      return;
    }

    const start = new Date(reservationDate);
    start.setHours(parsedStartHour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + parsedDurationHours);

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

    const sixMonthsLater = new Date(start);
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    if (end > sixMonthsLater) {
      alert("Reservation cannot exceed 6 months");
      return;
    }

    const storedUser = sessionStorage.getItem("user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      alert("Please login first");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      sessionStorage.removeItem("user");
      alert("Session invalid. Please login again.");
      return;
    }

    if (!user?.user_id) {
      sessionStorage.removeItem("user");
      alert("Session invalid. Please login again.");
      return;
    }

    const startTime = formatDateTimeForApi(start);
    const endTime = formatDateTimeForApi(end);

    try {
      const res = await api.post("/reservation", {
        user_id: user.user_id,
        locker_id,
        start_time: startTime,
        end_time: endTime,
        status: "active",
        total_amount: null,
        created_at: new Date().toISOString().split("T")[0],
      });

      if (res.data.Status === "OK") {
        sessionStorage.setItem(
          "reservation",
          JSON.stringify({
            reservation_id: res.data.reservation_id,
            locker_id,
            start_time: startTime,
            end_time: endTime,
            total_amount: res.data.total_amount ?? null,
          }),
        );

        alert("Reservation created successfully!");
        setReservationSuccess(true);
      } else {
        alert(res.data.Message || "Reservation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating reservation");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-6">
      <h1 className="text-3xl font-bold mb-6">Reserve Locker #{locker_id}</h1>

      <label className="block mb-2 font-medium">Reservation Date</label>
      <input
        type="date"
        className="w-full border rounded p-3 mb-4"
        value={reservationDate}
        onChange={(e) => setReservationDate(e.target.value)}
      />
      <label className="block mb-2 font-medium">Start Hour</label>
      <select
        className="w-full border rounded p-3 mb-4"
        value={startHour}
        onChange={(e) => setStartHour(e.target.value)}>
        {Array.from({ length: 24 }, (_, hour) =>
          hour > currentHour ? (
            <option key={hour} value={hour}>
              {String(hour).padStart(2, "0")}:00
            </option>
          ) : null,
        )}
      </select>
      <label className="block mb-2 font-medium">Duration (hours)</label>
      <input
        type="number"
        min="1"
        className="w-full border rounded p-3 mb-6"
        value={durationHours}
        onChange={(e) => setDurationHours(e.target.value)}
      />

      {!reservationSuccess && (
        <button
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          onClick={handleSubmit}>
          Confirm Reservation
        </button>
      )}

      {reservationSuccess && (
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4"
          onClick={() => navigate("/payment")}>
          Proceed to Payment
        </button>
      )}
    </div>
  );
}

export default ReservationPage;
