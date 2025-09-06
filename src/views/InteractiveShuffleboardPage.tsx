import { Container } from "../components/Container";

import { FC, ReactNode, useEffect, useState } from "react";
import towerStackVideo from "../assets/images/interactiveShuffleboard/towerstack.mp4";

const CUSHION_FALLBACK = 20; // px

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "role-responsibilities", label: "Role & Responsibilities" },
  { id: "how-it-works", label: "How it works" },
  { id: "game-modes", label: "Game Modes" },
  { id: "challenges", label: "Challenges" },
  { id: "results", label: "Results & Learnings" },
];

const readVarPx = (name: string) =>
  parseInt(getComputedStyle(document.documentElement).getPropertyValue(name)) ||
  0;

function useTopOffsetPx() {
  const read = () => {
    const navH = readVarPx("--nav-h");
    const cushion = readVarPx("--cushion") || CUSHION_FALLBACK;
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
}

function useActiveSectionBySentinel(ids: string[], topPx: number) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const LINE_HEIGHT = 2; // px; make 4–8px while debugging if you want
    // Build an observer whose band is a thin line at topPx
    const buildObserver = () => {
      const bottomPx = Math.max(0, window.innerHeight - (topPx + LINE_HEIGHT));
      const opts = {
        root: null,
        rootMargin: `-${topPx}px 0px -${bottomPx}px 0px`,
        threshold: 0,
      } as const;

      const obs = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const section = (e.target as HTMLElement).closest("section");
            if (section?.id) setActive(section.id);
          }
        }
      }, opts);

      // Observe each section's sentinel
      const sentinels: HTMLElement[] = [];
      ids.forEach((id) => {
        const sec = document.getElementById(id);
        const sent = sec?.querySelector(
          '[data-sentinel="top"]',
        ) as HTMLElement | null;
        if (sent) {
          obs.observe(sent);
          sentinels.push(sent);
        }
      });

      // Return a disposer that unobserves everything
      return () => {
        sentinels.forEach((s) => obs.unobserve(s));
        obs.disconnect();
      };
    };

    let dispose = buildObserver();

    // Rebuild the observer on resize so the line stays the right size/position
    const onResize = () => {
      dispose();
      dispose = buildObserver();
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Initial highlight when at the very top
    if (window.scrollY <= 1) setActive(ids[0]);

    return () => {
      dispose();
      window.removeEventListener("resize", onResize);
    };
  }, [ids, topPx]);

  return active;
}

const Section: FC<{
  id: string;
  title: string;
  children: ReactNode;
  topPx: number;
}> = ({ id, title, children, topPx }) => (
  <section
    id={id}
    className="mb-12 lg:mb-16 font-primary"
    style={{ scrollMarginTop: topPx }} // anchors land below navbar + cushion
  >
    {/* 1px sentinel the observer watches */}
    <div data-sentinel="top" aria-hidden="true" className="h-px w-px" />

    <h2 className="text-xl lg:text-2xl font-semibold mb-3">{title}</h2>
    <div className="prose max-w-none">{children}</div>
  </section>
);

function IODebugLine({
  topPx,
  height = 2,
}: {
  topPx: number;
  height?: number;
}) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[60]"
      style={{ top: topPx - height / 2, height }}
    >
      <div className="h-full bg-fuchsia-500/60" />
    </div>
  );
}

