import { useEffect, useState } from "react";

/**
 * Calculate the height of navbar and cushion
 */
export const useTopOffsetPx = () => {
  const readVarPx = (name: string) =>
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(name),
    ) || 0;

  const read = () => {
    const navH = readVarPx("--nav-h");
    const cushion = readVarPx("--cushion");
    return navH + cushion;
  };
  const [topPx, setTopPx] = useState(read);

  useEffect(() => {
    const update = () => setTopPx(read());
    update();
    const mq = window.matchMedia("(min-width:1024px)");
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  return topPx;
};
