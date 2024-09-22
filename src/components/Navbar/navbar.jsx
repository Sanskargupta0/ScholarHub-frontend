import React, { useEffect } from "react";
import "./navbar.css";
import images from "../../assets/images";

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
  searchBtn.onclick = () => {
    form.classList.add("active");
    searchBtn.classList.add("hide");
    cancelBtn.classList.add("show");
  };
}, []);

  return (
    <div className="navbarStyles" style={{backgroundColor:"#171C24"}}>
    <nav className="container">
      <div className="menu-icon">
        <span className="fas fa-bars"></span>
        
      </div>
      <img src={images.logo} alt="logo" style={{height: "50px"}}/> &nbsp;&nbsp;
      <div className="logo">ScholarHub</div>
      <div className="nav-items">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Blogs</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
        <li>
          <a href="#">Feedback</a>
        </li>
      </div>
      <div className="search-icon">
        <span className="fas fa-search"></span>
      </div>
      <div className="cancel-icon">
        <span className="fas fa-times"></span>
      </div>
      <form action="#">
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
