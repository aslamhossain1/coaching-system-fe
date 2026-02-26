// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";

export default function AnimatedCounter({
  value = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 900,
  className = "",
}) {
  const target = Number.isFinite(Number(value)) ? Number(value) : 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(target * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, target]);

  const formatted = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(count),
    [count, decimals]
  );

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

