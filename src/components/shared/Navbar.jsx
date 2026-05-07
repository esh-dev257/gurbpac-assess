"use client";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User, Radio } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const roleColors = {
    teacher: "bg-blue-100 text-blue-700",
    principal: "bg-purple-100 text-purple-700",
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm shrink-0">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            CBS <span className="text-blue-600">Platform</span>
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {user.name}
                </p>
                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium capitalize ${
                    roleColors[user.role] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 hover:border-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
