import { useEffect, useRef, useState } from "react";
import { IconArrowUpRight, IconMenu2, IconX } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import classNames from "classnames";
import { useTopOffsetPx } from "../hooks/useTopOffsetPx";
import { useActiveSection } from "../hooks/useActiveSection";

const navItems = ["Index", "Work", "About"] as const;
type NavItem = (typeof navItems)[number]; // "Index" | "Work" | "About"
type SectionId = Lowercase<NavItem>; // "index" | "work" | "about"

export const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [indexSection, setIndexSection] = useState<SectionId | undefined>(
    "index",
  );
  const behaviorRef = useRef<ScrollBehavior>("smooth");

  const scrollToSection = (id: SectionId) => {
    if (pathname !== "/") {
      navigate("/");
    }

    setIndexSection(id);
    behaviorRef.current = "instant";
  };

  useEffect(() => {
    if (pathname !== "/" || indexSection === undefined) return;

    const section = document.getElementById(indexSection);
    section?.scrollIntoView({ behavior: behaviorRef.current });
    setIndexSection(undefined);
  }, [indexSection, pathname]);

  // ----- Mobile drawer state -----
  const [open, setOpen] = useState(false);

  // ----- Intersection -----
  const topPx = useTopOffsetPx();
  const activeId = useActiveSection(
    navItems.map((navId) => navId.toLowerCase()),
    topPx,
  );

  return (
    <div className="z-50 fixed top-0 w-full py-0 border-b border-grey bg-dark h-[var(--nav-h)]">
      <div className="container h-full mx-auto px-4">
        <nav
          className="flex items-center justify-between h-full"
          aria-label="Primary"
        >
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 w-full justify-center">
            {navItems.map((item) => {
              const id = item.toLowerCase() as SectionId;
              const isActive = pathname === "/" && id === activeId;
              return (
                <button
                  key={item}
                  onClick={() => scrollToSection(id)}
                  className={classNames(
                    "relative cursor-pointer px-1.5 py-1 outline-offset-2",
                    // underline base
                    "after:content-[''] after:absolute after:left-0 after:-bottom-0.5",
                    "after:h-[2px] after:bg-accent after:transition-[width] after:duration-300",
                    "motion-reduce:after:transition-none",
                    // active vs hover
                    isActive ? "after:w-full" : "after:w-0 hover:after:w-full",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item}
                </button>
              );
            })}

            <ResumeButton />
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex w-full justify-end">
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className={classNames(
                "relative p-3 -m-3 rounded-lg",
                "motion-safe:transition-transform motion-safe:duration-200 active:scale-95",
              )}
            >
              <span className="relative block h-6 w-6">
                {/* Menu icon */}
                <span
                  className={classNames(
                    "absolute inset-0",
                    "motion-safe:transition-all motion-safe:duration-200",
                    open
                      ? "opacity-0 scale-75 rotate-90"
                      : "opacity-100 scale-100 rotate-0",
                  )}
                >
                  <IconMenu2 size={24} />
                </span>

                {/* X icon */}
                <span
                  className={classNames(
                    "absolute inset-0",
                    "motion-safe:transition-all motion-safe:duration-200",
                    open
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-75 -rotate-90",
                  )}
                >
                  <IconX size={24} />
                </span>
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* SIMPLE RIGHT-TO-LEFT PANEL (0 -> full width) */}
      <div
        id="mobile-panel"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={classNames(
          "fixed right-0 top-[var(--nav-h)] md:hidden",
          "h-full overflow-y-auto",
          "duration-0 ease-out bg-dark",
          open ? "w-full" : "w-0",
        )}
      >
        <div className="flex flex-col gap-1 p-2 h-full items-end">
          {navItems.map((item) => {
            const id = item.toLowerCase() as SectionId;
            const active = indexSection === id && pathname === "/";
            return (
              <button
                key={item}
                onClick={() => {
                  scrollToSection(id);
                  setOpen(false); // close drawer if it’s open
                }}
                className={classNames("text-left rounded-xl px-4 py-4 text-lg")}
                aria-current={active ? "page" : undefined}
              >
                {item}
              </button>
            );
          })}

          <ResumeButton />
        </div>
      </div>
    </div>
  );
};

const ResumeButton = () => (
  <Button>
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-row gap-1 items-center py-1 px-3"
    >
      <span>Resume</span>
      <IconArrowUpRight size={20} />
    </a>
  </Button>
);
