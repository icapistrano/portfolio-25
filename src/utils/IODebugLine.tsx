import { FC } from "react";

export const IODebugLine: FC<{
  topPx: number;
  height?: number;
}> = ({ topPx, height = 2 }) => {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[60]"
      style={{ top: topPx - height / 2, height }}
    >
      <div className="h-full bg-fuchsia-500/60" />
    </div>
  );
};
