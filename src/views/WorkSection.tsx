import flowerPlotter from "../assets/images/flowerPlotter.gif";
import shuffleboard from "../assets/images/shuffleboard.jpg";
import robotAirhockey from "../assets/images/robotAirHockey.gif";
import { Container } from "../components/Container";
import { TimelineWithWaypoints } from "../components/Timeline";
import classNames from "classnames";
import { ProjectThumbnail } from "../components/ProjectThumbnail";

export const WorkSection = () => {
  // waypoint pos between 0 to 1
  const waypoints = [
    {
      id: "Interactive Shuffleboard",
      pos: 0.165,
      side: "left" as const,
      title: "Interactive Shuffleboard",
      image: shuffleboard,
      desc: "Modern shuffleboard with real-time tracking, auto scoring, and interactive 3D visuals",
      tags: ["Three.js", "Electron", "OpenCV"],
      link: "projects/interactive-shuffleboard",
    },
    {
      id: "Robotic Air-hockey System",
      pos: 0.5,
      side: "right" as const,
      title: "Robotic Air-hockey System",
      image: robotAirhockey,
      desc: "ROS-controlled robot that plays against humans using vision and predictive tracking",
      tags: ["ROS", "OpenCV", "Python"],
      link: "projects/robot-air-hockey",
    },
    {
      id: "Robotic Flower Plotter",
      pos: 0.835,
      side: "left" as const,
      title: "Robotic Flower Plotter",
      image: flowerPlotter,
      desc: "Robot plots flower patterns using polar coordinates and inverse kinematics",
      tags: ["RAPID", "Python"],
      link: "",
    },
  ];

  return (
    <Container
      id="work"
      className="relative border-t border-grey border-dashed mb-16 md:mb-20"
    >
      <div className="pt-[var(--cushion)]">
        {/* Responsive heading: same style, scaled down on mobile */}
        <h2 className="text-center font-primary text-4xl sm:text-5xl md:text-6xl leading-tight">
          <span className="font-accent align-baseline text-6xl sm:text-7xl md:text-9xl mr-1">
            W
          </span>
          ork
        </h2>

        <div className="relative w-full flex flex-col">
          {/* Timeline overlaid only on md+ to avoid clutter on phones */}
          <div className="absolute inset-0 mx-auto hidden md:flex justify-center pointer-events-none">
            <TimelineWithWaypoints waypoints={waypoints} showKnob={false} />
          </div>

          {waypoints.map((wp, idx) => (
            <div
              key={wp.id}
              className={classNames(
                "w-full flex justify-center", // center on mobile
                wp.side === "left" ? "md:justify-start" : "md:justify-end", // alternate on md+
                idx === 0 || idx === waypoints.length - 1 ? "py-10" : "py-0",
              )}
            >
              <div
                className={classNames(
                  "w-full md:w-1/2", // full width on mobile, half on desktop
                  wp.side === "left" ? "md:pr-8" : "md:pl-8",
                )}
              >
                <ProjectThumbnail
                  title={wp.title}
                  techStack={wp.tags}
                  image={wp.image}
                  desc={wp.desc}
                  isActive={true}
                  url={wp.link}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
