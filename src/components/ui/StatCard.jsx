export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "bg-blue-50",
  iconColor = "text-blue-600",
  valueColor = "text-blue-700",
}) {
  return (
    <div
      className={`rounded-xl border border-gray-100 p-5 shadow-sm ${color} flex items-start justify-between`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value ?? 0}</p>
      </div>
      {Icon && (
        <div className={`rounded-lg bg-white p-2.5 shadow-sm`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      )}
    </div>
  );
}
