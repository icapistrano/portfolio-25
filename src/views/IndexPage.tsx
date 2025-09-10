import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { LandingSection } from "./LandingSection";
import { WorkSection } from "./WorkSection";

export const IndexPage = () => {
  return (
    <div className="flex flex-col gap-0.5">
      <LandingSection />
      <WorkSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};
