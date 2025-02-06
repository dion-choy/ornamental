import React, { useState } from "react";
import style from "@/styles/Room.module.css";
import { useCookies } from "next-client-cookies";

// DION File
export default function Settings({ visible, setVis, setShadows, setRotation }) {
    const [resChanged, setResChanged] = useState(false);

    const cookies = useCookies();

    return (
        visible && (
            <div id="settingsdiv" className={`${style.namerect} ${style.settings_menu}`}>
                <h2>Settings</h2>
                <select
                    onChange={(s) => {
                        // Change resolution settings
                        let divider;
                        switch (s.target.value) {
                            case "high":
                                divider = 1;
                                break;
                            case "mid":
                                divider = 2.5;
                                break;
                            case "low":
                                divider = 5;
                                break;
                            case "ultralow":
                                divider = 10;
                                break;
                            case "poopoo":
                                divider = 20;
                                break;
                            default:
                                divider = 5;
                        }
                        cookies.set("resolution", divider); // Set cookies
                        setResChanged(true); // Indicate resolution changed to reload page
                    }}
                >
                    <option>Resolution:</option>
                    <option value="high">High</option>
                    <option value="mid">Mid</option>
                    <option value="low">Low</option>
                    <option value="ultralow">Ultra Low</option>
                    <option value="poopoo">Poo poo</option>
                </select>

                <select
                    onChange={(s) => {
                        // Change shadows state in page.jsx
                        if (s.target.value === "off") {
                            setShadows(0);
                            cookies.set("shadows", 0);
                        } else {
                            setShadows(s.target.value);
                            cookies.set("shadows", s.target.value);
                        }
                    }}
                >
                    <option>Shadows:</option>
                    <option value="high">High</option>
                    <option value="mid">Mid</option>
                    <option value="low">Low</option>
                    <option value="ultralow">Ultra Low</option>
                    <option value="off">Off</option>
                </select>

                <span>
                    Rotation:
                    <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.01}
                        defaultValue={cookies.get("rotation") || 1}
                        onChange={(e) => {
                            setRotation(e.target.value); // Change rotation state in page.jsx
                            cookies.set("rotation", e.target.value);
                        }}
                    />
                </span>
                <button
                    onClick={() => {
                        setVis(false); // Close settings overlay
                        if (resChanged) {
                            // Reload window if resolution was changed
                            window.location.reload();
                        }
                    }}
                >
                    Save & Close
                </button>
            </div>
        )
    );
}
