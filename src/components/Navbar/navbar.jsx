import React, { useEffect } from "react";
import images from "../../assets/images";
import { Link } from "react-router-dom";
import DarkMode from "../DarkMode/DarkMode";
import { components } from "../";
import { useAuth } from "../../store/auth";
import "./navbar.css";
import "./navbar.scss";

function Navbar() {
  var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

  function preventDefault(e) {
    e.preventDefault();
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  // modern Chrome requires { passive: false } when adding event
  var supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  // call this to Disable
  function disableScroll() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  // call this to Enable
  function enableScroll() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
  }

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
      disableScroll();
    };
    cancelBtn.onclick = () => {
      items.classList.remove("active");
      menuBtn.classList.remove("hide");
      searchBtn.classList.remove("hide");
      cancelBtn.classList.remove("show");
      enableScroll();
      form.classList.remove("active");
      cancelBtn.style.color = "#ff3d00";
    };
    items.onclick = () => {
      items.classList.remove("active");
      menuBtn.classList.remove("hide");
      searchBtn.classList.remove("hide");
      cancelBtn.classList.remove("show");
      enableScroll();
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

  const { islogedIn, userdata, newNotification } = useAuth();

  useEffect(() => {
    if (newNotification.title) {
      const notificationButton = document.querySelector("#notificationBtn");
      notificationButton.classList.add("new-notification");

      notificationButton.addEventListener("click", () => {
        notificationButton.classList.remove("new-notification");
      });
    }
  }, [newNotification]);

  return (
    <div className="navbarStyles" style={{ backgroundColor: "#171C24" }}>
      <nav className="container">
        <div
          className="flex items-center mobileresponsive"
          style={{ marginTop: "7px" }}
        >
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
              <div className="flex">
                <Link to="/notification">
                  <div className="bell-icon" id="notificationBtn" tabIndex="0">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="50px"
                      height="30px"
                      viewBox="0 0 50 30"
                      enableBackground="new 0 0 50 30"
                      xmlSpace="preserve"
                    >
                      <g className="bell-icon__group">
                        <path
                          className="bell-icon__ball"
                          id="ball"
                          fillRule="evenodd"
                          strokeWidth="1.5"
                          clipRule="evenodd"
                          fill="none"
                          stroke="#currentColor"
                          strokeMiterlimit="10"
                          d="M28.7,25 c0,1.9-1.7,3.5-3.7,3.5s-3.7-1.6-3.7-3.5s1.7-3.5,3.7-3.5S28.7,23,28.7,25z"
                        />
                        <path
                          className="bell-icon__shell"
                          id="shell"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          fill="#FFFFFF"
                          stroke="#currentColor"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          d="M35.9,21.8c-1.2-0.7-4.1-3-3.4-8.7c0.1-1,0.1-2.1,0-3.1h0c-0.3-4.1-3.9-7.2-8.1-6.9c-3.7,0.3-6.6,3.2-6.9,6.9h0 c-0.1,1-0.1,2.1,0,3.1c0.6,5.7-2.2,8-3.4,8.7c-0.4,0.2-0.6,0.6-0.6,1v1.8c0,0.2,0.2,0.4,0.4,0.4h22.2c0.2,0,0.4-0.2,0.4-0.4v-1.8 C36.5,22.4,36.3,22,35.9,21.8L35.9,21.8z"
                        />
                      </g>
                    </svg>
                    <div className="notification-amount">
                      <span></span>
                    </div>
                  </div>
                </Link>

                <div className="dropdown-container">
                  <details className="dropdown right">
                    <summary className="avatar">
                      <img
                        src={
                          userdata.avatarURL == null
                            ? "https://gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                            : userdata.avatarURL.length < 10
                            ? images[userdata.avatarURL]
                            : userdata.avatarURL
                        }
                      />
                    </summary>
                    <ul>
                      <li
                        style={{
                          color: "balck",
                          fontWeight: "bold",
                        }}
                      >
                        <p>
                          <span className="block bold">
                            {userdata.firstName}&nbsp;
                            {userdata.lastName ? userdata.lastName : ""}
                          </span>
                          <span className="block italic">{userdata.email}</span>
                        </p>
                      </li>

                      <li>
                        <Link to="/userProfile">Account</Link>
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
        <form action="#" style={{ marginLeft: "1rem", zIndex: "1" }}>
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
