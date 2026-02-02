import classNames from "classnames";
import flowerPlotter from "../assets/images/flowerPlotter.gif";
import shuffleboard from "../assets/images/shuffleboard.jpg";
import robotAirhockey from "../assets/images/robotAirHockey.gif";
import oms from "../assets/images/oms.png";
import { Container } from "../components/Container";
import { TimelineWithWaypoints } from "../components/Timeline";
import { ProjectThumbnail } from "../components/ProjectThumbnail";
import { TextWithAccent } from "../components/TextWithAccent";

export const WorkSection = () => {
  // waypoint pos between 0 to 1
  const waypoints = [
    {
      id: "3D Mapping Tool",
      pos: 0.15,
      side: "right" as const,
      title: "3D Mapping Tool",
      image: oms,
      desc: "A tool for annotating and visualising semantic map data",
      tags: ["R3F", "MobX", "Typescript"],
      buttonText: "Coming soon",
    },
    {
      id: "Interactive Shuffleboard",
      pos: 0.4,
      side: "left" as const,
      title: "Interactive Shuffleboard",
      image: shuffleboard,
      desc: "Modern shuffleboard with real-time tracking, auto scoring, and interactive 3D visuals",
      tags: ["Three.js", "Electron", "OpenCV"],
      link: "projects/interactive-shuffleboard",
      buttonText: "View work",
    },
    {
      id: "Robotic Air-hockey System",
      pos: 0.65,
      side: "right" as const,
      title: "Robotic Air-hockey System",
      image: robotAirhockey,
      desc: "ROS-controlled robot that plays against humans using vision and predictive tracking",
      tags: ["ROS", "OpenCV", "Python"],
      link: "projects/robot-air-hockey",
      buttonText: "View work",
    },
    {
      id: "Curated projects",
      pos: 0.88,
      side: "left" as const,
      title: "A curated collection of my work",
      image: flowerPlotter,
      link: "projects",
      buttonText: "View works",
    },
  ];

  return (
    <Container
      id="work"
      className="relative border-t border-grey border-dashed mb-16 md:mb-20"
    >
      <div className="pt-[var(--cushion)]">
        <TextWithAccent
          name="Work"
          accentIndex={0}
          textSizes="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          accentPadding="mr-2"
        />

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
                {
                  "pt-10": idx === 0,
                  "pb-10": idx === waypoints.length - 1,
                },
              )}
            >
              <div
                className={classNames(
                  "w-full md:w-1/2 flex p-2", // full width on mobile, half on desktop
                  wp.side === "left" ? "md:pr-8" : "md:pl-8",
                )}
              >
                <ProjectThumbnail
                  title={wp.title}
                  techStack={wp.tags}
                  image={wp.image}
                  desc={wp.desc}
                  url={wp.link}
                  buttonText={wp.buttonText}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
