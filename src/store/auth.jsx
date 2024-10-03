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
  });

  const [rerun , setRerun ]=useState(true);
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
    });
    localStorage.removeItem("Token");
  };
  // Get user data from backend using token
  const getUserData = async (token) => {
    try {
      const res = await fetch(`${config.backendUrl}/userData`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
      } else {
        setUserData({
          id: data._id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          avatarURL: data.avatarURL,
          bookmarks: data.bookmarks,
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          github: data.github,
          rollNumber: data.rollNumber
        });
      }
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    if (token.token != null)
      getUserData(token.token);
  }, [token.token , rerun ]);


  return (
    <AuthContext.Provider
      value={{ storeTokenInLs, logoutUser, islogedIn, userdata, setRerunData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
