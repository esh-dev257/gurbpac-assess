"use client";
import { useState, useCallback } from "react";
import { useContent } from "@/hooks/useContent";
import { useApproveContent, useRejectContent } from "@/hooks/useApproval";
import StatusBadge from "@/components/ui/StatusBadge";
import Skeleton from "@/components/ui/Skeleton";
import Modal from "@/components/shared/Modal";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  ImageIcon,
  User,
  Calendar,
} from "lucide-react";
import { formatDateTime } from "@/utils/formatters";

export default function PendingPage() {
  const { data, isLoading } = useContent({ status: "pending", pageSize: 100 });
  const { mutateAsync: approve, isPending: approving } = useApproveContent();
  const { mutateAsync: reject, isPending: rejecting } = useRejectContent();

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [activeId, setActiveId] = useState(null);

  const items = data?.items ?? [];

  const handleApprove = useCallback(
    async (id) => {
      setActiveId(id);
      try {
        await approve(id);
        toast.success("Content approved and scheduled for display.");
      } catch (e) {
        toast.error(e?.message ?? "Failed to approve content.");
      } finally {
        setActiveId(null);
      }
    },
    [approve],
  );

  const openRejectModal = useCallback((item) => {
    setRejectTarget(item);
    setRejectReason("");
  }, []);

  const handleReject = useCallback(async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    setActiveId(rejectTarget.id);
    try {
      await reject({ id: rejectTarget.id, reason: rejectReason.trim() });
      toast.success("Content rejected with feedback sent to teacher.");
      setRejectTarget(null);
    } catch (e) {
      toast.error(e?.message ?? "Failed to reject content.");
    } finally {
      setActiveId(null);
    }
  }, [reject, rejectTarget, rejectReason]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and approve or reject submitted content.
          {!isLoading && (
            <span className="ml-2 font-semibold text-yellow-700">
              {items.length} item{items.length !== 1 ? "s" : ""} awaiting review
            </span>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-20 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
          <h3 className="text-base font-semibold text-gray-700">
            All clear! Nothing pending.
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            New submissions will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <PendingCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={openRejectModal}
              isActive={activeId === item.id}
              disabled={approving || rejecting}
            />
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject Content"
        footer={
          <>
            <button
              onClick={() => setRejectTarget(null)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim() || activeId === rejectTarget?.id}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {activeId === rejectTarget?.id ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Rejecting…
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {rejectTarget && (
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 flex gap-3">
              {rejectTarget.fileUrl && (
                <img
                  src={rejectTarget.fileUrl}
                  alt=""
                  className="h-14 w-20 rounded object-cover shrink-0"
                />
              )}
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  {rejectTarget.title}
                </p>
                <p className="text-xs text-gray-500">{rejectTarget.subject}</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Rejection reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Explain why this content cannot be approved (visible to the teacher)…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">
              {rejectReason.length}/500 characters
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PendingCard({ item, onApprove, onReject, isActive, disabled }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 relative">
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
          className={`${item.fileUrl ? "hidden" : "flex"} h-full w-full items-center justify-center`}
        >
          <ImageIcon className="h-10 w-10 text-gray-300" />
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-4 space-y-2.5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {item.title ?? "-"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{item.subject ?? "-"}</p>
        </div>

        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-gray-400" />
            {item.teacherName ?? "Unknown Teacher"}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            Submitted {formatDateTime(item.createdAt)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            {formatDateTime(item.startTime)} → {formatDateTime(item.endTime)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
        <button
          onClick={() => onReject(item)}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-gray-100"
        >
          {isActive ? (
            <span className="h-4 w-4 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Reject
        </button>
        <button
          onClick={() => onApprove(item.id)}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isActive ? (
            <span className="h-4 w-4 rounded-full border-2 border-green-200 border-t-green-600 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Approve
        </button>
      </div>
    </div>
  );
}
