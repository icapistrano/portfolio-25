import { FC, ReactNode } from "react";

export const Button: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div className="bg-accent p-0.5 rounded-full h-full flex justify-center items-center">
      <button
        className="bg-accent rounded-full
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]
              hover:shadow-[inset_0_-1px_2px_rgba(255,255,255,0.5)]
              transition-shadow duration-500 ease-in"
      >
        {children}
      </button>
    </div>
  );
};
