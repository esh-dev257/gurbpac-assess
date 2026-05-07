export default function StatusBadge({ status }) {
  let color = "bg-gray-300 text-gray-800";
  if (status === "pending") color = "bg-yellow-200 text-yellow-800";
  if (status === "approved") color = "bg-green-200 text-green-800";
  if (status === "rejected") color = "bg-red-200 text-red-800";
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
