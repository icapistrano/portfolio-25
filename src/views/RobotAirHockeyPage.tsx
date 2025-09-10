import { FC, useEffect } from "react";
import { ProjectContent, SectionItem } from "../components/ProjectContent";
import { ContactSection } from "./ContactSection";
import demo from "../assets/images/airHockey/demo.mp4";

const Overview: FC = () => (
  <section className="flex flex-col space-y-2">
    <p>
      <span className="font-semibold text-accent/100 text-lg">
        Robotic Air-hockey system
      </span>{" "}
      is an autonomous final-year project where I programmed an ABB IRB 120 to
      play against a human player. It consists of computer vision with OpenCV
      (Python) to localise the puck, trajectory prediction to anticipate shots,
      and ROS for motion control to intercept and return in real time.
    </p>

    <section>
      <figure className="my-4">
        <div className="not-prose overflow-hidden">
          <video
            className="w-full h-auto"
            src={demo}
            controls
            playsInline
            preload="metadata"
          />
        </div>
        <figcaption className="text-sm opacity-80 mt-2">
          Real-time air-hockey: vision → trajectory prediction → robotic
          interception.
        </figcaption>
      </figure>
    </section>
  </section>
);

const Processes = () => {
  const processes = [
    {
      header: "Computer Vision",
      desc: "An image processing pipeline was used to detect the puck, consisting of the following steps:",
      steps: [
        `
          Perspective Transformation: The camera feed is warped into a flat,
          top-down perspective where each pixel corresponds to a physical
          dimension (≈1 cm in real life).
        `,
        `
          Color Segmentation: HSV thresholding isolates the puck
          (experimentally tuned for green in this implementation). A binary
          mask is generated, highlighting puck candidates in the frame.
        `,
        `
          Contour Detection: The largest detected contour is assumed to be the
          puck and its centroid is calculated using bounding box coordinates.
        `,
      ],
    },
    {
      header: "Trajectory Prediction",
      desc: "Once the puck's position is tracked and registered the system attempts to predict its future location. The core techniques are:",
      steps: [
        `
          Linear Regression (Best-Fit Line):
          A slope and intercept are computed from the puck’s recent positions using a line-of-best-fit algorithm.
          This provides an estimate of the puck’s linear path.
        `,
        `
          Bounce Prediction:
          If the predicted path crosses the table boundaries, a bounce trajectory is calculated by mirroring the slope against the table edges.
          This allows the robot to anticipate not only direct shots but also banked shots.
        `,
        `
          Noise Filtering:
          A buffer of 5 frames is used to confirm motion direction and reduce jitter from detection noise.
        `,
      ],
    },
    {
      header: "Motion Control with ROS",
      desc: "ROS and MoveIt form the backbone of the robot’s control system. The puck’s predicted position is translated into robot actions:",
      steps: [
        `
          Forward and Inverse Kinematics:
          Forward kinematics aligns the end effector (EEF) with the table surface.
          Inverse kinematics computes Cartesian waypoints for the robot’s striker movement.
        `,
        `
          Path Planning and Execution:
          The puck’s predicted (x, y) coordinates are mapped into the robot’s workspace.
          Smooth trajectories are generated using MoveIt’s Cartesian path planner.
        `,
        `
          Safety Constraints:
          Virtual collision objects (walls and table) are added in simulation to restrict robot motion.
          This ensures the manipulator does not enter unsafe regions.
        `,
        `
        Reset Mechanism:
        After each interception attempt, the robot returns to a neutral “home” position to await the next shot.
        `,
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {processes.map(({ header, desc, steps }) => (
        <section key={header}>
          <h3 className="font-semibold">{header}</h3>
          <p>{desc}</p>
          <ul className="pl-6 list-disc space-y-1 mt-1">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export const RobotAirHockeyPage: FC = () => {
  const sectionItems: SectionItem[] = [
    {
      id: "overview",
      label: "Overview",
      children: <Overview />,
    },
    {
      id: "processes",
      label: "Processes",
      children: <Processes />,
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <ProjectContent sections={sectionItems} />
      <ContactSection />
    </>
  );
};