export const InteractiveShuffleboardPage = () => {
  // In your component:
  const topPx = useTopOffsetPx();
  const active = useActiveSectionBySentinel(
    SECTIONS.map((s) => s.id),
    topPx,
  );

  return (
    <div className="scroll-smooth">
      {/* <IODebugLine topPx={topPx} /> */}

      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left: sidebar */}
          <aside
            className="col-span-12 lg:col-span-3 mb-8 lg:mb-0 sticky self-start overflow-y-auto pr-2"
            style={{
              top: topPx, // ✅ stick below nav + cushion
              // paddingTop: "var(--cushion, 20px)",
              height: `calc(100dvh - ${topPx}px)`, // optional but nice
            }}
          >
            <nav aria-label="On this page">
              <ul className="space-y-1">
                {SECTIONS.map((s) => {
                  const isActive = active === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "block rounded-md px-3 py-2 text-sm transition",
                          "hover:bg-primary/10",
                          isActive ? "bg-primary/10 font-medium" : "opacity-80",
                        ].join(" ")}
                      >
                        {s.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Right: content */}
          <main
            className="lg:col-span-9"
            style={{ marginTop: "var(--cushion, 20px)" }}
          >
            <Section id="overview" title="Overview" topPx={topPx}>
              <p className="">
                <span className="font-semibold">Interactive Shuffleboard </span>
                turns the classic game into a self-scoring experience with
                real-time puck detection and clear on-screen feedback. OpenCV
                (Python) localises pucks from a single camera, while an Electron
                frontend with Three.js renders interactive 3D visuals and
                supports multiple game modes.
              </p>
            </Section>
            <Section
              id="role-responsibilities"
              title="Role & Responsibilities"
              topPx={topPx}
            >
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Built the OpenCV pipeline and 1 cm/pixel calibration for
                  reliable puck localisation.
                </li>
                <li>
                  Designed a JSON event stream from Python to Electron;
                  implemented the consumer/router.
                </li>
                <li>
                  Implemented a pluggable rules engine powering multiple modes
                  (TowerStack, FieldRaid, Planet Odyssey).
                </li>
                <li>
                  Developed the Electron + Three.js UI with live 3D targets and
                  scoring effects.
                </li>
                <li>
                  Improved performance and stability with telemetry, a debug
                  overlay, and remote re-calibration.
                </li>
                <li>
                  {
                    "Maintained ~60 FPS with <50 ms capture-to-UI latency and ~95% detection accuracy."
                  }
                </li>
              </ul>

              {/* ... */}
            </Section>
            <Section id="how-it-works" title="How it works" topPx={topPx}>
              <p>
                Frames are processed in OpenCV to colour-segment pucks and
                extract contour centrepoints. A lightweight{" "}
                <em>game handler</em>
                (~30&nbsp;ms/tick) consumes those contours, maintains per-team
                “alive”/“dead” puck lists, and assigns contours to puck objects
                via nearest-neighbour matching to each puck’s last known
                position. New pucks are created when the current turn expects
                one; initial positions are chosen from <strong>
                  untaken
                </strong>{" "}
                contours to keep IDs stable. Each tick, the handler streams{" "}
                <code>TURN</code> and <code>POSITIONS</code> updates to the
                Electron UI and raises events for wrong turns, bad throws,
                collisions, and end-of-round.
              </p>

              <h3 className="mt-6">Key behaviours</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Contour → puck assignment:</strong> greedy
                  nearest-neighbour from prior positions with de-duplication
                  when two pucks contend for one contour.
                </li>
                <li>
                  <strong>Collision handling:</strong> for same-team overlaps,
                  the newer throw “wins”; the other puck is re-matched or marked{" "}
                  <em>dead</em> if no contour remains.
                </li>
                <li>
                  <strong>Turn management:</strong> tracks whose turn it is and
                  expected counts; only creates a new puck when the expected
                  throw appears.
                </li>
                <li>
                  <strong>Wrong-turn detection:</strong> sustained contour
                  increase from the non-active colour creates a flagged puck;
                  its position is sent as <code>[-1,-1]</code> so scoring
                  ignores it.
                </li>
                <li>
                  <strong>Dead/covered pucks:</strong> if a contour re-appears
                  near a dead puck’s last position, it’s resurrected and
                  tracking continues.
                </li>
                <li>
                  <strong>End-of-round:</strong> once all pucks are thrown, wait
                  a short stability window, then emit <code>END</code> with a
                  final <code>POSITIONS</code> snapshot.
                </li>
                <li>
                  <strong>Noise controls:</strong> distance/time thresholds
                  debounce jitter, handle brief occlusions, and prevent
                  duplicate assignments.
                </li>
              </ul>

              <h3 className="mt-6">Events sent to the UI</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <code>TURN</code> — e.g., <code>BLUE-2</code> or{" "}
                  <code>GREEN-3</code> (who plays next).
                </li>
                <li>
                  <code>POSITIONS</code> — current positions for the scoring
                  engine (first four pucks per team).
                </li>
                <li>
                  <code>BAD THROW</code> — a puck is declared dead immediately
                  after a failed shot.
                </li>
                <li>
                  <code>WRONG TURN</code> — a throw detected from the non-active
                  team.
                </li>
                <li>
                  <code>END</code> — round complete with final positions.
                </li>
              </ul>

              <h3 className="mt-6">Why this design</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Keeps <strong>IDs stable</strong> and scoring predictable
                  through occlusions and collisions.
                </li>
                <li>
                  Handles real-world edge cases (glare, coverage, simultaneous
                  shots) without manual intervention.
                </li>
                <li>
                  Delivers <strong>typed, low-latency events</strong> tailored
                  to gameplay rather than raw pixels.
                </li>
              </ul>
            </Section>
            <Section id="game-modes" title="Game Modes" topPx={topPx}>
              <section id="mode-towerstack" className="prose max-w-none">
                <h2 className="text-xl lg:text-2xl">TowerStack</h2>
                <p>
                  Players take turns sliding pucks as far down the table as
                  possible <strong>without going out of bounds</strong>. The
                  surface is divided into distance bands so progress is obvious
                  at a glance. After all throws, the team with the{" "}
                  <strong>greatest total in-bounds distance</strong> wins the
                  round.
                </p>

                <figure className="my-4">
                  <div className="not-prose overflow-hidden shadow">
                    <video
                      className="w-full h-auto"
                      src={towerStackVideo}
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                  <figcaption className="text-sm opacity-80 mt-2">
                    Real-time gameplay with puck localisation.
                  </figcaption>
                </figure>

                <h3 className="mt-6">How scoring works</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Each <strong>in-bounds</strong> puck scores its final
                    distance from the start line (calibrated cm).
                  </li>
                  <li>
                    <strong>Out-of-bounds</strong> pucks score{" "}
                    <strong>0</strong>.
                  </li>
                  <li>
                    Team score = sum of all in-bounds pucks for that round.
                  </li>
                  <li>
                    <strong>Tie-breakers:</strong> longest single puck wins; if
                    still tied, compare next longest, etc.
                  </li>
                </ul>
              </section>
            </Section>
            <Section id="challenges" title="Challenges" topPx={topPx}>
              {/* ... */}
              <div className="h-screen"></div>
            </Section>
            <Section id="results" title="Results & Learnings" topPx={topPx}>
              {/* ... */}
              <div className="h-screen"></div>
            </Section>
          </main>
        </div>
      </Container>
    </div>
  );
};

