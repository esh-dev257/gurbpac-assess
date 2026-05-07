export function formatDateTime(ts) {
  if (!ts) return "-";
  try {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "-";
  }
}

export function formatDate(ts) {
  if (!ts) return "-";
  try {
    return new Date(ts).toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return "-";
  }
}

export function formatStatus(status) {
  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[status] ?? (status ? String(status) : "Unknown");
}

export function formatScheduleStatus(startTime, endTime) {
  const now = Date.now();
  if (now < startTime) return "Scheduled";
  if (now > endTime) return "Expired";
  return "Active";
}
