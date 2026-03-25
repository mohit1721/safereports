import { Link } from "react-router-dom";

export default function MobileMenu({ isOpen, onClose, user, onLogout, dashboardPath }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-72 bg-zinc-900 p-6 shadow-xl">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Menu</p>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col space-y-4">
            <Link to="/submit-report" className="text-sm text-zinc-300" onClick={onClose}>Submit Report</Link>
            <Link to="/track-report" className="text-sm text-zinc-300" onClick={onClose}>Track Report</Link>
            <Link to="/how-it-works" className="text-sm text-zinc-300" onClick={onClose}>How It Works</Link>
            <Link to="/resources" className="text-sm text-zinc-300" onClick={onClose}>Resources</Link>
            <Link to="/contact" className="text-sm text-zinc-300" onClick={onClose}>Contact</Link>
            <a href="tel:112" className="text-sm text-red-300" onClick={onClose}>Emergency: 112</a>
            {user ? (
              <>
                {dashboardPath && (
                  <Link to={dashboardPath} className="text-sm text-zinc-300" onClick={onClose}>
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="rounded-md border border-red-400/30 px-3 py-2 text-left text-sm text-red-300"
                >
                  Logout ({user?.role || "USER"})
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-zinc-300" onClick={onClose}>Login</Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
