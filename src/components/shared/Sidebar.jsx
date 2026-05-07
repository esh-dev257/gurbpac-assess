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
  const roleGradient =
    user.role === "teacher"
      ? "bg-linear-to-br from-blue-600 to-indigo-600"
      : "bg-linear-to-br from-purple-600 to-violet-600";

  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-gray-200 px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${roleGradient}`}
            >
              <Radio className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800">CBS</span>
          </div>
        )}
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-gray-200">
          <div
            className={`rounded-lg ${roleGradient} p-3 text-white`}
          >
            <p className="text-xs font-medium opacity-75">Signed in as</p>
            <p className="mt-0.5 text-sm font-bold truncate">{user.name}</p>
            <p className="text-xs opacity-75 capitalize">{user.role}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
