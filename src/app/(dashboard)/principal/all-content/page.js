"use client";
import { useState, useCallback, useMemo } from "react";
import { useContent } from "@/hooks/useContent";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Pagination";
import { formatDateTime } from "@/utils/formatters";
import {
  Search,
  Filter,
  FileText,
  ImageIcon,
  User,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const PAGE_SIZE = 10;

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AllContentPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useContent({
    status,
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

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

  const handleClear = useCallback(() => {
    setSearch("");
    setSearchInput("");
    setStatus("all");
    setPage(1);
  }, []);

  const isFiltered = search || status !== "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse and filter all submitted content.
          {!isLoading && (
            <span className="ml-1">
              {total} item{total !== 1 ? "s" : ""}
              {isFiltered ? " matching filters" : " total"}
            </span>
          )}
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
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
          {isFiltered && (
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-base font-semibold text-gray-600">
              No results found
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {isFiltered
                ? "Try adjusting your search or status filter."
                : "No content has been submitted yet."}
            </p>
            {isFiltered && (
              <button
                onClick={handleClear}
                className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Content
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Subject
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                      Teacher
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                      Date Submitted
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                      Schedule
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

            <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
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
  const [imgError, setImgError] = useState(false);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            {item.fileUrl && !imgError ? (
              <img
                src={item.fileUrl}
                alt={item.title}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <p className="font-medium text-gray-900 text-sm leading-tight max-w-[180px] truncate">
            {item.title ?? "-"}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600 text-sm">{item.subject ?? "-"}</td>
      <td className="px-6 py-4 text-gray-600 text-sm hidden md:table-cell">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-gray-400" />
          {item.teacherName ?? "-"}
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={item.status} />
        {item.status === "rejected" && item.rejectionReason && (
          <p
            className="text-xs text-red-500 mt-1 max-w-[160px] truncate"
            title={item.rejectionReason}
          >
            {item.rejectionReason}
          </p>
        )}
      </td>
      <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">
        {formatDateTime(item.createdAt)}
      </td>
      <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">
        <div>{formatDateTime(item.startTime)}</div>
        <div className="text-gray-400">→ {formatDateTime(item.endTime)}</div>
      </td>
    </tr>
  );
}
