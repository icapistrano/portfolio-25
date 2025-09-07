import { Container } from "../components/Container";
import { HighlightTextOnScroll } from "../components/HighlightTextOnScroll";

export const AboutSection = () => {
  const summary = [
    "Frontend Engineer",
    "Specialises in UI/UX, 3D, Data Viz",
    "Likes arts, interiors & simple design",
  ];

  return (
    <Container
      id="about"
      className="text-4xl font-primary font-thin border-t border-grey border-dashed"
    >
      <div className="pt-[var(--cushion)]">
        <HighlightTextOnScroll
          className="flex lg:mx-40 flex-col gap-10"
          paragraphs={[
            `Hello World — I’m Immanuel, a UK-based Frontend Engineer with 6 years of 
            experience at the intersection of design and technology.I specialise in 
            creating immersive, interactive experiences with a strong emphasis on 
            UI/UX design and 3D development.`,
            `Over the years, I’ve worked within startups to bridge the gap between
            complex real-time data and intuitive, visually engaging interfaces.
            My focus is on transforming intricate systems into seamless user
            experiences — whether through 3D interactions, refined user flows,
            or interfaces that handle dynamic data — always aiming to bring clarity 
            and elegance through design.`,
            `Beyond the screen, I draw inspiration from the world around me — art,
            interior spaces, well-crafted products, and the simplicity of everyday
            design done thoughtfully.`,
          ]}
        />

        <div className="lg:mx-40 py-4 border-l-4 border-accent mt-20">
          <div className="flex flex-col ml-4 gap-2">
            <p className="text-accent font-light">TL;DR</p>
            <ul className="flex flex-col gap-1 mt-2">
              {summary.map((text) => (
                <span key={text} className="text-2xl block">
                  {text}
                </span>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};
