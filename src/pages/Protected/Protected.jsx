import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth";
import { components } from "../../components";
import config from "../../config";
const Protected = (props) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { Component } = props;
  const [isAdmin, setIsAdmin] = useState(false);
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
      localStorage.removeItem("Token");
      toast.error(`Your Access token is not valid`, {
        position: "top-center",
      });
    }
    if (response.status === 200) {
      if (data.isAdmin === true) {
        setIsAdmin(true);
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
  return (
    <>
      {isAdmin ? <components.SideBar /> : ""}
      <Component />
    </>
  );
};

export default Protected;
