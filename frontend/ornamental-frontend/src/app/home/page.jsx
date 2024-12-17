import React from "react";
import css from "@/styles/home.css";

function Home() {
  return (
    <div>
      <div className="container">
        <div className="logo">
          <img src="/logo.png" alt="Ornamental Logo" />
        </div>

        <div className="candy-cane">
          <img src="/candycane.png" alt="Candy Cane Divider" />
        </div>

        <div className="buttons">
          <button className="btn create">Create your Room</button>
          <button className="btn join">Join a Room</button>
        </div>
      </div>

      <div className="snowflake" style={{ top: "10%", left: "15%" }}>
        <img src="/snowflake.png" alt="Snowflake" />
      </div>
      <div className="snowflake" style={{ top: "20%", right: "10%" }}>
        <img src="/snowflake.png" alt="Snowflake" />
      </div>
      <div className="snowflake" style={{ bottom: "10%", left: "10%" }}>
        <img src="/snowflake.png" alt="Snowflake" />
      </div>
      <div className="snowflake" style={{ bottom: "5%", right: "5%" }}>
        <img src="/snowflake.png" alt="Snowflake" />
      </div>
    </div>
  );
}

export default Home;
