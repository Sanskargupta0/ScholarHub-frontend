import { useAuth } from "../../store/auth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const { logoutUser } = useAuth();
  useEffect(() => {
    logoutUser();
  }, []);
  return <Navigate to="/login" />;
}
