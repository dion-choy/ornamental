import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { AdditiveBlending, TextureLoader } from "three";

function Snowflake(props) {
  const points = useRef();

  const particleCount = props.count; // Get snowflake count
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);

    // Generate random positions for snowflakes
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;

    const positions = points.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= 2 * delta;
      // Every frame lower snowflake by 2 units

      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = Math.random() * 5 + 10; // If below screen, recycle snowflake and send to top
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  const texture = useLoader(TextureLoader, "/assets/snow.png");

  return (
    <points ref={points}>
      <bufferGeometry>
        {/* Buffer to hold positions' points */}
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        color="#ffffff"
        sizeAttenuation={true} // Make further objects look smaller
        depthWrite={false} // Prevent depth of snowflake causing visual glitches
        blending={AdditiveBlending} // Remove background
        alphaTest={0.5} // Remove background
        transparent={true} // Translucent snowflake
        opacity={0.8}
        map={texture}
      />
    </points>
  );
}

export default Snowflake;
