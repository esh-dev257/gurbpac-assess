"use client";
import { useContentStats, useRecentContent } from "@/hooks/useContent";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import StatCard from "@/components/ui/StatCard";
import { CheckCircle, ImageIcon } from "lucide-react";
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
      {/* Welcome banner */}
      <div className="rounded-2xl bg-violet-50 border border-violet-100 px-7 py-6">
        <div>
          <h2 className="text-xl font-bold text-violet-900">
            Welcome back, Principal!
          </h2>
          <p className="text-sm text-violet-500 mt-1">
            Here's an overview of all content across the school.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard label="Total Content" value={stats?.total ?? 0} variant="violet" />
            <StatCard label="Pending Review" value={stats?.pending ?? 0} variant="amber" />
            <StatCard label="Approved" value={stats?.approved ?? 0} variant="emerald" />
            <StatCard label="Rejected" value={stats?.rejected ?? 0} variant="rose" />
          </>
        )}
      </div>

      {/* Pending items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">
              Awaiting Your Review
            </h2>
            {!statsLoading && (stats?.pending ?? 0) > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 px-1.5">
                {stats.pending}
              </span>
            )}
          </div>
          <Link
            href="/principal/pending"
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 mb-3">
              <CheckCircle className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">
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
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-28 bg-gray-50 flex items-center justify-center overflow-hidden">
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
          <ImageIcon className="h-8 w-8 text-gray-300" />
        )}
      </div>
      <div className="p-3.5">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {item.title ?? "-"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{item.subject ?? "-"}</p>
        <p className="text-xs text-gray-400 mt-1">
          {item.teacherName ?? "-"} · {formatDateTime(item.createdAt)}
        </p>
        <Link
          href="/principal/pending"
          className="mt-2 inline-block text-xs font-semibold text-violet-600 hover:text-violet-700"
        >
          Review →
        </Link>
      </div>
    </div>
  );
}
