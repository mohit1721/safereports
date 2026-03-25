import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsProfileOpen(false);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (user?.role === "ADMIN") return "/admin-dashboard";
    if (user?.role === "POLICE") return "/police-dashboard";
    return null;
  };
  const dashboardPath = getDashboardPath();

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/70 text-white backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-2">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-lg font-semibold">SafeReport</span>
            </Link>

            <div className="hidden items-center space-x-6 md:flex">
              <Link to="/submit-report" className="text-sm text-zinc-400 hover:text-white">Submit Report</Link>
              <Link to="/track-report" className="text-sm text-zinc-400 hover:text-white">Track Report</Link>
              <Link to="/how-it-works" className="text-sm text-zinc-400 hover:text-white">How It Works</Link>
              <Link to="/resources" className="text-sm text-zinc-400 hover:text-white">Resources</Link>
              <Link to="/contact" className="text-sm text-zinc-400 hover:text-white">Contact</Link>
            </div>

            <div className="flex items-center gap-3">
              <a href="tel:112" className="hidden rounded-full bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20 md:inline-flex">Emergency: 112</a>

              {user ? (
                <div className="relative hidden md:block">
                  <button
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                  >
                    {user?.name || user?.email || "Profile"}
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-zinc-700 bg-zinc-900 p-2 shadow-xl">
                      <p className="px-2 py-1 text-xs text-zinc-400">{user?.role || "USER"}</p>
                      {dashboardPath && (
                        <Link
                          to={dashboardPath}
                          onClick={() => setIsProfileOpen(false)}
                          className="block w-full rounded-md px-2 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full rounded-md px-2 py-2 text-left text-sm text-red-300 hover:bg-zinc-800">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden text-sm text-zinc-400 hover:text-white md:block">Login</Link>
              )}

              <button className="p-2 text-zinc-400 hover:text-white md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
        dashboardPath={dashboardPath}
      />
    </>
  );
}
