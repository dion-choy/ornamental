import React, { useEffect, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

function Controls(props) {
    const { camera, gl } = useThree();

    const control = useRef();

    useEffect(() => {
        control.current.target.set(0, 1, 0);
        control.current.autoRotate = true;
        control.current.autoRotateSpeed = props.rotate;
    });

    useFrame((state, delta) => {
        if (props.rotate) {
            control.current.update(delta);
        }
    });

    return (
        <orbitControls
            ref={control}
            attach={"orbitControls"}
            args={[camera, gl.domElement]}
            maxDistance={3.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2 - 0.1}
            enablePan={false}
        />
    );
}

export default Controls;
