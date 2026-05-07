"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useContentStats, useRecentContent } from "@/hooks/useContent";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import StatCard from "@/components/ui/StatCard";
import { FileText } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";
import Link from "next/link";

export default function TeacherDashboard() {
  const { user } = useAuthContext();
  const { data: stats, isLoading: statsLoading } = useContentStats(user?.id);
  const { data: recent, isLoading: recentLoading } = useRecentContent({
    teacherId: user?.id,
    limit: 5,
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-violet-50 border border-violet-100 px-7 py-6">
        <div>
          <h2 className="text-xl font-bold text-violet-900">
            Hi, {user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-sm text-violet-500 mt-1">
            Ready to share something new with your students today?
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard label="Total Uploaded" value={stats?.total ?? 0} variant="violet" />
            <StatCard label="Pending" value={stats?.pending ?? 0} variant="amber" />
            <StatCard label="Approved" value={stats?.approved ?? 0} variant="emerald" />
            <StatCard label="Rejected" value={stats?.rejected ?? 0} variant="rose" />
          </>
        )}
      </div>

      {/* Recent uploads */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Uploads
          </h2>
          <Link
            href="/teacher/my-content"
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : !recent?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 mb-3">
              <FileText className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No content uploaded yet
            </p>
            <Link
              href="/teacher/upload"
              className="mt-2 text-xs font-semibold text-violet-600 hover:text-violet-700"
            >
              Upload your first piece →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Subject
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    Start
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
                    End
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">
                      {row.title ?? "—"}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">
                      {row.subject ?? "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs hidden md:table-cell">
                      {formatDateTime(row.startTime)}
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs hidden md:table-cell">
                      {formatDateTime(row.endTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
