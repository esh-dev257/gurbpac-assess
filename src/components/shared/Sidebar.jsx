"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import { useState, useCallback } from "react";
import {
  LayoutDashboard,
  Upload,
  FileText,
  ClipboardList,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Radio,
} from "lucide-react";

const teacherLinks = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/upload", label: "Upload Content", icon: Upload },
  { href: "/teacher/my-content", label: "My Content", icon: FileText },
];

const principalLinks = [
  { href: "/principal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/principal/pending", label: "Pending Approvals", icon: ClipboardList },
  { href: "/principal/all-content", label: "All Content", icon: BarChart2 },
];

export default function Sidebar() {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  if (!user) return null;

  const links = user.role === "teacher" ? teacherLinks : principalLinks;

  return (
    <aside
      className={`bg-[#1e1b4b] flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex h-16 items-center px-4 shrink-0 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500">
              <Radio className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              CBS
            </span>
          </div>
        )}
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white/80 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white/80"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  isActive ? "text-white" : "text-white/50"
                }`}
              />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {!collapsed && (
        <div className="px-4 py-4 shrink-0">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-white text-xs font-bold shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-white/50 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
