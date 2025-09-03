import { Canvas, useFrame } from "@react-three/fiber";
import { FunctionComponent, useMemo, useRef } from "react";
import { AdditiveBlending, Points, ShaderMaterial, Vector3 } from "three";
import { MouseHandler } from "./MouseHandler";
import vertexShader from "./shaders/hero/vertex.glsl";
import fragmentShader from "./shaders/hero/fragment.glsl";
import { PerspectiveCamera } from "@react-three/drei";

type Particle = {
  originalPosition: Vector3;
  position: Vector3;
  velocity: Vector3;
  scale: number;
  color: Vector3;
  attractTime: number;
};

export const BlobNoiseScene: FunctionComponent = () => {
  const mousePositionRef = useRef<Vector3>(new Vector3());

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <MouseHandler mousePositionRef={mousePositionRef} />
      <Particles mousePos={mousePositionRef.current} />
    </Canvas>
  );
};

const Particles: FunctionComponent<{
  mousePos: Vector3;
  distanceThreshold?: number;
  sphereRad?: number;
  minSize?: number;
  maxSize?: number;
  particleCount?: number;
}> = ({
  mousePos,
  distanceThreshold = 5,
  sphereRad = 3,
  minSize = 20,
  maxSize = 200,
  particleCount = 500,
}) => {
  const EPS2 = 1e-6;
  const ATTR_SPEED = 0.5; // higher = faster pull toward mouse

  const RETURN_STIFF = 0.05; // spring stiffness back to origin
  const RETURN_DAMP = 3; // damping opposing velocity (overdamped-ish)

  const TIME_TO_MAX_SCALE = 0.5; // seconds required near mouse before allowing max size
  const CLOSE_FRAC = 0.5; // % of particles that are attracted 0 - 1
  const SCALE_EASE = 0.5; // how fast scale eases toward its target

  const dirRef = useRef(new Vector3());

  const particleRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const positionRef = useRef(new Float32Array(particleCount * 3));
  const colorRef = useRef(new Float32Array(particleCount * 3));
  const scaleRef = useRef(new Float32Array(particleCount));

  const particles = useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: particleCount }, (_, i) => {
      const theta = goldenAngle * i;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const x = sphereRad * Math.sin(phi) * Math.cos(theta);
      const y = sphereRad * Math.sin(phi) * Math.sin(theta);
      const z = sphereRad * Math.cos(phi);

      return {
        originalPosition: new Vector3(x, y, z),
        position: new Vector3(x, y, z),
        velocity: new Vector3(),
        scale: minSize,
        color: new Vector3(0.0, 0.4, 1.0),
        attractTime: 0,
      };
    });
  }, [particleCount, sphereRad, minSize]);

  const updateParticle = (particle: Particle, dt: number) => {
    const mouseIsNonZero = mousePos.lengthSq() > EPS2; // NEW
    const distance = particle.position.distanceTo(mousePos);

    const isWithinThreshold = mouseIsNonZero && distance <= distanceThreshold; // NEW
    const closeDist = distanceThreshold * CLOSE_FRAC; // NEW
    const isClose = isWithinThreshold && distance <= closeDist;

    dirRef.current.set(0, 0, 0);

    if (isWithinThreshold) {
      // Attract to mouse
      dirRef.current.subVectors(mousePos, particle.position);
      dirRef.current.normalize();
      const strength = Math.max(0.2, 1 - distance / 3);
      particle.velocity.addScaledVector(
        dirRef.current,
        strength * ATTR_SPEED * dt,
      );
    } else {
      // Return to origin
      dirRef.current.subVectors(particle.originalPosition, particle.position);

      particle.velocity.addScaledVector(dirRef.current, RETURN_STIFF * dt);
      particle.velocity.addScaledVector(particle.velocity, -RETURN_DAMP * dt);
    }

    // If there is effectively no restoring force and we’re at rest, kill residual drift
    if (
      !isWithinThreshold &&
      particle.position.distanceToSquared(particle.originalPosition) < EPS2
    ) {
      particle.velocity.set(0, 0, 0);
    }

    particle.position.add(particle.velocity);

    // accumulate time only when very close; decay otherwise
    if (isClose) {
      particle.attractTime = Math.min(
        TIME_TO_MAX_SCALE,
        particle.attractTime + dt,
      );
    } else {
      particle.attractTime = Math.max(0, particle.attractTime - dt);
    }

    const readyForMax = particle.attractTime >= TIME_TO_MAX_SCALE && isClose;
    const targetScale = readyForMax ? maxSize : minSize;
    const k = 1 - Math.exp(-SCALE_EASE * dt);
    particle.scale += (targetScale - particle.scale) * k;
  };

  useFrame((_, delta) => {
    if (!particleRef.current) return;

    particles.forEach((particle, i) => {
      updateParticle(particle, delta);

      // Update attributes
      const idx = i * 3;
      positionRef.current[idx] = particle.position.x;
      positionRef.current[idx + 1] = particle.position.y;
      positionRef.current[idx + 2] = particle.position.z;

      colorRef.current[idx] = particle.color.x;
      colorRef.current[idx + 1] = particle.color.y;
      colorRef.current[idx + 2] = particle.color.z;

      scaleRef.current[i] = particle.scale;
    });

    const geometry = particleRef.current.geometry;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.scale.needsUpdate = true;
  });

  return (
    <points ref={particleRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positionRef.current}
          itemSize={3}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colorRef.current}
          itemSize={3}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-scale"
          array={scaleRef.current}
          itemSize={1}
          count={particleCount}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        blending={AdditiveBlending}
        uniforms={{
          maxSize: { value: maxSize },
        }}
      />
    </points>
  );
};

export default BlobNoiseScene;
