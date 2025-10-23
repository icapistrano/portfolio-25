import { FC } from "react";
import classNames from "classnames";

export const TextWithAccent: FC<{
  name: string;
  accentIndex: number;
  textSizes?: string;
  accentPadding?: string;
}> = ({
  name,
  accentIndex,
  textSizes = "text-5xl sm:text-6xl md:text-7xl xl:text-9xl",
  accentPadding,
}) => {
  const first = name.slice(0, accentIndex);
  const accent = name[accentIndex];
  const last = name.slice(accentIndex + 1);

  return (
    <h2
      className={classNames(
        "text-center font-secondary",
        "md:whitespace-nowrap",
        textSizes,
      )}
    >
      {first}
      <span className={classNames("font-accent text-[1.5em]", accentPadding)}>
        {accent}
      </span>
      {last}
    </h2>
  );
};
