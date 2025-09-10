import { FC } from "react";
import classNames from "classnames";
import { Button } from "./Button";
import { IconArrowRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export const ProjectThumbnail: FC<{
  title: string;
  image: string;
  desc: string;
  techStack: string[];
  isActive?: boolean;
  url: string;
}> = ({ title, techStack, image, desc, isActive = true, url }) => {
  const navigate = useNavigate();

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
        <div className="flex items-end mt-4 md:mt-0 justify-end md:justify-between">
          <ul className="flex gap-2 text-xs mt-6 hidden md:flex">
            {techStack.map((tag) => (
              <li
                key={`${title}-${tag}`}
                className="border border-grey rounded-full px-4 py-1 font-regular text-primary/50"
              >
                {tag}
              </li>
            ))}
          </ul>

          <Button onClick={() => navigate(url)}>
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
