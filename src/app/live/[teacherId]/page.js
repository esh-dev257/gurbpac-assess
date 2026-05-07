"use client";
import { use, useMemo, useState } from "react";
import { useLiveContent } from "../../../hooks/useContent";
import { getScheduleStatus } from "../../../services/content.service";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { Radio, Clock, Calendar, RefreshCw, ImageIcon } from "lucide-react";
import { formatDateTime } from "../../../utils/formatters";

export default function LivePage({ params }) {
  const { teacherId } = use(params);
  const {
    data: items,
    isLoading,
    isFetching,
    dataUpdatedAt,
  } = useLiveContent(teacherId);

  const lastRefreshed = useMemo(() => {
    if (!dataUpdatedAt) return null;
    return new Date(dataUpdatedAt).toLocaleTimeString();
  }, [dataUpdatedAt]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">
                CBS Live Display
              </h1>
              <p className="text-xs text-gray-400">Teacher ID: {teacherId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {isFetching && !isLoading && (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-400" />
            )}
            {lastRefreshed && (
              <span>Updated {lastRefreshed} · Auto-refreshes every 30s</span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <LoadingSpinner
              size="lg"
              className="border-gray-700 border-t-blue-400"
            />
            <p className="text-sm text-gray-400">Loading content…</p>
          </div>
        ) : !items?.length ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-800 mb-6">
              <Radio className="h-10 w-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-300">
              No content currently available
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              This display has no approved content scheduled. Check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <LiveCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function LiveCard({ item }) {
  const scheduleStatus = getScheduleStatus(item.startTime, item.endTime);
  const [imgError, setImgError] = useState(false);

  const statusConfig = {
    active: {
      label: "● LIVE",
      bg: "bg-green-500",
      text: "text-white",
      ring: "ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900",
    },
    scheduled: {
      label: "Scheduled",
      bg: "bg-blue-600",
      text: "text-white",
      ring: "",
    },
    expired: {
      label: "Expired",
      bg: "bg-gray-600",
      text: "text-gray-200",
      ring: "",
    },
  };

  const cfg = statusConfig[scheduleStatus] ?? statusConfig.expired;

  return (
    <div
      className={`bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col ${cfg.ring}`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-800 flex items-center justify-center overflow-hidden">
        {item.fileUrl && !imgError ? (
          <img
            src={item.fileUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageIcon className="h-12 w-12 text-gray-600" />
        )}

        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${cfg.bg} ${cfg.text}`}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        <div>
          <h2 className="font-bold text-white text-base leading-tight">
            {item.title ?? "-"}
          </h2>
          <span className="inline-block mt-1 rounded-md bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300">
            {item.subject ?? "-"}
          </span>
        </div>

        {item.description && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="pt-1 space-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>Start: {formatDateTime(item.startTime)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>End: {formatDateTime(item.endTime)}</span>
          </div>
          {item.rotationDuration && (
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 shrink-0" />
              <span>Rotation: {item.rotationDuration} min</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
