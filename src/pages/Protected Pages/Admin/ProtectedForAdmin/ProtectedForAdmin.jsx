import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/auth";
import config from "../../../../config";
const ProtectedForAdmin = (props) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { Component } = props;
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
    } else if (response.status === 200) {
      if (data.isAdmin !== true) {
        navigate("/dashboard");
        toast.error(`You are not Admin`, {
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
  return <Component />;
};

export default ProtectedForAdmin;
