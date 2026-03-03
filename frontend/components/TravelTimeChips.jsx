"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export default function TravelTimeChips({ propertyId, lat, lng }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/properties/${propertyId}/travel-times`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [propertyId, lat, lng]);

  if (!lat || !lng) {
    return <p className="text-sm text-slate-600">Adicione latitude e longitude para mostrar tempos.</p>;
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Calculando trajetos...</p>;
  }

  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item.label} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-800">
            {item.label}: {item.minutes} min {item.distanceKm ? `(${item.distanceKm} km)` : ""}
          </span>
        ))}
      </div>
      {MAPS_KEY && (
        <iframe
          className="h-52 w-full rounded-2xl border border-brand-100"
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${lat},${lng}`}
        />
      )}
    </div>
  );
}
