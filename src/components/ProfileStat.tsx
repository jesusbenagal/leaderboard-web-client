export function ProfileStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <p className="text-slate-400 text-xs">{label}</p>
      <p className="text-white font-semibold mt-1 truncate">{value}</p>
    </div>
  );
}
