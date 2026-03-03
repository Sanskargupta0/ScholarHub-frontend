import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/auth";
import { components } from "../../../../components";
import config from "../../../../config";
const ProtectedForEditor = (props) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { Component } = props;
  const [data, setData] = useState({});
  let token = localStorage.getItem("Token");
  const verifyToken = async () => {
    const response = await fetch(`${config.backendUrl + "/tokenValidation"}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.status !== 200) {
      navigate("/login");
      logoutUser();
      toast.error(`Your Access token is not valid`, {
        position: "top-center",
      });
    } else if (response.status === 200) {
      setData(data);
      if (data.isAdmin === false && data.editor === false) {
        navigate("/dashboard");
        toast.error(`You are not either Admin nor Editor`, {
          position: "top-center",
        });
      }
    }
  };

  useEffect(() => {
    if (!token) {
      logoutUser();
      navigate("/login");
      toast.error(`You are Trying Access Proteced Route`, {
        position: "top-center",
      });
    } else {
      verifyToken();
    }
  }, []);

  useEffect(() => {
    if (data.editor === true) {
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
    }
  }, [data]);
  return (
    <>
      {data.isAdmin ? <components.SideBar /> : ""}
      {data.editor ? (
        <div className="adminsidebar">
          <nav className="sidebar close hoverable" style={{"height":"20rem"}}>
            <div className="menu_content">
              <ul className="menu_items">
                <div className="menu_title menu_editor"></div>

                <li className="item">
                  <Link to="/editor/paper" className="nav_link">
                    <span className="navlink_icon">
                      <i className="bx bxs-magic-wand"></i>
                    </span>
                    <span className="navlink">Paper</span>
                  </Link>
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
      ) : (
        ""
      )}
      <Component />
    </>
  );
};

export default ProtectedForEditor;
