import React, { FC, ReactNode, useRef, useLayoutEffect } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

type RigidOutlineButtonProps = {
  children: ReactNode;
  /** The relatively-positioned play area */
  containerRef: React.RefObject<HTMLElement>;
  /** Visual size of the pill (used to compute inertia) */
  width?: number; // px
  height?: number; // px
  /** Physics params */
  mass?: number; // kg-ish
  stiffness?: number; // N/m (spring to pointer)
  damping?: number; // N·s/m (spring damper)
  linearDamping?: number; // 1/s (air drag)
  angularDamping?: number; // 1/s (rotational drag)
};

export const OutlineButtonRigid: FC<RigidOutlineButtonProps> = ({
  children,
  containerRef,
  width = 20,
  height = 56,
  mass = 20,
  stiffness = 2500,
  damping = 195,
  linearDamping = 2.2,
  angularDamping = 3.5,
}) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  // Pose
  const x = useMotionValue(0); // px, relative to centered origin
  const y = useMotionValue(0);
  const rot = useMotionValue(0); // deg

  // Velocities (kept outside MotionValue for control)
  const vx = useRef(0);
  const vy = useRef(0);
  const omega = useRef(0); // rad/s

  // Grab state
  const dragging = useRef(false);
  const pointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // in container space
  const rLocal = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // grab point in body-local space

  // Precompute rectangular moment of inertia: I = (1/12) m (w^2 + h^2)
  const I = (mass * (width * width + height * height)) / 12;

  // Center at container middle on mount
  useLayoutEffect(() => {
    const placeCenter = () => {
      x.set(0);
      y.set(0);
      rot.set(0);
      vx.current = 0;
      vy.current = 0;
      omega.current = 0;
    };
    placeCenter();
  }, [x, y, rot]);

  // Helpers
  const getContainerRect = () =>
    containerRef.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
  const getCenterWorld = () => {
    // Our element is absolutely centered via CSS; x/y are offsets from container center.
    const c = getContainerRect();
    return {
      x: c.left + c.width / 2 + x.get(),
      y: c.top + c.height / 2 + y.get(),
    };
  };

  const toLocal = (dx: number, dy: number, theta: number) => {
    // world -> local (inverse rotation)
    const ct = Math.cos(theta),
      st = Math.sin(theta);
    return { x: dx * ct + dy * st, y: -dx * st + dy * ct };
  };
  const toWorld = (lx: number, ly: number, theta: number) => {
    // local -> world
    const ct = Math.cos(theta),
      st = Math.sin(theta);
    return { x: lx * ct - ly * st, y: lx * st + ly * ct };
  };

  // Pointer handlers (manual, not using drag API)
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const c = getContainerRect();
    pointer.current = { x: e.clientX - c.left, y: e.clientY - c.top };

    const center = getCenterWorld();
    const dx = e.clientX - center.x;
    const dy = e.clientY - center.y;
    const theta = (rot.get() * Math.PI) / 180;
    // Store grab vector in body-local space
    rLocal.current = toLocal(dx, dy, theta);

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging.current) return;
    const c = getContainerRect();
    pointer.current = { x: e.clientX - c.left, y: e.clientY - c.top };
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Physics integration loop
  useAnimationFrame((_t, deltaMs) => {
    const dt = Math.min(32, deltaMs) / 1000; // clamp big frames

    // Current pose
    const theta = (rot.get() * Math.PI) / 180;
    const center = getCenterWorld();

    // World-space grab point on body
    const rW = toWorld(rLocal.current.x, rLocal.current.y, theta);
    const pBody = { x: center.x + rW.x, y: center.y + rW.y };

    // Velocity of that body point: v + ω × r
    const vBody = {
      x: vx.current + -omega.current * rW.y,
      y: vy.current + omega.current * rW.x,
    };

    // Force only when dragging: spring-damper from body-point to pointer
    let Fx = 0,
      Fy = 0;
    if (dragging.current) {
      const pPtr = {
        x: pointer.current.x + getContainerRect().left,
        y: pointer.current.y + getContainerRect().top,
      };
      const dx = pPtr.x - pBody.x;
      const dy = pPtr.y - pBody.y;
      Fx = stiffness * dx - damping * vBody.x;
      Fy = stiffness * dy - damping * vBody.y;
    }

    // Integrate linear motion
    const ax = Fx / mass;
    const ay = Fy / mass;
    vx.current += ax * dt;
    vy.current += ay * dt;

    // Global linear damping
    const ld = Math.exp(-linearDamping * dt);
    vx.current *= ld;
    vy.current *= ld;

    x.set(x.get() + vx.current * dt);
    y.set(y.get() + vy.current * dt);

    // Torque τ = r × F (2D cross)
    const tau = rW.x * Fy - rW.y * Fx;

    // Integrate angular motion
    const alpha = I > 0 ? tau / I : 0;
    omega.current += alpha * dt;

    // Angular damping
    const ad = Math.exp(-angularDamping * dt);
    omega.current *= ad;

    const nextTheta = ((theta + omega.current * dt) * 180) / Math.PI;
    rot.set(nextTheta);
  });

  return (
    <motion.div
      ref={elRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      // Center in container; x/y are offsets from that center
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                 select-none cursor-grab active:cursor-grabbing
                 rounded-full border border-primary bg-dark px-5 py-2"
      style={{
        x,
        y,
        rotate: rot,
        width,
        height,
        touchAction: "none",
      }}
    >
      <div className="flex h-full items-center justify-center">{children}</div>
    </motion.div>
  );
};
