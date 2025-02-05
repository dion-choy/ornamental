import React, { useEffect, useRef, useState } from "react";
import { extend, useThree } from "@react-three/fiber";
import { DragControls } from "three/examples/jsm/controls/DragControls";

extend({ DragControls });

// DION File
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
      controlsRef.current._listeners = {}; // Clear event listeners
    }

    controlsRef.current.addEventListener("hoveron", function (event) {
      console.log(event);
      scene.orbitControls.enabled = false; // Prevent rotation when 3d object is hovered/clicked on
      if (event.object.name == "avail_ornament") {
        event.object.material.opacity = 1; // Highlight available positions
      }
      if (event.object.name == "ornament" || event.object.name == "treeGift") {
        event.object.showAuthor(); // Show author of gifts and ornaments
      }
      if (event.object.name == "gift" && props.camSetting == 1) {
        event.object.parent.children.map((object) => {
          object.material.emissive.set("white"); // If gift is hovered, make emissive highlight
          object.material.emissiveIntensity = 0.2;
        });
      }
      if (event.object.name == "tree") {
        console.log(controlsRef.current);
      }
    });

    controlsRef.current.addEventListener("hoveroff", function (event) {
      scene.orbitControls.enabled = true;
      if (event.object.name == "avail_ornament") {
        event.object.material.opacity = 0.3; // Unhighlight objects
      }
      if (event.object.name == "ornament" || event.object.name == "treeGift") {
        event.object.hideAuthor(); // Hide author objects
      }
      if (event.object.name == "gift" && props.camSetting == 1) {
        event.object.parent.children.map((object) => {
          object.material.emissive.set("black"); // Clear emissive highlight
          object.material.emissiveIntensity = 0.2;
        });
      }
    });

    controlsRef.current.addEventListener("dragstart", function (event) {
      console.log(event.object);
      if (
        event.object.name == "avail_ornament" ||
        event.object.name == "ornament" ||
        event.object.name == "gift" ||
        event.object.name == "treeGift" ||
        event.object.name == "tree"
      ) {
        event.object.oldPos = event.object.position.clone(); // Lock position of objects
      }

      if (event.object.name == "gift" && props.camSetting) {
        props.giftClickHandler(event.object); // Click event to select gift to put under tree
      }
    });

    controlsRef.current.addEventListener("drag", function (event) {
      if (
        event.object.name == "avail_ornament" ||
        event.object.name == "ornament" ||
        event.object.name == "gift" ||
        event.object.name == "treeGift" ||
        event.object.name == "tree"
      ) {
        event.object.position.set(...event.object.oldPos); // lock position of objects
      }
    });
  }, [objects, props.camSetting, props.giftClickHandler]);

  return (
    <group ref={groupRef}>
      <dragControls ref={controlsRef} args={[objects, camera, gl.domElement]} />
      {props.children}
    </group>
  );
}

export default Draggable;
