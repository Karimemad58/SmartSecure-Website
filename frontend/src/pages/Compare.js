export default function Compare() {
  const features = [
    { label: "Smart Access",         starter: "✓", standard: "✓", business: "✓" },
    { label: "24/7 Availability",    starter: "✗", standard: "✓", business: "✓" },
    { label: "Real-time Monitoring", starter: "✗", standard: "✓", business: "✓" },
    { label: "Auto Renew",           starter: "✗", standard: "✓", business: "✓" },
    { label: "Locker Access",        starter: "1 locker", standard: "3 lockers", business: "Unlimited" },
    { label: "Discount Rate",        starter: "0%", standard: "10%", business: "20%" },
    { label: "Duration",             starter: "30 days", standard: "90 days", business: "365 days" },
    { label: "Support",              starter: "Email only", standard: "Priority email", business: "Dedicated manager" },
    { label: "Notifications",        starter: "✗", standard: "✓", business: "✓" },
    { label: "Reports & Analytics",  starter: "✗", standard: "✗", business: "✓" },
    { label: "Business Invoicing",   starter: "✗", standard: "✗", business: "✓" },
  ];

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Compare Plans
        </h1>
        <p className="text-slate-600 mb-12">
          See what's included in each SmartSecureLockers plan and pick the one
          that fits your needs.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-slate-500 font-medium w-1/3">
                  Feature
                </th>
                <th className="text-center px-6 py-4 text-slate-700 font-semibold">
                  Starter
                </th>
                <th className="text-center px-6 py-4 text-indigo-700 font-semibold">
                  Standard
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-50 rounded-full">
                    Popular
                  </span>
                </th>
                <th className="text-center px-6 py-4 text-slate-700 font-semibold">
                  Business
                </th>
              </tr>
            </thead>

            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f.label}
                  className={`border-b border-slate-100 ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-6 py-3 text-slate-600 font-medium">
                    {f.label}
                  </td>
                  <td className={`px-6 py-3 text-center ${f.starter === "✓" ? "text-green-500 font-bold" : f.starter === "✗" ? "text-slate-300 font-bold" : "text-slate-600"}`}>
                    {f.starter}
                  </td>
                  <td className={`px-6 py-3 text-center ${f.standard === "✓" ? "text-green-500 font-bold" : f.standard === "✗" ? "text-slate-300 font-bold" : "text-indigo-600 font-semibold"}`}>
                    {f.standard}
                  </td>
                  <td className={`px-6 py-3 text-center ${f.business === "✓" ? "text-green-500 font-bold" : f.business === "✗" ? "text-slate-300 font-bold" : "text-slate-600"}`}>
                    {f.business}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}