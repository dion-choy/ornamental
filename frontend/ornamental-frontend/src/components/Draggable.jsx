import React, { useEffect, useRef, useState } from "react";
import { extend, useThree } from "@react-three/fiber";
import { DragControls } from "three/examples/jsm/controls/DragControls";

extend({ DragControls });

function Draggable(props) {
    const groupRef = useRef();
    const controlsRef = useRef();
    const [objects, setObjects] = useState();
    const { camera, gl, scene } = useThree();
    useEffect(() => {
        setObjects(groupRef.current.children);
    }, [groupRef]);

    useEffect(() => {
        controlsRef.current.addEventListener("hoveron", function (event) {
            scene.orbitControls.enabled = false;
            if (event.object.name == "avail_ornament") {
                event.object.material.opacity = 1;
            }
        });
        controlsRef.current.addEventListener("hoveroff", function (event) {
            scene.orbitControls.enabled = true;
            if (event.object.name == "avail_ornament") {
                event.object.material.opacity = 0.3;
            }
        });

        controlsRef.current.addEventListener("dragstart", function (event) {
            if (event.object.name == "avail_ornament" || event.object.name == "ornament") {
                event.object.oldPos = event.object.position.clone();
            }
        });
        controlsRef.current.addEventListener("drag", function (event) {
            if (event.object.name == "avail_ornament" || event.object.name == "ornament") {
                event.object.position.set(...event.object.oldPos); // lock position
            }
        });
    }, [objects]);

    return (
        <group ref={groupRef}>
            <dragControls ref={controlsRef} args={[objects, camera, gl.domElement]} />
            {props.children}
        </group>
    );
}

export default Draggable;
