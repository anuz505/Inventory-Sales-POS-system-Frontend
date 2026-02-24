"use client";
import { useCallback, useEffect, useRef } from "react";

export function useInfiniteScroll(
  onIntersect: () => void,
  enabled: boolean = true,
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const stableCallback = useCallback(onIntersect, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) stableCallback();
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stableCallback, enabled]);
  return sentinelRef;
}
