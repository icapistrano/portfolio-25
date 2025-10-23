import { useEffect } from "react";
import { Container } from "../components/Container";
import { ContactSection } from "./ContactSection";
import shuffleboard from "./../assets/images/shuffleboard.jpg";
import robotAirhockey from "./../assets/images/robotAirHockey.gif";
import holographicRobot from "./../assets/images/holographic-robot.png";
import valentine from "./../assets/images/valentine.png";
import { ProjectThumbnail } from "../components/ProjectThumbnail";
import { TextWithAccent } from "../components/TextWithAccent";

export const ProjectsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <Container className="mt-20">
        <TextWithAccent
          name="A curated collection of my Work"
          accentIndex={27}
          textSizes="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          accentPadding="mr-2"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-20">
          <ProjectThumbnail
            title="Interactive Shuffleboard"
            image={shuffleboard}
            url="interactive-shuffleboard"
            buttonText="View work"
          />

          <ProjectThumbnail
            title="Robotic Air-hockey System"
            image={robotAirhockey}
            url="robot-air-hockey"
            buttonText="View work"
          />

          <ProjectThumbnail
            title="Holographic Robot"
            image={holographicRobot}
            url="holographic-robot"
            buttonText="View demo"
          />

          <ProjectThumbnail
            title="Valentine Letter"
            image={valentine}
            url="valentine"
            buttonText="View demo"
          />
        </div>
      </Container>
      <ContactSection />
    </>
  );
};
