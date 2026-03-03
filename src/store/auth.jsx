import { createContext, useContext, useEffect, useState } from "react";
export const AuthContext = createContext();
import config from "../config";

export const Authprovider = ({ children }) => {
  // storing token in state
  const [token, setToken] = useState({ token: localStorage.getItem("Token") });
  // storing user data in state
  const [userdata, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatarURL: "",
    bookmarks: [],
    facebook: "",
    instagram: "",
    twitter: "",
    github: "",
    rollNumber: "",
    notifications: [],
  });

  const [newNotification, setNewNotification] = useState({});
  const [globalNotification, setGlobalNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [rerun, setRerun] = useState(true);
  // checking if user is logged in or not
  const islogedIn = !!token.token;
  
  // logout user
  const logoutUser = () => {
    setToken({ token: null });
    setUserData({
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      avatarURL: null,
      bookmarks: null,
      facebook: null,
      instagram: null,
      twitter: null,
      github: null,
      rollNumber: null,
      notifications: null,
    });
    setGlobalNotification([]);
    setNewNotification({});
    localStorage.removeItem("Token");
  };
  
  // Get user data from backend using token
  const getUserData = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${config.backendUrl}/userData`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Failed to fetch user data:", data);
        setError("Failed to load user data");
      } else {
        setUserData({
          id: data._id || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          avatarURL: data.avatarURL || "",
          bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          github: data.github || "",
          rollNumber: data.rollNumber || "",
          notifications: Array.isArray(data.notifications) ? data.notifications : [],
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Network error while loading user data");
    } finally {
      setLoading(false);
    }
  };
  
  // get Global Notification
  const getGlobalNotification = async (token) => {
    try {
      const res = await fetch(`${config.backendUrl}/getGobalNotification`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Failed to fetch global notifications:", data);
      } else {
        // Ensure we're working with an array and set it
        setGlobalNotification(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching global notifications:", error);
    }
  };

  // store token in local storage
  const storeTokenInLs = (token) => {
    localStorage.setItem("Token", token);
    setToken({ token: token });
  };
  
  const setRerunData = () => {
    setRerun(!rerun);
  };

  // Load user data and notifications when token changes or rerun is triggered
  useEffect(() => {
    if (token.token) {
      // Load user data and notifications in parallel
      getUserData(token.token);
      getGlobalNotification(token.token);
    }
  }, [token.token, rerun]);

  return (
    <AuthContext.Provider
      value={{
        storeTokenInLs,
        logoutUser,
        islogedIn,
        userdata,
        setUserData,
        setRerunData,
        newNotification,
        setNewNotification,
        globalNotification,
        setGlobalNotification,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