// import { FC, ReactNode, useEffect, useState } from "react";
// import { Container } from "../components/Container";
// import towerStackVideo from "../assets/images/interactiveShuffleboard/towerstack.mp4";

// const CUSHION = 20;

// const SECTIONS = [
//   { id: "overview", label: "Overview" },
//   { id: "role-responsibilities", label: "Role & Responsibilities" },
//   { id: "how-it-works", label: "How it works" },
//   { id: "game-modes", label: "Game Modes" },
//   { id: "challenges", label: "Challenges" },
//   { id: "results", label: "Results & Learnings" },
// ];

// function readVar(name: string) {
//   return (
//     parseInt(
//       getComputedStyle(document.documentElement).getPropertyValue(name),
//     ) || 0
//   );
// }

// function useTopOffsetPx() {
//   const read = () => readVar("--nav-h") + readVar("--cushion");
//   const [topPx, setTopPx] = useState(read);

//   useEffect(() => {
//     const onResize = () => setTopPx(read());
//     const mq = window.matchMedia("(min-width:1024px)");
//     window.addEventListener("resize", onResize);
//     mq.addEventListener("change", onResize);
//     onResize();
//     return () => {
//       window.removeEventListener("resize", onResize);
//       mq.removeEventListener("change", onResize);
//     };
//   }, []);

