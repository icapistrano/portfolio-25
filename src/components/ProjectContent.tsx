import classNames from "classnames";
import { FC, ReactNode } from "react";
import { useTopOffsetPx } from "../hooks/useTopOffsetPx";
import { useActiveSection } from "../hooks/useActiveSection";
import { Container } from "./Container";

export type SectionItem = {
  id: string;
  label: ReactNode;
  children: ReactNode;
};

export const ProjectNavigation: FC<{
  sections: SectionItem[];
  activeSectionId: string | null;
}> = ({ sections, activeSectionId }) => {
  const onClick = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <ul className="space-y-1">
        {sections.map((s) => (
          <li
            key={s.id}
            onClick={() => onClick(s.id)}
            className={classNames(
              "block px-3 py-2 text-sm transition hover:bg-primary/10 rounded-md cursor-pointer",
              {
                "bg-primary/10 font-medium": activeSectionId === s.id,
              },
            )}
          >
            {s.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const ProjectSection: FC<{
  section: SectionItem;
  topPx: number;
}> = ({ section, topPx }) => (
  <section
    id={section.id}
    className="mb-8 lg:mb-12 font-primary"
    style={{ scrollMarginTop: topPx }}
    data-section="section"
  >
    <h2 className="text-xl lg:text-2xl font-semibold mb-3">{section.label}</h2>
    <div className="max-w-none">{section.children}</div>
  </section>
);

export const ProjectContent: FC<{ sections: SectionItem[] }> = ({
  sections,
}) => {
  const topPx = useTopOffsetPx(); // navbar height + cushion
  const activeId = useActiveSection(
    sections.map((s) => s.id),
    topPx,
  );

  return (
    <Container>
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left sidebar */}
        <aside
          className="col-span-12 lg:col-span-3 mb-8 lg:mb-0 sticky self-start overflow-y-auto pr-2"
          style={{ top: topPx }}
        >
          <ProjectNavigation sections={sections} activeSectionId={activeId} />
        </aside>

        {/* Right content */}
        <main className="lg:col-span-9 mt-[var(--cushion)]">
          {sections.map((section) => (
            <ProjectSection key={section.id} section={section} topPx={topPx} />
          ))}
        </main>
      </div>

      {/* Show debugger for intersection observer */}
      {/* <IODebugLine topPx={topPx} /> */}
    </Container>
  );
};
