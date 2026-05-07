"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useContentStats, useRecentContent } from "@/hooks/useContent";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import StatCard from "@/components/ui/StatCard";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's an overview of your content activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Uploaded"
              value={stats?.total ?? 0}
              icon={FileText}
              color="bg-blue-50"
              iconColor="text-blue-600"
              valueColor="text-blue-700"
            />
            <StatCard
              label="Pending"
              value={stats?.pending ?? 0}
              icon={Clock}
              color="bg-yellow-50"
              iconColor="text-yellow-600"
              valueColor="text-yellow-700"
            />
            <StatCard
              label="Approved"
              value={stats?.approved ?? 0}
              icon={CheckCircle}
              color="bg-green-50"
              iconColor="text-green-600"
              valueColor="text-green-700"
            />
            <StatCard
              label="Rejected"
              value={stats?.rejected ?? 0}
              icon={XCircle}
              color="bg-red-50"
              iconColor="text-red-600"
              valueColor="text-red-700"
            />
          </>
        )}
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Uploads
          </h2>
          <Link
            href="/teacher/my-content"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : !recent?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              No content uploaded yet
            </p>
            <Link
              href="/teacher/upload"
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Upload your first piece →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Subject
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Start
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    End
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-medium text-gray-900">
                      {row.title ?? "-"}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">
                      {row.subject ?? "-"}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 hidden md:table-cell">
                      {formatDateTime(row.startTime)}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 hidden md:table-cell">
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
