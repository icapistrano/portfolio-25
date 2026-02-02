import { FC } from "react";
import classNames from "classnames";
import { Button } from "./Button";
import { IconArrowRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export const ProjectThumbnail: FC<{
  image: string;
  title: string;
  url?: string;
  buttonText?: string;
  desc?: string;
  techStack?: string[];
  isExternal?: boolean;
}> = ({
  image,
  title,
  url,
  buttonText,
  desc,
  techStack,
  isExternal = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-dark w-full overflow-hidden bg-cover p-4 border rounded-xl border-grey/50 flex flex-col gap-4 duration-700">
      <div
        className="rounded-lg bg-dark aspect-video w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div
        className={classNames("flex", {
          "flex-row justify-between md:items-center": !desc,
          "flex-col": desc,
        })}
      >
        <h2 className="font-primary text-xl font-regular mb-1 truncate">
          {title}
        </h2>
        {desc && <p className="font-thin text-md text-primary/50">{desc}</p>}
        <div className="flex items-end justify-end md:justify-between">
          {techStack && (
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
          )}

          <Button
            onClick={!isExternal && url ? () => navigate(url) : undefined}
            isDisabled={!Boolean(url)}
          >
            {isExternal ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-row gap-1 items-center py-1 px-3"
              >
                {buttonText && (
                  <h3 className="text-sm truncate">{buttonText}</h3>
                )}
                <IconArrowRight size={18} />
              </a>
            ) : (
              <div className="flex flex-row gap-1 items-center py-1 px-3">
                {buttonText && (
                  <h3 className="text-sm truncate">{buttonText}</h3>
                )}
                <IconArrowRight size={18} />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
