import React from "react";

function Box(props) {
    const size = props.size;
    return (
        <mesh position={props.position} rotateX={props.rotateX} rotateY={props.rotateY} receiveShadow castShadow>
            <boxGeometry args={size} />
            <meshPhysicalMaterial color={"yellow"} />
        </mesh>
    );
}

export default Box;
