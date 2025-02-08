import LightBulb from "./LightBulb";
import Model from "@/components/Model";
import Skybox from "@/components/Skybox";
import Snowflake from "@/components/Snowflake";
import DeerSpawner from "@/components/DeerSpawner";
import GiftSpawner from "@/components/GiftSpawner";
import OrnamentSpot from "@/components/OrnamentSpot";
import HoverEvents from "@/components/HoverEvents";
import Gift from "@/components/Gift";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import Controls from "@/components/Controls";
import style from "@/styles/Room.module.css";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SAOPass } from "three/addons/postprocessing/SAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { useCookies } from "next-client-cookies";

// DION File

export default function RoomCanvas(props) {
    const cookies = useCookies();

    let shadows; // Determine shadows from the props and get shadow resolution
    switch (props.shadows) {
        case "high":
            shadows = 4096;
        case "mid":
            shadows = 1024;
            break;
        case "low":
            shadows = 512;
            break;
        case "ultralow":
            shadows = 128;
            break;
        default:
            shadows = 1024;
    }

    return (
        <Canvas
            style={{ visibility: props.firstTime ? "hidden" : "visible" }} // if viewing onboarding, hide canvas for performance
            shadows={!props.firstTime && props.shadows != 0} // if viewing onboarding, turn shadows off for performance
            className={style.canvas}
            camera={{
                position: [7, 4, 7],
                fov: 100,
            }}
            onCreated={({ gl, scene, camera }) => {
                const composer = new EffectComposer(gl);
                gl.setPixelRatio(window.devicePixelRatio);
                // Set resolution by downscaling canvas size
                gl.setSize(
                    window.innerWidth / (cookies.get("resolution") ? cookies.get("resolution") : 2.5),
                    window.innerHeight / (cookies.get("resolution") ? cookies.get("resolution") : 2.5),
                    false
                );

                // add scene renderer
                const renderPass = new RenderPass(scene, camera);
                composer.addPass(renderPass);

                // Scalable Ambient Occlusion (SAO) shader
                const saoPass = new SAOPass(scene, camera);
                saoPass.resolution.set(1024, 1024);
                saoPass.setSize(1024, 1024);

                // configure shader and add
                saoPass.params.saoBias = -1;
                saoPass.params.saoIntensity = 0.5;
                saoPass.params.saoScale = 1;
                saoPass.params.saoKernelRadius = 20;
                saoPass.params.saoMinResolution = 0.01;
                saoPass.params.saoBlur = true;
                saoPass.params.saoBlurRadius = 10;
                saoPass.params.saoBlurStdDev = 5;
                saoPass.params.saoBlurDepthCutoff = 0.01;
                composer.addPass(saoPass);

                // Output pass on scene
                const outputPass = new OutputPass();
                composer.addPass(outputPass);

                gl.setAnimationLoop(() => composer.render());
            }}
        >
            <Skybox />

            <Snowflake count={500} />

            <ambientLight intensity={0.5} color={"white"} />
            <HoverEvents camSetting={props.camSetting} giftClickHandler={props.giftClickHandler}>
                <Gift
                    file="/models/CylinderGift.glb"
                    type={"Gift Cylinder"}
                    scale={0.31}
                    position={[-3.64, 1.05, -1.54]}
                />
                <Gift file="/models/BagGift.glb" type={"Gift Bag"} scale={0.31} position={[-3.64, 1.05, -2.54]} />
                <Gift file="/models/BoxGift.glb" type={"Gift Box"} scale={0.31} position={[-3.66, 1.05, -3.645]} />
                <GiftSpawner
                    parentGiftDatas={props.giftData}
                    showAuthor={props.showAuthor}
                    hideAuthor={props.hideAuthor}
                />
            </HoverEvents>

            <OrnamentSpot
                ornaments={props.ornaments}
                choose={props.choose}
                setChoose={props.setChoose}
                showAuthor={props.showAuthor}
                hideAuthor={props.hideAuthor}
                load={props.load}
            />

            <LightBulb position={[0, 5, 0]} size={[0.2, 30, 10]} intensity={5.5} color={"beige"} shadows={shadows} />

            <DeerSpawner deerCount={props.numReindeers}></DeerSpawner>

            <Model
                visible={props.timeLeft == "0 Days 00:00:00"}
                file="/models/TreeStar.glb"
                position={[0, 0, 0]}
                shadows={shadows}
            />
            <Model file="/models/christmas_tree.glb" position={[0, 0, 0]} shadows={shadows} />
            <Model file="/models/ChristmasRoomVer2.glb" position={[0, 0, 0]} shadows={shadows} />

            {/* if viewing onboarding, turn rotation off for performance
                else, rotation follows settings */}
            <Controls rotate={props.firstTime || !props.rotation ? 0 : props.rotation} camSetting={props.camSetting} />
        </Canvas>
    );
}
