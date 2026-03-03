export default function HighlightsChips({ property }) {
  const chips = [
    property.areaSize && `${property.areaSize} de área`,
    property.type,
    property.deedAndRegistryOk ? "Escritura e registro OK" : null,
    property.city
  ].filter(Boolean);

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span key={chip} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-800">
          {chip}
        </span>
      ))}
    </div>
  );
}
