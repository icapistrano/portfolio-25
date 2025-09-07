import { useEffect, useState } from "react";

export const useActiveSection = (ids: string[], y = 164) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // band
    const h = window.innerHeight;
    const topMargin = -y;
    const bottomMargin = -(h - y - 1);

    const findClosestSection = () => {
      let nearestId: string | null = null;
      let nearestDistance = Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        const bestLine = Math.min(
          Math.abs(y - rect.top),
          Math.abs(y - rect.bottom),
        );

        if (bestLine <= nearestDistance) {
          nearestDistance = bestLine;
          nearestId = id;
        }
      }

      if (nearestId !== null) {
        setActiveId(nearestId);
      }
    };

    const observer = new IntersectionObserver(() => findClosestSection(), {
      root: null,
      rootMargin: `${topMargin}px 0px ${bottomMargin}px 0px`,
      threshold: 0,
    });

    // Observe each section
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    findClosestSection();
    const onResize = () => findClosestSection();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [ids, y]);

  return activeId;
};
