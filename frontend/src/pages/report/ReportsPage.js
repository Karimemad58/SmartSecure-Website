import { useEffect, useState } from "react";
import axios from "axios";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [reportType, setReportType] = useState("reservations");
  const [generationMode, setGenerationMode] = useState("manual");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) return;
    fetchReports();
  }, []);

  const fetchReports = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8080/Modules/report/search?keyword=user_id&keyvalue=${user.user_id}&sort=DESC`
      )
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setReports(data || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load reports");
      })
      .finally(() => setLoading(false));
  };

  const handleGenerate = async () => {
    if (!periodStart || !periodEnd) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(periodEnd) < new Date(periodStart)) {
      alert("End date cannot be before start date");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post("http://localhost:8080/Modules/report", {
        user_id: user.user_id,
        report_type: reportType,
        status: "generated",
        generation_mode: generationMode,
        period_start: periodStart,
        period_end: periodEnd,
        generated_at: new Date().toISOString().split("T")[0],
      });

      if (res.data.Status === "OK") {
        alert("Report generated successfully!");
        setPeriodStart("");
        setPeriodEnd("");
        fetchReports();
      } else {
        alert(res.data.Message || "Failed to generate report");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (report_id) => {
    if (!window.confirm("Delete this report?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:8080/Modules/report?report_id=${report_id}`
      );
      if (res.data.Status === "OK") {
        setReports((prev) => prev.filter((r) => r.report_id !== report_id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  const typeStyles = {
    reservations: "bg-indigo-100 text-indigo-700",
    payments:     "bg-green-100 text-green-700",
    lockers:      "bg-yellow-100 text-yellow-700",
    users:        "bg-blue-100 text-blue-700",
  };

  const statusStyles = {
    generated: "bg-green-100 text-green-700",
    pending:   "bg-yellow-100 text-yellow-700",
    failed:    "bg-red-100 text-red-700",
  };

  if (!user)
    return (
      <p className="mt-10 text-center text-slate-500">
        Please log in to view reports.
      </p>
    );

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-900 mb-8">Reports</h1>

      {/* GENERATE REPORT FORM */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Generate New Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Report Type</label>
            <select
              className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="reservations">Reservations</option>
              <option value="payments">Payments</option>
              <option value="lockers">Lockers</option>
              <option value="users">Users</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">Generation Mode</label>
            <select
              className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={generationMode}
              onChange={(e) => setGenerationMode(e.target.value)}
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">Period Start</label>
            <input
              type="date"
              className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Period End</label>
            <input
              type="date"
              className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 text-sm"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={submitting}
          className="mt-5 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* REPORTS LIST */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Previous Reports
      </h2>

      {loading ? (
        <p className="text-center text-slate-500">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-slate-500">No reports found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <div
              key={r.report_id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex justify-between items-start gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                      typeStyles[r.report_type] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.report_type}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                      statusStyles[r.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {r.generation_mode}
                  </span>
                </div>

                <p className="text-sm text-slate-600">
                  Period:{" "}
                  <span className="font-semibold">
                    {r.period_start} → {r.period_end}
                  </span>
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Generated at:{" "}
                  {r.generated_at
                    ? new Date(r.generated_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(r.report_id)}
                className="text-xs text-red-500 font-semibold hover:underline whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportsPage;