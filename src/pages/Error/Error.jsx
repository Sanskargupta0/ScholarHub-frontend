import React from "react";
import { NavLink } from "react-router-dom";
import styleError from "./error.module.css";
const Error = () => {
  return (
    <>
      <section className={styleError.errorPage}>
        <div className={styleError.content}>
          <h2 className={styleError.header}>404</h2>
          <h4>Sorry! Page not found</h4>
          <p>
            Oops! It seems like the page you're trying to access doesn't exist.
            If you believe there's an issue, feel free to report it, and we'll
            look into it.
          </p>
          <div className={styleError.btns}>
            <NavLink to="/">return home</NavLink>
            <NavLink to="/contact">report problem</NavLink>
          </div>
        </div>
      </section>
    </>
  );
};

export default Error;