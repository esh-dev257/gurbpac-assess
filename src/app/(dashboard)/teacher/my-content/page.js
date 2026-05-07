"use client";
import { useState, useMemo, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useContent } from "@/hooks/useContent";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Pagination";
import { formatDateTime } from "@/utils/formatters";
import {
  FileText,
  Search,
  ImageIcon,
  Clock,
  AlertCircle,
  Filter,
} from "lucide-react";

const PAGE_SIZE = 10;
const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function MyContentPage() {
  const { user } = useAuthContext();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useContent({
    teacherId: user?.id,
    status,
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setSearch(searchInput.trim());
      setPage(1);
    },
    [searchInput],
  );

  const handleStatusChange = useCallback((s) => {
    setStatus(s);
    setPage(1);
  }, []);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          All content you have uploaded - {total} item{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search title or subject…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleStatusChange(f.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  status === f.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-16 w-24 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-base font-semibold text-gray-600">
              {search || status !== "all"
                ? "No results match your filters"
                : "No content uploaded yet"}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {search || status !== "all"
                ? "Try adjusting your search or filter."
                : "Head to the Upload page to get started."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="sm:hidden divide-y divide-gray-100">
              {items.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Content
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Subject
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Schedule
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <ContentRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4">
              <Pagination
                page={page}
                total={total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ContentRow({ item }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            {item.fileUrl ? (
              <img
                src={item.fileUrl}
                alt={item.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="hidden h-full w-full items-center justify-center"
              style={{ display: item.fileUrl ? "none" : "flex" }}
            >
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-900 leading-tight">
              {item.title ?? "-"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDateTime(item.createdAt)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600">{item.subject ?? "-"}</td>
      <td className="px-6 py-4">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4 text-xs text-gray-500">
        <div className="flex items-center gap-1 mb-0.5">
          <Clock className="h-3 w-3" />
          {formatDateTime(item.startTime)}
        </div>
        <div className="text-gray-400">→ {formatDateTime(item.endTime)}</div>
      </td>
      <td className="px-6 py-4 max-w-xs">
        {item.status === "rejected" && item.rejectionReason ? (
          <div className="flex items-start gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 leading-relaxed line-clamp-2">
              {item.rejectionReason}
            </p>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>
    </tr>
  );
}

function ContentCard({ item }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex gap-3">
        <div className="h-16 w-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
          {item.fileUrl ? (
            <img
              src={item.fileUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {item.title ?? "-"}
          </p>
          <p className="text-xs text-gray-500">{item.subject ?? "-"}</p>
          <div className="mt-1.5">
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400 space-y-0.5">
        <p>Start: {formatDateTime(item.startTime)}</p>
        <p>End: {formatDateTime(item.endTime)}</p>
      </div>
      {item.status === "rejected" && item.rejectionReason && (
        <div className="flex items-start gap-1.5 rounded-lg bg-red-50 p-2.5">
          <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{item.rejectionReason}</p>
        </div>
      )}
    </div>
  );
}
