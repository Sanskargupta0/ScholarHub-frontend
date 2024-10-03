import React, { useEffect } from "react";
import images from "../../assets/images";
import { Link } from "react-router-dom";
import DarkMode from "../DarkMode/DarkMode";
import { components } from "../";
import { useAuth } from "../../store/auth";
import "./navbar.css";

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

  function closeOpenDropdowns(e) {
    let openDropdownEls = document.querySelectorAll("details.dropdown[open]");

    if (openDropdownEls.length > 0) {
      // If we're clicking anywhere but the summary element, close dropdowns
      if (e.target.parentElement.nodeName.toUpperCase() !== "SUMMARY") {
        openDropdownEls.forEach((dropdown) => {
          dropdown.removeAttribute("open");
        });
      }
    }
  }

  document.addEventListener("click", closeOpenDropdowns);

  const { islogedIn } = useAuth();

  return (
    <div className="navbarStyles" style={{ backgroundColor: "#171C24" }}>
      <nav className="container">
        <div className="flex items-center mobileresponsive">
          <div className="menu-icon">
            <span className="fas fa-bars"></span>
          </div>
          <img src={images.logo} alt="logo" className="imagemobile" />

          <div className="logo mx-1.5">ScholarHub</div>
          {!islogedIn ? (
            <div className="nav-items">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/About">About</Link>
              </li>
              <li>
                <Link to="/Contact">Contact</Link>
              </li>
              <li>
                <Link to="/Library">Library</Link>
              </li>
              <li>
                <Link to="/ExamPaper">Exam Paper</Link>
              </li>
            </div>
          ) : (
            <div className="nav-items">
              <li>
                <Link to="/Dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/Library">Library</Link>
              </li>
              <li>
                <Link to="/ExamPaper">Exam Paper</Link>
              </li>
              <li>
                <Link to="/Contact">Contact</Link>
              </li>
            </div>
          )}
        </div>
        <div className="flex items-center mobileresponsive2">
          <div className="mx-4">
            {!islogedIn ? (
              <Link to="/login">
                <components.Button />
              </Link>
            ) : (
              <div className="dropdown-container">
                <details className="dropdown right">
                  <summary className="avatar">
                    <img src="https://gravatar.com/avatar/00000000000000000000000000000000?d=mp" />
                  </summary>
                  <ul>
                    <li
                      style={{
                        color: "balck",
                        fontWeight: "bold",
                      }}
                    >
                      <p>
                        <span className="block bold">Jane Doe</span>
                        <span className="block italic">jane@example.com</span>
                      </p>
                    </li>

                    <li>
                      <a href="#">Account</a>
                    </li>
                    <li>
                      <a href="#">Notification</a>
                    </li>
                    <li>
                      <a href="#">Help</a>
                    </li>
                    <li className="divider"></li>
                    <li>
                      <Link to="/logout">
                        <button className="Btnlogout">
                          <div className="sign">
                            <svg viewBox="0 0 512 512">
                              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                            </svg>
                          </div>

                          <div className="text">Logout</div>
                        </button>
                      </Link>
                    </li>
                  </ul>
                </details>
              </div>
            )}
          </div>
          <div className="darkMode">
            <DarkMode />
          </div>
          <div className="search-icon">
            <span className="fas fa-search"></span>
          </div>
          <div className="cancel-icon">
            <span className="fas fa-times"></span>
          </div>
        </div>
        <form action="#" style={{ marginLeft: "1rem" }}>
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
