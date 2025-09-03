import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "./Button";

export const Navbar = () => {
  const navItems = ["Index", "Work", "About", "Contact"];

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="z-50 fixed top-0 w-full py-0 border-b border-grey bg-dark">
      <div className="flex flex-row gap-10 justify-center mx-auto px-6 py-5 items-center container">
        {navItems.map((item) => (
          <div
            key={item}
            className="
              relative cursor-pointer 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 
              hover:after:w-full
            "
            onClick={() => scrollToSection(item.toLowerCase())}
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

export const Navbar1 = () => {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    console.log(section);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="z-50 fixed top-0 w-full py-0 border-b border-grey bg-dark">
      <div className="flex flex-row gap-10 justify-center mx-auto px-6 py-4 items-center container">
        <div onClick={() => scrollToSection("index")}>Index</div>
        <div onClick={() => scrollToSection("work")}>Work</div>
        <div onClick={() => scrollToSection("about")}>About</div>
        <div onClick={() => scrollToSection("contact")}>Contact</div>
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
