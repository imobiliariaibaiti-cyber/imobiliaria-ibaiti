const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function trackVisit({ path, propertyId, source } = {}) {
  if (!path) return;

  const payload = {
    path,
    ...(propertyId ? { propertyId } : {}),
    ...(source ? { source } : {})
  };

  const url = `${API_URL}/analytics/visit`;

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("trackVisit falhou", error);
    }
  }
}
