import React, { useRef, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader, additiveBlending } from "three";

function Snowflake(props) {
    const points = useRef();

    const particleCount = props.count;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3); // x, y, z for each particle
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100; // x position
            pos[i * 3 + 1] = Math.random() * 50; // y position (height)
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100; // z position
        }
        return pos;
    }, []);

    // Animate the snow particles
    useFrame(() => {
        if (!points.current) return;

        const positions = points.current.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] -= 0.1;

            if (positions[i * 3 + 1] < -10) {
                positions[i * 3 + 1] = 50;
            }
        }
        points.current.geometry.attributes.position.needsUpdate = true;
    });

    const texture = useLoader(TextureLoader, "/snow.png");

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={0.5} // Adjust particle size
                color="#ffffff" // Snow color
                sizeAttenuation={true}
                transparent={true}
                blending={additiveBlending}
                depthWrite={false}
                opacity={0.8}
                alphaTest={0.5}
                map={texture}
            />
        </points>
    );
}

export default Snowflake;
