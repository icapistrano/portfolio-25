import flowerPlotter from "../assets/images/flowerPlotter.gif";
import shuffleboard from "../assets/images/shuffleboard.jpg";
import robotAirhockey from "../assets/images/robotAirHockey.gif";
import { ProjectsWithCenterTimeline } from "../components/ProjectsWithTimeline";
import { Container } from "../components/Container";
import { TimelineWithWaypoints, Waypoint } from "../components/Timeline";

export const WorkPage = () => {
  // waypoint pos between 0 to 1
  const waypoints = [
    {
      id: "Interactive Shuffleboard",
      pos: 0.2,
      side: "left" as const,
      title: "Interactive Shuffleboard",
      image: shuffleboard,
      desc: "Modern shuffleboard with real-time tracking, auto scoring, and interactive 3D visuals",
      tags: ["Three.js", "Electron", "OpenCV"],
    },
    {
      id: "Robotic Air-hockey System",
      pos: 0.5,
      side: "right" as const,
      title: "Robotic Air-hockey System",
      image: robotAirhockey,
      desc: "ROS-controlled robot that plays against humans using vision and predictive tracking",
      tags: ["ROS", "OpenCV", "Python"],
    },
    {
      id: "Robotic Flower Plotter",
      pos: 0.8,
      side: "left" as const,
      title: "Robotic Flower Plotter",
      image: flowerPlotter,
      desc: "Robot plots flower patterns using polar coordinates and inverse kinematics",
      tags: ["RAPID", "Python"],
    },
  ];

  const w: Waypoint[] = [
    { id: "first", pos: 0 },
    { id: "interactive-shuffleboard", pos: 0.25 },

    { id: "last", pos: 1 },
  ];

  return (
    <Container
      id="work"
      className="relative border-t border-grey border-dashed mb-20"
    >
      <h2 className="text-center text-6xl">
        <span className="font-accent text-9xl">W</span>ork
      </h2>

      <div className="relative z-20">
        <div className="h-[200vh]">
          <ProjectsWithCenterTimeline waypoints={waypoints} />
        </div>
      </div>
    </Container>
  );
};
