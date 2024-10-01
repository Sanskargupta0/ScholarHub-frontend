import React from "react";
import styleLoader from "./Loader.module.css";
const Loader = () => {
  return (
    <div className={styleLoader.typewriter}>
      <div className={styleLoader.slide}>
        <i></i>
      </div>
      <div className={styleLoader.paper}></div>
      <div className={styleLoader.keyboard}></div>
    </div>
  );
};

export default Loader;
