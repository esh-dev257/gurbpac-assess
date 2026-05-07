"use client";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Bell, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

const PAGE_TITLES = {
  "/teacher/dashboard": "Dashboard",
  "/teacher/upload": "Upload Content",
  "/teacher/my-content": "My Content",
  "/principal/dashboard": "Dashboard",
  "/principal/pending": "Pending Approvals",
  "/principal/all-content": "All Content",
};

function formatNavDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";
  const dateStr = useMemo(() => formatNavDate(), []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      {/* Left: Page title + date */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">
          {pageTitle}
        </h1>
        <p className="text-xs text-gray-400 leading-tight">{dateStr}</p>
      </div>

      {/* Right: Bell + avatar dropdown */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell className="h-4.5 w-4.5" />
        </button>

        {/* Divider */}
        <div className="h-7 w-px bg-gray-100" />

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold">
              {getInitials(user.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white shadow-lg border border-gray-100 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
