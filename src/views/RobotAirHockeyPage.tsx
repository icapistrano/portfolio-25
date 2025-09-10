import { FC } from "react";
import bounceFig from "../assets/images/airHockey/bounceFig.png";
import demo from "../assets/images/airHockey/demo.mp4";
import { ProjectContent, SectionItem } from "../components/ProjectContent";
import { ContactSection } from "./ContactSection";

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

    <details>
      <summary className="hover:cursor-pointer select-none">
        Computer Vision
      </summary>
      <section className="mb-2">
        <ul className="list-disc pl-6 space-y-1 mt-1">
          <li>
            Perspective Transformation: The camera feed is warped into a flat,
            top-down perspective where each pixel corresponds to a physical
            dimension (≈1 cm in real life). This ensures consistent localisation
            of the puck regardless of camera angle.
          </li>
          <li>
            Color Segmentation: HSV thresholding isolates the puck
            (experimentally tuned for green in this implementation). A binary
            mask is generated, highlighting puck candidates in the frame.
          </li>
          <li>
            Contour Detection: The largest detected contour is assumed to be the
            puck. The puck’s centroid is calculated using bounding box
            coordinates.
          </li>
        </ul>
      </section>
    </details>

    <details>
      <summary className="hover:cursor-pointer select-none">
        Trajectory Prediction
      </summary>
      <section className="mb-2">
        <ul className="list-disc pl-6 space-y-1 mt-1">
          <li>
            Linear Regression (Best-Fit Line): A slope and intercept are
            computed from the puck’s recent positions using a line-of-best-fit
            algorithm. This provides an estimate of the puck’s linear path.
          </li>
          <li>
            Bounce Prediction: If the predicted path crosses the table
            boundaries, a bounce trajectory is calculated by mirroring the slope
            against the table edges. This allows the robot to anticipate not
            only direct shots but also banked shots.
          </li>
          <li>
            Noise Filtering: A buffer of 5 frames is used to confirm motion
            direction and reduce jitter from detection noise.
          </li>
        </ul>

        <img className="my-4" src={bounceFig}></img>
      </section>
    </details>

    <details>
      <summary className="hover:cursor-pointer select-none">
        Motion Control with ROS
      </summary>
      <section>
        <ul className="list-disc pl-6 space-y-1 mt-1">
          <li>
            Forward and Inverse Kinematics: Forward kinematics aligns the end
            effector (EEF) with the table surface. Inverse kinematics computes
            Cartesian waypoints for the robot’s striker movement.
          </li>
          <li>
            Path Planning and Execution: The puck’s predicted (x, y) coordinates
            are mapped into the robot’s workspace. Smooth trajectories are
            generated using MoveIt’s Cartesian path planner.
          </li>
          <li>
            Safety Constraints: Virtual collision objects (walls and table) are
            added in simulation to restrict robot motion. This ensures the
            manipulator does not enter unsafe regions.
          </li>
          <li>
            Reset Mechanism: After each interception attempt, the robot returns
            to a neutral “home” position to await the next shot.
          </li>
        </ul>
      </section>
    </details>
  </section>
);

const Demo = () => (
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
);

export const RobotAirHockeyPage: FC = () => {
  const sectionItems: SectionItem[] = [
    {
      id: "overview",
      label: "Overview",
      children: <Overview />,
    },
    {
      id: "demo",
      label: "Demo",
      children: <Demo />,
    },
  ];

  return (
    <>
      <ProjectContent sections={sectionItems} />
      <ContactSection />
    </>
  );
};
