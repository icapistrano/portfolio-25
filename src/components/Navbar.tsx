import { useEffect, useRef } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./Button";

export const Navbar = () => {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const navItems = ["Index", "Work", "About"];
  const behaviorRef = useRef<ScrollBehavior>("smooth");

  const scrollToSection = (id: string) => {
    const sectionId = id.toLowerCase();
    behaviorRef.current = pathname === "/" ? "smooth" : "instant";

    navigate(`/#${sectionId}`);
  };

  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1)); // "#work" -> "work"
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: behaviorRef.current });
  }, [pathname, hash]);

  return (
    <div className="z-50 fixed top-0 w-full py-0 border-b border-grey bg-dark h-[var(--nav-h)]">
      <div className="flex flex-row gap-10 justify-center mx-auto px-6 items-center container h-full">
        {navItems.map((item) => (
          <div
            key={item}
            className="
              relative cursor-pointer 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 
              hover:after:w-full
            "
            onClick={() => scrollToSection(item)}
          >
            {item}
          </div>
        ))}

        <Button>
          <div className="flex flex-row gap-1 items-center py-1 px-3">
            <div>Resume</div>
            <IconArrowUpRight size={20} />
          </div>
        </Button>
      </div>
    </div>
  );
};
