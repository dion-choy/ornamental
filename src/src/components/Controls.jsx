import React, { useEffect, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

extend({ OrbitControls });

function Controls(props) {
    const { camera, gl } = useThree();

    const control = useRef();
    const targetPosition = useRef(new THREE.Vector3());
    const targetFocus = useRef(new THREE.Vector3());

    useEffect(() => {
        control.current.target.set(0, 1, 0);
        control.current.autoRotateSpeed = props.rotate;

        switch (props.camSetting) {
            case 0:
                control.current.autoRotate = true;
                control.current.enableRotate = true;
                control.current.minDistance = 1.5;
                control.current.maxDistance = 3.5;
                control.current.minPolarAngle = Math.PI / 4;
                control.current.maxPolarAngle = Math.PI / 2 - 0.1;
                control.current.maxAzimuthAngle = Infinity;
                control.current.minAzimuthAngle = -Infinity;

                targetPosition.current.set(0, 2, 5); // Example orbit position
                targetFocus.current.set(0, 1, 0); // Example orbit target
                break;

            case 1:
                control.current.autoRotate = false;
                control.current.enableRotate = true;
                control.current.minDistance = 1.5;
                control.current.maxDistance = 3.5;
                control.current.minPolarAngle = Math.PI / 3;
                control.current.maxPolarAngle = Math.PI / 2 + 0.2;
                control.current.maxAzimuthAngle = Math.PI / 2 + 0.2;
                control.current.minAzimuthAngle = Math.PI / 4;

                targetPosition.current.set(0, 2, -2.5); // Fixed position
                targetFocus.current.set(-5, 2, -2.5); // Fixed focus
                break;

            default:
                break;
        }
    }, [props.camSetting, props.rotate, camera]);

    useFrame((state, delta) => {
        switch (props.camSetting) {
            case 0:
                control.current.update(delta);
                break;

            case 1:
                // Smoothly interpolate the camera position and target
                const lerpFactor = 2 * delta; // Adjust for speed (smaller = slower, larger = faster)
                camera.position.lerp(targetPosition.current, lerpFactor);
                control.current.target.lerp(targetFocus.current, lerpFactor);

                // Update the camera and controls
                camera.updateProjectionMatrix();
                control.current.update(delta);
        }
    });

    return <orbitControls ref={control} attach={"orbitControls"} args={[camera, gl.domElement]} enablePan={false} />;
}

export default Controls;
