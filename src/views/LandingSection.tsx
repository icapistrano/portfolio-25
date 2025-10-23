import { Container } from "../components/Container";
import BlobNoiseScene from "../components/r3f/Blob";
import { TextWithAccent } from "../components/TextWithAccent";

export const LandingSection: React.FC = () => {
  return (
    <div id="index" className="h-screen flex flex-col justify-end">
      <div className="absolute h-full w-full left-0 top-0 opacity-100 z-30">
        <BlobNoiseScene />
      </div>
      <Container>
        <div className="flex flex-col h-full justify-end w-full lg:px-40">
          {/* Name / Hero */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-primary text-primary/90 z-20 px-4">
            <TextWithAccent
              name="Immanuel Capistrano"
              accentIndex={9}
              accentPadding="mr-1"
            />
          </div>

          <div className="lg:w-1/3 font-primary font-thin md:text-xl z-20">
            <p className="mb-4 z-20">
              Frontend Engineer with 6 years experience of creating immersive
              and interactive experiences.
            </p>
            <p>
              📍 Currently @ Oxa, building 3D web mapping tools for self-driving
              cars.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};
