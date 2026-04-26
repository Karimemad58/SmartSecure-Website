// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} SmartSecure Lockers. All rights reserved.
        </p>

        <div className="flex gap-4 text-sm text-slate-500">
          <Link to="/locations" className="hover:text-slate-800">
            Locations
          </Link>
          <Link to="/lockers" className="hover:text-slate-800">
            Lockers
          </Link>
          <Link to="/subscriptions/plans" className="hover:text-slate-800">
            Plans
          </Link>
          <Link to="/contact" className="hover:text-slate-800">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}