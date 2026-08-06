import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const getInitials = (name, email) => {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "").toUpperCase();
  }
  return (email || "?").charAt(0).toUpperCase();
};

export default function ProfileDropdown({ user, dashboardPath, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const close = () => setIsOpen(false);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  // Close on Escape and return focus to trigger
  const handleMenuKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      triggerRef.current?.focus();
    }
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const triggerLabel = user?.name || user?.email || "Profile";

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Account menu for ${triggerLabel}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 px-2 py-1.5 text-sm text-zinc-200 transition hover:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-semibold text-white">
          {getInitials(user?.name, user?.email)}
        </span>
        <span className="hidden max-w-[10rem] truncate sm:inline">{triggerLabel}</span>
        <svg
          className={`hidden h-4 w-4 text-zinc-400 transition-transform sm:block ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Account menu"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl focus:outline-none"
        >
          {/* Header: login state */}
          <div className="border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{triggerLabel}</p>
            <p className="truncate text-xs text-zinc-400">{user?.email}</p>
            <span className="mt-1.5 items-center inline-block rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-sky-400 ring-1 ring-sky-500/20">
              {user?.role || "USER"}
            </span>
          </div>

          <div className="p-1.5">
            <Link
              role="menuitem"
              to={dashboardPath || "/settings"}
              onClick={close}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 focus:outline-none focus-visible:bg-zinc-800"
            >
              <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>

            <Link
              role="menuitem"
              to="/settings"
              onClick={close}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 focus:outline-none focus-visible:bg-zinc-800"
            >
              <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>

            <button
              role="menuitem"
              type="button"
              onClick={() => {
                close();
                onLogout();
              }}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10 focus:outline-none focus-visible:bg-red-500/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
