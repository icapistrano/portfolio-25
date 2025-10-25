import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { FC, useMemo, useRef } from "react";
import { AdditiveBlending, Points, Uniform, Vector3 } from "three";
import fragmentShader from "./shaders/hero/fragment.glsl";
import vertexShader from "./shaders/hero/vertex.glsl";
import { MouseHandler } from "./MouseHandler";

type Particle = {
  attractTime: number;
  originalPosition: Vector3;
  position: Vector3;
  velocity: Vector3;
};

export const BlobNoiseScene: FC = () => {
  const mousePositionRef = useRef<Vector3>(new Vector3());

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <MouseHandler mousePositionRef={mousePositionRef} />
      <Particles mousePos={mousePositionRef.current} />
    </Canvas>
  );
};

const Particles: FC<{
  mousePos: Vector3;
  distanceThreshold?: number;
  sphereRad?: number;
  minSize?: number;
  maxSize?: number;
  particleCount?: number;
  attractionStrength?: number;
  damping?: number;
}> = ({
  mousePos,
  distanceThreshold = 5,
  sphereRad = 3,
  minSize = 30,
  maxSize = 100,
  particleCount = 500,
  attractionStrength = 20,
  damping = 0.98,
}) => {
  const particleRef = useRef<Points>(null);
  const positionRef = useRef(new Float32Array(particleCount * 3));
  const attractionRef = useRef(new Float32Array(particleCount));

  const tmpV = useRef(new Vector3());

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
        attractTime: 0,
      };
    });
  }, [particleCount, sphereRad]);

  const updateParticle = (
    particle: Particle,
    delta: number,
    moveParticles: boolean,
  ) => {
    const distance = particle.position.distanceTo(mousePos);

    // --- When inside mouse influence ---
    if (moveParticles && distance < distanceThreshold) {
      const force = tmpV.current
        .subVectors(mousePos, particle.position)
        .multiplyScalar(
          attractionStrength * (1 - distance / distanceThreshold),
        );

      particle.velocity.add(force.multiplyScalar(delta));

      particle.attractTime = Math.min(particle.attractTime + delta, 1);
    }
    // --- Otherwise, spring back to original position ---
    else {
      const stiffness = 3 + Math.random() * 10;

      const springForce = tmpV.current
        .subVectors(particle.originalPosition, particle.position)
        .multiplyScalar(stiffness);

      particle.velocity.add(springForce.multiplyScalar(delta));
      particle.velocity.multiplyScalar(damping);

      particle.attractTime = Math.max(particle.attractTime - delta, 0);
    }

    // --- Apply velocity to position ---
    particle.position.add(particle.velocity.clone().multiplyScalar(delta));
  };

  useFrame((_, delta) => {
    if (!particleRef.current) return;

    const isNonZero = mousePos.lengthSq() >= 1e-6;
    particles.forEach((particle, i) => {
      updateParticle(particle, delta, isNonZero);

      // Update attributes
      const idx = i * 3;
      positionRef.current[idx] = particle.position.x;
      positionRef.current[idx + 1] = particle.position.y;
      positionRef.current[idx + 2] = particle.position.z;

      attractionRef.current[i] = particle.attractTime;
    });

    const geometry = particleRef.current.geometry;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.attraction.needsUpdate = true;
  });

  const uniforms = useMemo(() => {
    return {
      uColor: new Uniform(new Vector3(0, 0.4, 1)),
      uMaxSize: new Uniform(maxSize),
      uMinSize: new Uniform(minSize),
    };
  }, [minSize, maxSize]);

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
          attach="attributes-attraction"
          array={attractionRef.current}
          itemSize={1}
          count={particleCount}
        />
      </bufferGeometry>
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        blending={AdditiveBlending}
        uniforms={uniforms}
      />
    </points>
  );
};

export default BlobNoiseScene;
