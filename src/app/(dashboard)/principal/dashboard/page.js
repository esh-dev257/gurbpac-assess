"use client";
import { useContentStats, useRecentContent } from "@/hooks/useContent";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import StatCard from "@/components/ui/StatCard";
import { FileText, Clock, CheckCircle, XCircle, ImageIcon } from "lucide-react";
import { formatDateTime } from "@/utils/formatters";
import Link from "next/link";

export default function PrincipalDashboard() {
  const { data: stats, isLoading: statsLoading } = useContentStats();
  const { data: recent, isLoading: recentLoading } = useRecentContent({
    limit: 6,
  });

  const pendingItems = (recent ?? []).filter((c) => c.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Principal Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of all content across the school.
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
              label="Total Content"
              value={stats?.total ?? 0}
              icon={FileText}
              color="bg-indigo-50"
              iconColor="text-indigo-600"
              valueColor="text-indigo-700"
            />
            <StatCard
              label="Pending Review"
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

      {/* Pending items */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">
              Awaiting Your Review
            </h2>
            {!statsLoading && (stats?.pending ?? 0) > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700 px-1.5">
                {stats.pending}
              </span>
            )}
          </div>
          <Link
            href="/principal/pending"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Review all →
          </Link>
        </div>

        {recentLoading ? (
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : pendingItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="h-10 w-10 text-green-400 mb-3" />
            <p className="text-sm font-medium text-gray-600">
              All caught up! No items pending review.
            </p>
          </div>
        ) : (
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingItems.map((item) => (
              <PendingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PendingCard({ item }) {
  return (
    <div className="rounded-xl border border-yellow-100 bg-yellow-50 overflow-hidden">
      <div className="h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
        {item.fileUrl ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {item.title ?? "-"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{item.subject ?? "-"}</p>
        <p className="text-xs text-gray-400 mt-1">
          {item.teacherName ?? "-"} · {formatDateTime(item.createdAt)}
        </p>
        <Link
          href="/principal/pending"
          className="mt-2 inline-block text-xs font-semibold text-yellow-700 hover:text-yellow-800"
        >
          Review →
        </Link>
      </div>
    </div>
  );
}
