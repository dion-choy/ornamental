import React from "react";

function LightBulb(props) {
    return (
        <mesh ref={ref} position={props.position}>
            <pointLight
                color={props.color}
                shadow-bias={-0.001}
                castShadow={true}
                intensity={props.intensity}
                shadow-camera-far={10}
            />
            <sphereGeometry args={props.size} />
        </mesh>
    );
}

export default LightBulb;
