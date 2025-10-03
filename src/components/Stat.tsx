type Props = { label: string; value: string };

export function Stat({ label, value }: Props) {
  return (
    <div>
      <p className="text-slate-400">{label}</p>
      <p className="text-slate-100 font-semibold">{value}</p>
    </div>
  );
}
