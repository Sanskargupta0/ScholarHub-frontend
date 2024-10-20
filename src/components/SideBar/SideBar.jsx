import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";
function SideBar() {
  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarClose = document.querySelector(".collapse_sidebar");
    const sidebarExpand = document.querySelector(".expand_sidebar");

    sidebarClose.addEventListener("click", () => {
      sidebar.classList.add("close", "hoverable");
    });
    sidebarExpand.addEventListener("click", () => {
      sidebar.classList.remove("close", "hoverable");
    });

    sidebar.addEventListener("mouseenter", () => {
      if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.remove("close");
      }
    });
    sidebar.addEventListener("mouseleave", () => {
      if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.add("close");
      }
    });

    if (window.innerWidth < 768) {
      sidebar.classList.add("close");
    } else {
      sidebar.classList.remove("close");
    }
    const handleSubmenuToggle = (event) => {
      const clickedItem = event.target.closest(".submenu_item");

      // If no submenu item was clicked, exit early
      if (!clickedItem) return;

      // Toggle the clicked submenu
      clickedItem.classList.toggle("show_submenu");

      // Find any currently active submenu and close it, except the clicked one
      document
        .querySelectorAll(".submenu_item.show_submenu")
        .forEach((item) => {
          if (item !== clickedItem) {
            item.classList.remove("show_submenu");
          }
        });
    };

    // Attach event listener for event delegation
    sidebar.addEventListener("click", handleSubmenuToggle);

    // Clean up event listener on component unmount
    return () => {
      sidebar.removeEventListener("click", handleSubmenuToggle);
    };
  }, []);

  return (
    <div className="adminsidebar">
      <nav className="sidebar close hoverable">
        <div className="menu_content">
          <ul className="menu_items">
            <div className="menu_title menu_dahsboard"></div>

            <li className="item">
              <Link  to="/adminpanel">
                <div href="#" className="nav_link">
                  <span className="navlink_icon">
                    <i className="bx bxs-user-account"></i>
                  </span>
                  <span className="navlink">Admin Panel</span>
                </div>
              </Link>
            </li>

            <li className="item">
              <div href="#" className="nav_link submenu_item">
                <span className="navlink_icon">
                  <i className="bx bx-grid-alt"></i>
                </span>
                <span className="navlink">Overview</span>
                <i className="bx bx-chevron-right arrow-left"></i>
              </div>

              <ul className="menu_items submenu">
                <Link to="/globalNotification" className="nav_link sublink">
                  Global Notification
                </Link>
                <Link to="/course" className="nav_link sublink">
                  Courses
                </Link>
                <a href="#" className="nav_link sublink">
                  Nav Sub Link
                </a>
                <a href="#" className="nav_link sublink">
                  Nav Sub Link
                </a>
              </ul>
            </li>
          </ul>

          <ul className="menu_items">
            <div className="menu_title menu_editor"></div>

            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bxs-magic-wand"></i>
                </span>
                <span className="navlink">Magic build</span>
              </a>
            </li>

            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bx-loader-circle"></i>
                </span>
                <span className="navlink">Filters</span>
              </a>
            </li>
            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bx-filter"></i>
                </span>
                <span className="navlink">Filter</span>
              </a>
            </li>
            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bx-cloud-upload"></i>
                </span>
                <span className="navlink">Upload new</span>
              </a>
            </li>
          </ul>
          <ul className="menu_items">
            <div className="menu_title menu_setting"></div>
            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bx-flag"></i>
                </span>
                <span className="navlink">Notice board</span>
              </a>
            </li>
            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bx-medal"></i>
                </span>
                <span className="navlink">Award</span>
              </a>
            </li>
            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bx-cog"></i>
                </span>
                <span className="navlink">Setting</span>
              </a>
            </li>
            <li className="item">
              <a href="#" className="nav_link">
                <span className="navlink_icon">
                  <i className="bx bx-layer"></i>
                </span>
                <span className="navlink">Features</span>
              </a>
            </li>
          </ul>

          <div className="bottom_content">
            <div className="bottom expand_sidebar">
              <span> Expand</span>
              <i className="bx bx-log-in"></i>
            </div>
            <div className="bottom collapse_sidebar">
              <span> Collapse</span>
              <i className="bx bx-log-out"></i>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default SideBar;
