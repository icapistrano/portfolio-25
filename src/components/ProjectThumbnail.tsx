import { FC, ReactNode, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import classNames from "classnames";
import { Button } from "./Button";
import { IconArrowRight } from "@tabler/icons-react";

export const AnimatedProjectItem: FC<{
  side: "left" | "right";
  children: React.ReactNode;
}> = ({ side, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center 100%", "center 70%"],
  });

  // Scroll-driven
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <motion.div
      ref={ref}
      style={
        prefersReduced
          ? undefined
          : {
              opacity,
            }
      }
      transition={{ type: "tween", stiffness: 180, damping: 16, mass: 0.6 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export const ProjectThumbnail: FC<{
  title: string;
  image: string;
  desc: string;
  techStack: string[];
  isActive?: boolean;
}> = ({ title, techStack, image, desc, isActive = true }) => {
  return (
    <div
      className={classNames(
        "bg-dark  w-full overflow-hidden bg-cover p-4 border rounded-xl border-grey/50 flex flex-col gap-4 duration-700",
        {
          "opacity-100": isActive,
          "opacity-70": !isActive,
        },
      )}
    >
      <div
        className="rounded-lg bg-dark aspect-video w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="flex flex-col">
        <h2 className="font-primary text-xl font-regular mb-1">{title}</h2>
        <p className="font-thin text-md text-primary/50">{desc}</p>
        <div className="flex justify-between items-end">
          <ul className="flex gap-2 text-xs mt-6">
            {techStack.map((tag) => (
              <li className="border border-grey rounded-full px-4 py-1 font-regular text-primary/50">
                {tag}
              </li>
            ))}
          </ul>

          <Button>
            <div className="flex flex-row gap-1 items-center py-1 px-3">
              <h3 className="text-sm">View work</h3>
              <IconArrowRight size={18} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
