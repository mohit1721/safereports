import { useState } from "react";
import MobileMenu from "./MobileMenu";
import {Link} from "react-router-dom"
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed gap-2 top-0 text-white w-full left-0 border-b border-white/5 bg-black/60 backdrop-blur-xl z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-wrap">SafeReport</span>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/submit-report" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Submit Report
              </Link>
              <Link to="/track-report" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Track Report
              </Link>
              <Link to="/how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link to="/resources" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Resources
              </Link>
            </div>

            {/* Emergency & Mobile Menu Button */}
            <div className="flex items-center space-x-4 ">
              <Link to="/contact" className="hidden md:block text-sm text-zinc-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/login" className="hidden md:block text-sm text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <button className="cursor-pointer group hidden md:block flex h-9 items-center gap-2 rounded-full bg-red-500/10 pl-4 pr-5 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 transition-all hover:bg-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <Link to="tel:112">Emergency: 112</Link>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-zinc-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
