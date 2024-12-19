import Box from "@/components/Box";
import LightBulb from "../components/LightBulb";
import Model from "@/components/Model";
import Skybox from "@/components/Skybox";
import Snowflake from "@/components/Snowflake";
import DeerSpawner from "@/components/DeerSpawner";
import GiftSpawner from "@/components/GiftSpawner";
import OrnamentSpot from "@/components/OrnamentSpot";
import Draggable from "@/components/Draggable";

export default function MyScene(props) {
    return (
        <group>
            <Skybox />

            <Snowflake count={500} />

            <ambientLight intensity={0.5} color={"white"} />
            <Draggable>
                <OrnamentSpot taken={[0, 3, 6]} choose={props.choose} />
                <LightBulb position={[0, 4, 0]} size={[0.2, 30, 10]} intensity={5} color={"beige"} />
            </Draggable>

            <GiftSpawner></GiftSpawner>
            <DeerSpawner deerCount={props.numReindeers}></DeerSpawner>
            <Model file="../models/christmas_tree.glb" position={[0, 0, 0]} />
            <Model file="../models/ChristmasRoomVer2.glb" position={[0, 0, 0]} />
        </group>
    );
}
