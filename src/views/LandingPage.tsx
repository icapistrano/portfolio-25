import { Container } from "../components/Container";
import BlobNoiseScene from "../components/r3f/Blob";

export const LandingPage: React.FC = () => {
  return (
    <div id="index" className="h-screen flex flex-col justify-end">
      <div className="absolute h-full w-full left-0 top-0 opacity-100 z-30">
        <BlobNoiseScene />
      </div>
      <Container>
        <div className="flex flex-col px-40">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-primary text-9xl text-primary/90 z-20">
            <h2 className="text-center text-9xl font-primary">
              Immanuel <span className="font-accent text-[190px] mr-2">C</span>
              apistrano
            </h2>
          </div>
          <div className="w-1/3 font-primary font-thin text-xl z-20">
            <p className="mb-4 z-20">
              Frontend Engineer with 5 years experience of creating immersive
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
