import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-slate-800">
            SmartSecure Lockers Admin
          </h1>
          <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500">admin@smartsecurelockers.com</span>
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;