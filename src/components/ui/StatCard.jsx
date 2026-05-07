const VARIANTS = {
  violet: {
    card: "bg-violet-600",
    value: "text-white",
    label: "text-violet-200",
    iconWrap: "bg-white/20",
    icon: "text-white",
  },
  amber: {
    card: "bg-amber-400",
    value: "text-white",
    label: "text-amber-100",
    iconWrap: "bg-white/25",
    icon: "text-white",
  },
  emerald: {
    card: "bg-emerald-500",
    value: "text-white",
    label: "text-emerald-100",
    iconWrap: "bg-white/20",
    icon: "text-white",
  },
  rose: {
    card: "bg-rose-500",
    value: "text-white",
    label: "text-rose-100",
    iconWrap: "bg-white/20",
    icon: "text-white",
  },
  lavender: {
    card: "bg-violet-100",
    value: "text-violet-800",
    label: "text-violet-500",
    iconWrap: "bg-violet-200",
    icon: "text-violet-600",
  },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = "violet",
}) {
  const v = VARIANTS[variant] ?? VARIANTS.violet;

  return (
    <div className={`${v.card} rounded-2xl p-5 shadow-sm`}>
      {Icon && (
        <div className={`inline-flex items-center justify-center rounded-xl p-2.5 mb-4 ${v.iconWrap}`}>
          <Icon className={`h-5 w-5 ${v.icon}`} />
        </div>
      )}
      <p className={`text-3xl font-bold leading-none ${v.value}`}>
        {value ?? 0}
      </p>
      <p className={`mt-1.5 text-sm font-medium ${v.label}`}>{label}</p>
    </div>
  );
}
