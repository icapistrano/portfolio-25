import classNames from "classnames";
import { FC, ReactNode } from "react";

export const Button: FC<{
  children: ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
}> = ({ children, isDisabled = false, onClick }) => {
  return (
    <button
      className={classNames(
        "bg-accent p-0.5 rounded-full h-fit flex justify-center items-center",
        {
          "opacity-50 cursor-not-allowed": isDisabled,
        },
      )}
      onClick={onClick}
      disabled={isDisabled}
    >
      <span
        className="bg-accent rounded-full
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]
              hover:shadow-[inset_0_-1px_2px_rgba(255,255,255,0.5)]
              transition-shadow duration-500 ease-in"
      >
        {children}
      </span>
    </button>
  );
};