//   return topPx;
// }

// function useActiveSection(ids: string[]) {
//   const topPx = useTopOffsetPx();
//   const [active, setActive] = useState(ids[0]);

//   useEffect(() => {
//     const BAND = 40; // % band height
//     const opts = {
//       root: null,
//       rootMargin: `-${topPx}px 0px -${100 - BAND}% 0px`,
//       threshold: 0,
//     } as const;

//     const observer = new IntersectionObserver((entries) => {
//       const first = entries
//         .filter((e) => e.isIntersecting)
//         .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
//       if (first) setActive((first.target as HTMLElement).id);
//     }, opts);

//     const els = ids
//       .map((id) => document.getElementById(id))
//       .filter(Boolean) as HTMLElement[];
//     els.forEach((el) => observer.observe(el));
//     if (window.scrollY <= 1) setActive(ids[0]);
//     return () => observer.disconnect();
//   }, [ids, topPx]);

//   return active;
// }

// function IODebugBand() {
//   const topPx = useTopOffsetPx();
//   const [h, setH] = useState(0);
//   useEffect(() => {
//     const BAND = 40;
//     const compute = () =>
//       setH(Math.max(0, (window.innerHeight * BAND) / 100 - topPx));
//     compute();
//     window.addEventListener("resize", compute);
//     return () => window.removeEventListener("resize", compute);
//   }, [topPx]);
//   return (
//     <div
//       className="pointer-events-none fixed inset-x-0 z-[60]"
//       style={{ top: topPx, height: h }}
//     >
//       <div className="h-full bg-fuchsia-500/10 border-y border-fuchsia-500" />
//     </div>
//   );
// }

// const Section: FC<{ id: string; title: string; children: ReactNode }> = ({
//   id,
//   title,
//   children,
// }) => (
//   <section id={id} className="scroll-mt-48 mb-12 lg:mb-16 font-primary">
//     <h2 className="text-xl lg:text-2xl font-semibold mb-3">{title}</h2>
//     <div className="prose max-w-none">{children}</div>
//   </section>
// );

// export const InteractiveShuffleboardPage = () => {
//   const active = useActiveSection(SECTIONS.map((s) => s.id));

//   return (
//     // Smooth anchor scrolling; ensure ancestors of <aside> do NOT have overflow hidden.
//     <div className="scroll-smooth">
//       <IODebugBand />

//       <Container>
//         {/* Split layout */}
//         <div className={`lg:grid lg:grid-cols-12 lg:gap-8`}>
//           {/* Left: sidebar */}
//           <aside
//             className={`
//               col-span-12 lg:col-span-3
//               mb-8 lg:mb-0
//               sticky top-24 self-start
//                overflow-y-auto
//               pr-2 pt-[var(--cushion)]
//             `}
//           >
//             <nav aria-label="On this page">
//               <ul className="space-y-1">
//                 {SECTIONS.map((s) => {
//                   const isActive = active === s.id;
//                   return (
//                     <li key={s.id}>
//                       <a
//                         href={`#${s.id}`}
//                         aria-current={isActive ? "page" : undefined}
//                         className={[
//                           "block rounded-md px-3 py-2 text-sm transition",
//                           "hover:bg-primary/10",
//                           isActive ? "bg-primary/10 font-medium" : "opacity-80",
//                         ].join(" ")}
//                       >
//                         {s.label}
//                       </a>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </nav>
//           </aside>

