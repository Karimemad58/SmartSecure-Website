import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const navItemClass =
  "text-sm font-medium text-slate-500 hover:text-indigo-600 transition";

function Navbar() {
  const isLoggedIn = Boolean(sessionStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="font-semibold text-slate-800">
            SmartSecure<span className="text-indigo-600">Lockers</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/locations" className={navItemClass}>
            Locations
          </NavLink>
          <NavLink to="/lockers" className={navItemClass}>
            Lockers
          </NavLink>
          <NavLink to="/subscriptions/plans" className={navItemClass}>
            Plans
          </NavLink>
          <NavLink to="/reservations/my" className={navItemClass}>
            My Reservations
          </NavLink>
          <NavLink to="/subscriptions/my" className={navItemClass}>
            My Subscriptions
          </NavLink>
          <NavLink to="/about" className={navItemClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navItemClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Account / Auth - always visible */}
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="text-slate-600 hover:text-indigo-600">
              <FaUserCircle size={24} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                Log in
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
                Sign up
              </Link>
            </>
          )}

          {/* Hamburger - mobile only */}
          <button
            className="md:hidden text-slate-600 hover:text-indigo-600"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 flex flex-col gap-4">
          <NavLink
            to="/locations"
            className={navItemClass}
            onClick={() => setMenuOpen(false)}>
            Locations
          </NavLink>
          <NavLink
            to="/lockers"
            className={navItemClass}
            onClick={() => setMenuOpen(false)}>
            Lockers
          </NavLink>
          <NavLink
            to="/subscriptions/plans"
            className={navItemClass}
            onClick={() => setMenuOpen(false)}>
            Plans
          </NavLink>
          <NavLink
            to="/reservations/my"
            className={navItemClass}
            onClick={() => setMenuOpen(false)}>
            My Reservations
          </NavLink>
          <NavLink
            to="/subscriptions/my"
            className={navItemClass}
            onClick={() => setMenuOpen(false)}>
            My Subscriptions
          </NavLink>
          <NavLink
            to="/about"
            className={navItemClass}
            onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={navItemClass}
            onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
          {!isLoggedIn && (
            <Link
              to="/register"
              className="text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-center"
              onClick={() => setMenuOpen(false)}>
              Sign up
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
