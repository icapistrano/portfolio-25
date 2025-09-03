import classNames from "classnames";
import { FC, HTMLAttributes, ReactNode } from "react";

export const Container: FC<
  {
    children: ReactNode;
    className?: string;
  } & HTMLAttributes<HTMLElement>
> = ({ children, className, ...rest }) => {
  return (
    <section
      className={classNames("container mx-auto pt-40 pb-20 px-4", className)}
      {...rest}
    >
      {children}
    </section>
  );
};