//           {/* Right: content */}
//           <main className={`lg:col-span-9 pt-[var(--cushion)]`}>
//             <Section id="overview" title="Overview">
//               <p className="">
//                 <span className="font-semibold">Interactive Shuffleboard </span>
//                 turns the classic game into a self-scoring experience with
//                 real-time puck detection and clear on-screen feedback. OpenCV
//                 (Python) localises pucks from a single camera, while an Electron
//                 frontend with Three.js renders interactive 3D visuals and
//                 supports multiple game modes.
//               </p>
//             </Section>

//             <Section id="role-responsibilities" title="Role & Responsibilities">
//               <ul className="list-disc pl-6 space-y-2">
//                 <li>
//                   Built the OpenCV pipeline and 1 cm/pixel calibration for
//                   reliable puck localisation.
//                 </li>
//                 <li>
//                   Designed a JSON event stream from Python to Electron;
//                   implemented the consumer/router.
//                 </li>
//                 <li>
//                   Implemented a pluggable rules engine powering multiple modes
//                   (TowerStack, FieldRaid, Planet Odyssey).
//                 </li>
//                 <li>
//                   Developed the Electron + Three.js UI with live 3D targets and
//                   scoring effects.
//                 </li>
//                 <li>
//                   Improved performance and stability with telemetry, a debug
//                   overlay, and remote re-calibration.
//                 </li>
//                 <li>
//                   {
//                     "Maintained ~60 FPS with <50 ms capture-to-UI latency and ~95% detection accuracy."
//                   }
//                 </li>
//               </ul>
//             </Section>

//             <Section id="how-it-works" title="How it works">
//               <p>
//                 Frames are processed in OpenCV to colour-segment pucks and
//                 extract contour centrepoints. A lightweight{" "}
//                 <em>game handler</em>
//                 (~30&nbsp;ms/tick) consumes those contours, maintains per-team
//                 “alive”/“dead” puck lists, and assigns contours to puck objects
//                 via nearest-neighbour matching to each puck’s last known
//                 position. New pucks are created when the current turn expects
//                 one; initial positions are chosen from <strong>
//                   untaken
//                 </strong>{" "}
//                 contours to keep IDs stable. Each tick, the handler streams{" "}
//                 <code>TURN</code> and <code>POSITIONS</code> updates to the
//                 Electron UI and raises events for wrong turns, bad throws,
//                 collisions, and end-of-round.
//               </p>

//               <h3 className="mt-6">Key behaviours</h3>
//               <ul className="list-disc pl-6 space-y-2">
//                 <li>
//                   <strong>Contour → puck assignment:</strong> greedy
//                   nearest-neighbour from prior positions with de-duplication
//                   when two pucks contend for one contour.
//                 </li>
//                 <li>
//                   <strong>Collision handling:</strong> for same-team overlaps,
//                   the newer throw “wins”; the other puck is re-matched or marked{" "}
//                   <em>dead</em> if no contour remains.
//                 </li>
//                 <li>
//                   <strong>Turn management:</strong> tracks whose turn it is and
//                   expected counts; only creates a new puck when the expected
//                   throw appears.
//                 </li>
//                 <li>
//                   <strong>Wrong-turn detection:</strong> sustained contour
//                   increase from the non-active colour creates a flagged puck;
//                   its position is sent as <code>[-1,-1]</code> so scoring
//                   ignores it.
//                 </li>
//                 <li>
//                   <strong>Dead/covered pucks:</strong> if a contour re-appears
//                   near a dead puck’s last position, it’s resurrected and
//                   tracking continues.
//                 </li>
//                 <li>
//                   <strong>End-of-round:</strong> once all pucks are thrown, wait
//                   a short stability window, then emit <code>END</code> with a
//                   final <code>POSITIONS</code> snapshot.
//                 </li>
//                 <li>
//                   <strong>Noise controls:</strong> distance/time thresholds
//                   debounce jitter, handle brief occlusions, and prevent
//                   duplicate assignments.
//                 </li>
//               </ul>

