import Box from "@/components/Box";
import LightBulb from "../components/LightBulb";
import Model from "@/components/Model";
import Skybox from "@/components/Skybox";
import Snowflake from "@/components/Snowflake";
import DeerSpawner from "@/components/DeerSpawner";
import GiftSpawner from "@/components/GiftSpawner";
import OrnamentSpot from "@/components/OrnamentSpot";
import Draggable from "@/components/Draggable";
import Gift from "@/components/Gift";

export default function MyScene(props) {
    return (
        <group>
            <Skybox />

            <Snowflake count={500} />

            <ambientLight intensity={0.5} color={"white"} />
            <Draggable camSetting={props.camSetting} giftClickHandler={props.giftClickHandler}>
                <OrnamentSpot
                    ornaments={props.ornaments}
                    choose={props.choose}
                    showAuthor={props.showAuthor}
                    hideAuthor={props.hideAuthor}
                />
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
            </Draggable>

            <LightBulb position={[0, 5, 0]} size={[0.2, 30, 10]} intensity={5.5} color={"beige"} />

            <DeerSpawner deerCount={props.numReindeers}></DeerSpawner>
            <Model file="/models/christmas_tree.glb" position={[0, 0, 0]} />
            <Model file="/models/ChristmasRoomVer2.glb" position={[0, 0, 0]} />
        </group>
    );
}
