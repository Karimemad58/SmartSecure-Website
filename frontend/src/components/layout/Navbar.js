import { Link, NavLink } from "react-router-dom";

const navItemClass =
  "text-sm font-medium text-slate-500 hover:text-indigo-600 transition";

function Navbar() {
  const isLoggedIn = Boolean(sessionStorage.getItem("user"));

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

        {/* Main Menu */}
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

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600">
              Account
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
        </div>
      </div>
    </header>
  );
}

export default Navbar;