//               <h3 className="mt-6">Events sent to the UI</h3>
//               <ul className="list-disc pl-6 space-y-2">
//                 <li>
//                   <code>TURN</code> — e.g., <code>BLUE-2</code> or{" "}
//                   <code>GREEN-3</code> (who plays next).
//                 </li>
//                 <li>
//                   <code>POSITIONS</code> — current positions for the scoring
//                   engine (first four pucks per team).
//                 </li>
//                 <li>
//                   <code>BAD THROW</code> — a puck is declared dead immediately
//                   after a failed shot.
//                 </li>
//                 <li>
//                   <code>WRONG TURN</code> — a throw detected from the non-active
//                   team.
//                 </li>
//                 <li>
//                   <code>END</code> — round complete with final positions.
//                 </li>
//               </ul>

//               <h3 className="mt-6">Why this design</h3>
//               <ul className="list-disc pl-6 space-y-2">
//                 <li>
//                   Keeps <strong>IDs stable</strong> and scoring predictable
//                   through occlusions and collisions.
//                 </li>
//                 <li>
//                   Handles real-world edge cases (glare, coverage, simultaneous
//                   shots) without manual intervention.
//                 </li>
//                 <li>
//                   Delivers <strong>typed, low-latency events</strong> tailored
//                   to gameplay rather than raw pixels.
//                 </li>
//               </ul>
//             </Section>

//             <Section id="game-modes" title="Game Modes">
//               <section id="mode-towerstack" className="prose max-w-none">
//                 <h2 className="text-xl lg:text-2xl">TowerStack</h2>
//                 <p>
//                   Players take turns sliding pucks as far down the table as
//                   possible <strong>without going out of bounds</strong>. The
//                   surface is divided into distance bands so progress is obvious
//                   at a glance. After all throws, the team with the{" "}
//                   <strong>greatest total in-bounds distance</strong> wins the
//                   round.
//                 </p>

//                 <figure className="my-4">
//                   <div className="not-prose overflow-hidden shadow">
//                     <video
//                       className="w-full h-auto"
//                       src={towerStackVideo}
//                       controls
//                       playsInline
//                       preload="metadata"
//                     />
//                   </div>
//                   <figcaption className="text-sm opacity-80 mt-2">
//                     Real-time gameplay with puck localisation.
//                   </figcaption>
//                 </figure>

//                 <h3 className="mt-6">How scoring works</h3>
//                 <ul className="list-disc pl-6 space-y-1">
//                   <li>
//                     Each <strong>in-bounds</strong> puck scores its final
//                     distance from the start line (calibrated cm).
//                   </li>
//                   <li>
//                     <strong>Out-of-bounds</strong> pucks score{" "}
//                     <strong>0</strong>.
//                   </li>
//                   <li>
//                     Team score = sum of all in-bounds pucks for that round.
//                   </li>
//                   <li>
//                     <strong>Tie-breakers:</strong> longest single puck wins; if
//                     still tied, compare next longest, etc.
//                   </li>
//                 </ul>
//               </section>
//             </Section>

//             <Section id="challenges" title="Challenges">
//               <ul className="list-disc pl-6 space-y-2">
//                 <li>
//                   Lighting variability and reflective surfaces on the board.
//                 </li>
//                 <li>
//                   Accurate world-to-pixel calibration and drift over time.
//                 </li>
//                 <li>
//                   Designing clear UI feedback to explain scoring decisions.
//                 </li>
//               </ul>
//             </Section>

//             <Section id="results" title="Results & Learnings">
//               <ul className="list-disc pl-6 space-y-2">
//                 <li>Reliable real-time detection at playable frame rates.</li>
//                 <li>
//                   Pluggable rules engine to add/modify game modes quickly.
//                 </li>
//                 <li>
//                   Improved calibration flow reduced setup time significantly.
//                 </li>
//               </ul>
//             </Section>
//           </main>
//         </div>
//       </Container>
//     </div>
//   );
// };
