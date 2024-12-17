import React, { useRef, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader, AdditiveBlending } from "three";

function Snowflake(props) {
    const points = useRef();

    const particleCount = props.count;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = Math.random() * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (!points.current) return;

        const positions = points.current.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] -= 2 * delta;

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
                size={0.5}
                color="#ffffff"
                sizeAttenuation={true}
                transparent={true}
                blending={AdditiveBlending}
                depthWrite={false}
                opacity={0.8}
                alphaTest={0.5}
                map={texture}
            />
        </points>
    );
}

export default Snowflake;
