import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { LandingSection } from "./LandingSection";
import { WorkSection } from "./WorkSection";

export const IndexPage = () => {
  return (
    <>
      <LandingSection />
      <WorkSection />
      <AboutSection />
      <ContactSection />
    </>
  );
};
