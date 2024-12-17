import React from "react";

function LightBulb(props) {
    return (
        <mesh {...props}>
            <pointLight shadow-bias= {-0.001}castShadow={true} intensity={10} />
            <sphereGeometry args={[0.2, 30, 10]} />
            {/* <meshPhongMaterial emissive={"yellow"} /> */}
        </mesh>
    );
}

export default LightBulb;
