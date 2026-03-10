export default function HighlightsChips({ property }) {
  const chips = [
    property.areaSize && { label: `${property.areaSize} de area`, style: "bg-signal-50 text-signal-800" },
    property.type && { label: property.type, style: "bg-brand-50 text-brand-800" },
    property.deedAndRegistryOk && { label: "Escritura e registro OK", style: "bg-accent-50 text-accent-800" },
    property.city && { label: property.city, style: "bg-white text-slate-700 border border-brand-100" }
  ].filter(Boolean);

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip.label} className={`rounded-full px-3 py-1 text-sm font-medium ${chip.style}`}>
          {chip.label}
        </span>
      ))}
    </div>
  );
}
