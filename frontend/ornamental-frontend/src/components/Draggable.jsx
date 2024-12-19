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
        if (controlsRef.current._listeners) {
            controlsRef.current._listeners.hoveron = [];
            controlsRef.current._listeners.hoveroff = [];
        }

        controlsRef.current.addEventListener("hoveron", function (event) {
            scene.orbitControls.enabled = false;
            if (event.object.name == "avail_ornament") {
                event.object.material.opacity = 1;
            }
            if (event.object.name == "ornament") {
                event.object.showAuthor();
            }
            if (event.object.name == "gift" && props.camSetting == 1) {
                event.object.parent.children.map((object) => {
                    object.material.emissive.set("white");
                    object.material.emissiveIntensity = 0.2;
                });
            }
        });
        controlsRef.current.addEventListener("hoveroff", function (event) {
            scene.orbitControls.enabled = true;
            if (event.object.name == "avail_ornament") {
                event.object.material.opacity = 0.3;
            }
            if (event.object.name == "ornament") {
                event.object.hideAuthor();
            }
            if (event.object.name == "gift" && props.camSetting == 1) {
                event.object.parent.children.map((object) => {
                    object.material.emissive.set("black");
                    object.material.emissiveIntensity = 0.2;
                });
            }
        });
    }, [objects, props.camSetting]);

    useEffect(() => {
        controlsRef.current.addEventListener("dragstart", function (event) {
            if (
                event.object.name == "avail_ornament" ||
                event.object.name == "ornament" ||
                event.object.name == "gift"
            ) {
                event.object.oldPos = event.object.position.clone();
            }
        });
        controlsRef.current.addEventListener("drag", function (event) {
            if (
                event.object.name == "avail_ornament" ||
                event.object.name == "ornament" ||
                event.object.name == "gift"
            ) {
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
