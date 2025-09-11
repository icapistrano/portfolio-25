import { FC, useEffect } from "react";
import { ProjectContent, SectionItem } from "../components/ProjectContent";
import { ContactSection } from "./ContactSection";
import demo from "../assets/images/airHockey/demo.mp4";
import demoPoster from "../assets/images/airHockey/demoPoster.png";
import safetyConstraintsVid from "../assets/images/airHockey/safetyConstraints.mp4";
import safetyConstraintsPoster from "../assets/images/airHockey/safetyConstraintsPoster.png";
import bounceImg from "../assets/images/airHockey/bounceFig.png";

type Step = {
  desc: string;
  videoSrc?: string;
  videoPoster?: string;
  imgSrc?: string;
};

const Process: FC<{
  desc: string;
  steps: Step[];
}> = ({ desc, steps }) => {
  return (
    <section>
      <p>{desc}</p>
      <ul className="pl-6 list-disc space-y-2 mt-1">
        {steps.map((step) => (
          <li key={step.desc}>
            <p>{step.desc}</p>
            {step.videoSrc && (
              <video
                src={step.videoSrc}
                poster={step.videoPoster}
                className="w-full h-auto mt-2 mb-4"
                controls
                playsInline
                preload="metadata"
              />
            )}
            {step.imgSrc && (
              <img src={step.imgSrc} className="w-full h-auto mt-2 mb-4" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

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
      <figure className="mt-4">
        <div className="not-prose overflow-hidden">
          <video
            className="w-full h-auto"
            src={demo}
            poster={demoPoster}
            controls
            playsInline
            preload="metadata"
          />
        </div>
        <figcaption className="text-sm opacity-80 mt-2">
          Real-time air-hockey: computer vision → trajectory prediction → motion
          control.
        </figcaption>
      </figure>
    </section>
  </section>
);

const ComputerVision = () => {
  const steps: Step[] = [
    {
      desc: `
            Perspective Transformation: The camera feed is warped into a flat,
            top-down perspective where each pixel corresponds to a physical
            dimension (≈1 cm in real life).
          `,
    },
    {
      desc: `
          Color Segmentation: HSV thresholding isolates the puck
          (experimentally tuned for green in this implementation). A binary
          mask is generated, highlighting puck candidates in the frame.
        `,
    },
    {
      desc: `
            Contour Detection: The largest detected contour is assumed to be the
            puck and its centroid is calculated using bounding box coordinates.
          `,
    },
  ];

  return (
    <Process
      desc="An image processing pipeline was used to detect the puck, consisting of the following steps:"
      steps={steps}
    />
  );
};

const TrajectoryPrediction = () => {
  const steps: Step[] = [
    {
      desc: `
            Linear Regression (Best-Fit Line):
            A slope and intercept are computed from the puck’s recent positions using a line-of-best-fit algorithm.
            This provides an estimate of the puck’s linear path.
          `,
    },
    {
      desc: `
            Bounce Prediction:
            If the predicted path crosses the table boundaries, a bounce trajectory is calculated by mirroring the slope against the table edges.
            This allows the robot to anticipate not only direct shots but also banked shots.
          `,
      imgSrc: bounceImg,
    },
    {
      desc: `
            Noise Filtering:
            A buffer of 5 frames is used to confirm motion direction and reduce jitter from detection noise.
          `,
    },
  ];

  return (
    <Process
      desc="Once the puck's position is tracked and registered the system attempts to predict its future location. The core techniques are:"
      steps={steps}
    />
  );
};

const MotionControlWithROS = () => {
  const steps: Step[] = [
    {
      desc: `
            Forward and Inverse Kinematics:
            Forward kinematics aligns the end effector with the table surface.
            Inverse kinematics computes Cartesian waypoints for the robot’s striker movement.
          `,
    },
    {
      desc: `
            Safety Constraints:
            Virtual collision objects (walls and table) are added in simulation to restrict robot motion.
            This ensures the manipulator does not enter unsafe regions.
          `,
      videoSrc: safetyConstraintsVid,
      videoPoster: safetyConstraintsPoster,
    },
    {
      desc: `
            Path Planning and Execution:
            The puck’s predicted (x, y) coordinates are mapped into the robot’s workspace.
            Smooth trajectories are generated using MoveIt’s Cartesian path planner.
          `,
    },
    {
      desc: `
          Reset Mechanism:
          After each interception attempt, the robot returns to a neutral “home” position to await the next shot.
          `,
    },
  ];

  return (
    <Process
      desc="ROS and MoveIt form the backbone of the robot’s control system. The
        puck’s predicted position is translated into robot actions:"
      steps={steps}
    />
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
      id: "computerVision",
      label: "Computer Vision",
      children: <ComputerVision />,
    },
    {
      id: "trajectoryPrediction",
      label: "Trajectory Prediction",
      children: <TrajectoryPrediction />,
    },
    {
      id: "motionControlWithROS",
      label: "Motion Control with ROS",
      children: <MotionControlWithROS />,
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
