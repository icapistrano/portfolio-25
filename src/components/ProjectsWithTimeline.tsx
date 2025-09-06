import React, { useState } from "react";
import { TimelineWithWaypoints, Waypoint } from "./Timeline";
import classNames from "classnames";
import { AnimatedProjectItem, ProjectThumbnail } from "./ProjectThumbnail";

export type WP = Waypoint & {
  title: string;
  desc: string;
  tags: string[];
  side: "left" | "right";
  image: string;
  link: string;
};

const ProjectColumn: React.FC<{
  waypoints: WP[];
  activeWaypoint?: WP;
}> = ({ waypoints, activeWaypoint }) => {
  return (
    <div className="relative h-full w-full">
      {/* absolutely position each card by pos */}
      {waypoints.map((wp) => {
        return (
          <div
            key={wp.id}
            className={classNames(
              "absolute top-0 px-4 -translate-y-1/2 w-full",
              {
                "right-0": wp.side === "left",
                "left-0": wp.side !== "left",
              },
            )}
            style={{ top: `${wp.pos * 100}%` }}
          >
            <AnimatedProjectItem side={wp.side}>
              <ProjectThumbnail
                title={wp.title}
                techStack={wp.tags}
                image={wp.image}
                desc={wp.desc}
                isActive={true}
                url={wp.link}
              />
            </AnimatedProjectItem>
          </div>
        );
      })}
    </div>
  );
};

export function ProjectsWithCenterTimeline({ waypoints }: { waypoints: WP[] }) {
  const [activeProjectId, setActiveProjectId] = useState(waypoints[0].id);

  const activeWaypoint = waypoints.find((w) => w.id === activeProjectId);

  const leftWaypoints = waypoints.filter((wp) => wp.side === "left");
  const rightWaypoints = waypoints.filter((wp) => wp.side === "right");

  return (
    <div className="w-full h-full flex flex-row justify-between">
      {/* LEFT column (provides scrollable height) */}
      <ProjectColumn
        waypoints={leftWaypoints}
        activeWaypoint={activeWaypoint}
      />

      {/* CENTER timeline (fills its parent’s height) */}
      <div className="relative w-8">
        <TimelineWithWaypoints
          waypoints={waypoints}
          thickness="1px"
          className="relative h-full w-8"
          showKnob={false}
          onActiveChange={(e) => {
            const _activeWaypoint = waypoints.find((wp) => wp.id === e);
            if (_activeWaypoint) {
              setActiveProjectId(_activeWaypoint.id);
            }
            console.log(e);
          }}
        />
      </div>

      {/* RIGHT column */}
      <ProjectColumn
        waypoints={rightWaypoints}
        activeWaypoint={activeWaypoint}
      />
    </div>
  );
}
