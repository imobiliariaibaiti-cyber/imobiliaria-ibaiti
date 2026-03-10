export default function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand-900">{value}</p>
      {helper && <p className="text-sm text-slate-600">{helper}</p>}
    </div>
  );
}
