import { FC, useEffect, useMemo } from "react";
import { IconSparkles } from "@tabler/icons-react";
import { ProjectContent, SectionItem } from "../components/ProjectContent";
import towerStackVideo from "../assets/images/interactiveShuffleboard/towerstack.mp4";
import towerStackPoster from "../assets/images/interactiveShuffleboard/towerstack-poster.jpg";
import fieldRaidVideo from "../assets/images/interactiveShuffleboard/fieldraid.mp4";
import fieldRaidPoster from "../assets/images/interactiveShuffleboard/fieldraid-poster.jpg";
import planetOdysseyVideo from "../assets/images/interactiveShuffleboard/planetodyssey.mp4";
import planetOdysseyPoster from "../assets/images/interactiveShuffleboard/planetodyssey-poster.jpg";
import { ContactSection } from "./ContactSection";

const Overview: FC = () => {
  const events = [
    { event: "POSITIONS", desc: "positions of pucks" },
    { event: "TURN", desc: "turn of the next player" },
    { event: "BAD THROW", desc: "puck goes out of bounds" },
    {
      event: "WRONG THROW",
      desc: "a throw detected from the non-active team",
    },
    {
      event: "END",
      desc: "round complete with final positions",
    },
  ];
  return (
    <div className="flex flex-col space-y-2">
      <p>
        <span className="font-semibold text-accent/100 text-lg">
          Interactive Shuffleboard
        </span>{" "}
        is a modern twist on the pub classic, with automated scoring and
        real-time feedback. An OpenCV (Python) pipeline localises pucks from a
        single camera, whilst an Electron and Three.js UI renders responsive 3D
        visuals and supports multiple game modes.
      </p>

      <details>
        <summary className="hover:cursor-pointer select-none">
          Puck Localisation & Events
        </summary>
        <div className="mb-2 flex flex-col space-y-4">
          <p>
            OpenCV (Python) segments by colour, extracts puck contours, and
            emits their centre points each frame. A lightweight game handler
            consumes those points, maintains per-team alive/dead lists, and
            assigns contours to puck objects via nearest-neighbour matching from
            each puck’s last known position. On every tick, the handler streams
            updates to the Electron UI and raises events for wrong turns, bad
            throws, and end-of-round.
          </p>

          <div>
            <h3>Events sent to the UI</h3>
            <ul className="list-disc pl-6 space-y-1 mt-1">
              {events.map(({ event, desc }) => (
                <li key={`${event}-${desc}`}>
                  <code className="inline-flex items-center rounded px-2 py-0.5 font-mono text-sm bg-primary/10">
                    {event}
                  </code>{" "}
                  - {desc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>

      <details>
        <summary className="hover:cursor-pointer select-none">
          Electron & Three.js
        </summary>
        <section>
          <p>
            Electron ingests the Python/OpenCV JSON stream, validates and
            normalises events, and updates a UI store. It also manages app state
            and sessions (e.g., hour-long sessions with multiple rounds) and
            exposes features like team selection, camera snapshots (for
            photos/calibration), and remote recalibration. Three.js handles the
            rendering loop, reconciling the 3D scene graph each frame and
            interpolating between CV ticks for smooth animation.
          </p>
        </section>
      </details>
    </div>
  );
};

const RolesAndResponsibilities: FC = () => (
  <ul className="list-disc pl-6 space-y-2">
    <li>
      Built real-time 3D visuals driven by a typed event stream; deterministic
      updates tied to game state.
    </li>
    <li>
      Architected Three.js layer (scene graph, cameras, materials), reconciled
      with app state; event-driven render loop to avoid unnecessary frames.
    </li>
    <li>
      Integrated the Python/OpenCV feed into the Electron UI with a lightweight
      event consumer + router.
    </li>
    <li>
      Implemented a pluggable rules engine to support multiple modes
      (TowerStack, Field Raid, Planet Odyssey).
    </li>
    <li>
      Improved performance and stability with telemetry, a debug overlay, and
      remote recalibration.
    </li>
    <li>
      Maintained ~60&nbsp;FPS with &lt;50&nbsp;ms capture-to-UI latency and ~90%
      detection accuracy.
    </li>
  </ul>
);

const GameModes: FC = () => {
  const gameModes = [
    {
      title: "TowerStack",
      desc: `
        The table is split into 20 bands that map to a 20-block tower. Each
        valid throw fills the block corresponding to the band where the puck
        stops. After all throws, the team with the most coloured blocks wins.`,
      video: towerStackVideo,
      poster: towerStackPoster,
      caption:
        "Real-time gameplay of TowerStack with puck-localisation overlays (demo only).",
    },
    {
      title: "Field Raid",
      desc: `
        The table is split into a grid of cells used to measure territory. Each
        valid throw claims nearby cells by nearest-distance assignment; those
        cells are coloured for its team. After all throws, the team with the
        highest percentage of coloured cells wins.
      `,
      video: fieldRaidVideo,
      poster: fieldRaidPoster,
      caption:
        "Real-time gameplay of Field Raid with puck-localisation overlays (demo only).",
    },
    {
      title: "Planet Odyssey",
      desc: `
        The table features a circular mark mapped to a target. Each valid throw is 
        scored by its final distance to the target. After all throws, the team with the
        closest puck to the target wins.
      `,
      video: planetOdysseyVideo,
      poster: planetOdysseyPoster,
      caption:
        "Real-time gameplay of Planet Odyssey with puck-localisation overlays (demo only).",
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      {gameModes.map((gameMode) => (
        <section id={gameMode.title}>
          <h3 className="font-semibold">{gameMode.title}</h3>
          <p>{gameMode.desc}</p>
          <figure className="my-4">
            <div className="not-prose overflow-hidden">
              <video
                className="w-full h-auto"
                src={gameMode.video}
                controls
                playsInline
                preload="metadata"
                poster={gameMode.poster}
              />
            </div>
            <figcaption className="text-sm opacity-80 mt-2">
              {gameMode.caption}
            </figcaption>
          </figure>
        </section>
      ))}
    </div>
  );
};

export const InteractiveShuffleboardPage = () => {
  const sectionItems: SectionItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview", children: <Overview /> },
      {
        id: "role-responsibilities",
        label: "Role & Responsibilities",
        children: <RolesAndResponsibilities />,
      },
      {
        id: "game-modes",
        label: (
          <div className="flex items-center gap-2">
            Game modes <IconSparkles color="#0066FF" size={24} />
          </div>
        ),
        children: <GameModes />,
      },
    ];
  }, []);

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
