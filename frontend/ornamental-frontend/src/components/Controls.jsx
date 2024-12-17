import React, { useEffect, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

function Controls(props) {
    const { camera, gl } = useThree();

    const control = useRef();

    useFrame(() => {
        if (props.rotate) {
            control.current.autoRotate = true;
            control.current.update();
        }
    });

    return (
        <orbitControls
            ref={control}
            attach={"orbitControls"}
            args={[camera, gl.domElement]}
            maxDistance={20}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            enablePan={false}
        />
    );
}

export default Controls;
