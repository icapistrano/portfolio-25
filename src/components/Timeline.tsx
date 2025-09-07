import classNames from "classnames";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { FC, useMemo, useRef, useState } from "react";

export type Waypoint = {
  id: string;
  pos: number; // 0..1 (0=top of timeline, 1=bottom)
  side?: "left" | "right"; // optional (for future spurs/cards)
};

type TimelineProps = {
  waypoints: Waypoint[];
  onActiveChange?: (id: string | null) => void; // last waypoint whose pos <= progress (or null)
  onProgressChange?: (progress: number) => void; // last waypoint whose pos <= progress (or null)
  thickness?: string; // CSS width, e.g. "4px"
  className?: string; // wrapper classes; parent should set height
  showKnob?: boolean;
};

export const TimelineWithWaypoints: FC<TimelineProps> = ({
  waypoints,
  onActiveChange,
  onProgressChange,
  thickness = "2px",
  className = "relative h-full w-8",
  showKnob = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Scroll progress for THIS element vs viewport center line
  // 0 when the top of the element aligns with viewport center
  // 1 when the bottom aligns with viewport center
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  // Line fill + knob position
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const knobTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Ensure 0..1 and stable sort of waypoints by pos
  const normalized = useMemo(
    () =>
      [...waypoints]
        .map((w) => ({ ...w, pos: Math.min(1, Math.max(0, w.pos)) }))
        .sort((a, b) => a.pos - b.pos),
    [waypoints],
  );

  // Track the “most recently passed” waypoint and notify caller
  const [activeId, setActiveId] = useState<string | null>(null);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.min(1, Math.max(0, v));
    // last waypoint with pos <= p
    const last = [...normalized].reverse().find((w) => w.pos <= p) ?? null;
    const nextId = last?.id ?? null;
    if (nextId !== activeId) {
      setActiveId(nextId);
      onActiveChange?.(nextId);
    }

    onProgressChange?.(p);
  });

  return (
    <div ref={ref} className={className}>
      {/* Base rail */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-grey rounded-full z-1"
        style={{ width: thickness }}
      />

      {/* Filled overlay */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 bg-accent rounded-full z-2"
        style={{ width: thickness, height: fill }}
      />

      {/* Knob */}
      {showKnob && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-accent z-3"
          style={{ top: knobTop }}
        />
      )}

      {/* Waypoints */}
      {normalized.map((wp) => {
        const top = `${wp.pos * 100}%`;
        const passed = activeId
          ? normalized.findIndex((x) => x.id === wp.id) <=
            normalized.findIndex((x) => x.id === activeId)
          : false;

        return (
          <div
            key={wp.id}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top }}
          >
            <div
              className={classNames("h-3 w-3 rounded-full", {
                "bg-accent": passed,
                "border bg-dark border-grey": !passed,
              })}
            />
          </div>
        );
      })}
    </div>
  );
};
