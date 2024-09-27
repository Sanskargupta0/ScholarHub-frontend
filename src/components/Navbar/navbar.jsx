import React, { useEffect } from "react";
import "./navbar.css";
import images from "../../assets/images";
import { Link } from "react-router-dom";
import DarkMode from "../DarkMode/DarkMode";

function Navbar() {
  useEffect(() => {
    const menuBtn = document.querySelector(".menu-icon span");
    const searchBtn = document.querySelector(".search-icon");
    const cancelBtn = document.querySelector(".cancel-icon");
    const items = document.querySelector(".nav-items");
    const form = document.querySelector("form");
    menuBtn.onclick = () => {
      items.classList.add("active");
      menuBtn.classList.add("hide");
      searchBtn.classList.add("hide");
      cancelBtn.classList.add("show");
    };
    cancelBtn.onclick = () => {
      items.classList.remove("active");
      menuBtn.classList.remove("hide");
      searchBtn.classList.remove("hide");
      cancelBtn.classList.remove("show");
      form.classList.remove("active");
      cancelBtn.style.color = "#ff3d00";
    };
    items.onclick = () => {
      items.classList.remove("active");
      menuBtn.classList.remove("hide");
      searchBtn.classList.remove("hide");
      cancelBtn.classList.remove("show");
      form.classList.remove("active");
      cancelBtn.style.color = "#ff3d00";
    };
    searchBtn.onclick = () => {
      form.classList.add("active");
      searchBtn.classList.add("hide");
      cancelBtn.classList.add("show");
    }; 

  }, []);

  return (
    <div className="navbarStyles" style={{ backgroundColor: "#171C24" }}>
      <nav className="container">
        <div className="menu-icon">
          <span className="fas fa-bars"></span>
        </div>
        <img src={images.logo} alt="logo" style={{ height: "40px" }}/>
        
        <div className="logo">ScholarHub</div>
        <div className="nav-items">
          <li >
            <Link to="/">
              Home
            </Link>
          </li>
          <li>
            <Link to="/About">
              About
            </Link>
          </li>
          <li>
            <Link to="/Contact">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/Library">
              Library
            </Link>
          </li>
          <li>
            <Link to="/ExamPaper">
              Exam Paper
            </Link>
          </li>
          
        </div>
        <div className="justincreasingsizeformobile"></div>
        <div className="darkMode">
          <DarkMode />
        </div>
        <div className="search-icon">
          <span className="fas fa-search"></span>
        </div>
        <div className="cancel-icon">
          <span className="fas fa-times"></span>
        </div>
        <form action="#" style={{"marginLeft":"1rem"}}>
          <input
            type="search"
            className="search-data"
            placeholder="Search"
            required
          />
          <button type="submit" className="fas fa-search"></button>
        </form>
      </nav>
    </div>
  );
}

export default Navbar;
