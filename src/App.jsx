import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { pages } from "./pages";
import { adminPages } from "./pages/Protected Pages/Admin";
import { components } from "./components";
import { initializeSocket, getSocket } from "./store/socketService";
import { useAuth } from "./store/auth";
function App() {
  const { islogedIn, userdata, setNewNotification } = useAuth();
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const socket = initializeSocket();

    socket.on("userCount", (count) => {
      setUserCount(count);
    });

    if (islogedIn) {
      socket.emit("authenticate", userdata.id);

      socket.on("newGlobalNotification", (notification) => {
        setNewNotification(notification);
      });
      socket.on("newNotification", (notification) => {
        setNewNotification(notification);
      });
    }

    return () => {
      socket.off("userCount");
      socket.off("newGlobalNotification");
      socket.off("newNotification");
    };
  }, [islogedIn, userdata.id]);

  return (
    <>
      <BrowserRouter>
        <components.Navbar />
        <Routes>
          <Route path="/" element={<pages.Home />} />
          <Route path="/about" element={<pages.About />} />
          <Route path="/contact" element={<pages.Contact />} />
          <Route path="/login" element={<pages.Login />} />
          <Route path="/OtpVerfication" element={<pages.OtpVerication />} />
          <Route path="/logout" element={<pages.Logout />} />
          <Route
            path="/dashboard"
            element={<pages.Protected Component={pages.Dashboard} />}
          />
          <Route
            path="/userProfile"
            element={<pages.Protected Component={pages.UserProfile} />}
          />
          <Route
            path="/notification"
            element={<pages.Protected Component={pages.Notification} />}
          />
          <Route
            path="/adminPanel"
            element={
              <adminPages.ProtectedForAdmin Component={adminPages.AdminPanel} />
            }
          />
          <Route path="*" element={<pages.Error />} />
        </Routes>
        <components.Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
