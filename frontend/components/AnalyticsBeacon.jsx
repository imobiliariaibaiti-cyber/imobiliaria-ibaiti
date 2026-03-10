"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackVisit } from "@/lib/analytics";

export default function AnalyticsBeacon({ propertyId, source }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;
    trackVisit({ path: fullPath, propertyId, source });
  }, [pathname, searchParams, propertyId, source]);

  return null;
}
