import classNames from "classnames";
import { FC, HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  withNavOffset?: boolean;
} & HTMLAttributes<HTMLElement>;

export const Container: FC<Props> = ({
  children,
  className,
  withNavOffset = true,
  ...rest
}) => {
  return (
    <section
      className={classNames(
        "container mx-auto px-1 md:px-4 pb-20",
        withNavOffset && "pt-[var(--nav-h)]",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
};
