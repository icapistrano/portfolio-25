import { Navbar } from "./components/Navbar";
import { LandingPage } from "./views/LandingPage";
import { AboutPage } from "./views/AboutPage";
import { WorkPage } from "./views/WorkPage";
import { ContactPage } from "./views/ContactPage";
import pattern from "../src/assets/images/gridPattern.png";

function App() {
  return (
    <div className="h-vh w-full text-primary font-primary text-lg font-light overflow-hidden bg-opacity-10">
      <Navbar />
      <LandingPage />
      <WorkPage />
      <AboutPage />
      <ContactPage />
      <PageSideBorder />
    </div>
  );
}

// PageSideBorder.tsx
export const PageSideBorder: React.FC<{}> = () => {
  return (
    <div className="pointer-events-none fixed inset-0">
      {/* This inner container matches your page width & padding */}
      <div className="h-full container mx-auto border-grey/80 px-4 border-x border-dashed" />
    </div>
  );
};

export default App;
