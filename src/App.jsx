import React, { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { pages } from "./pages";
import { components } from "./components";
function App() {
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
          <Route path="/dashboard" element={
            <pages.Protected Component={pages.Dashboard} />
          } />
          <Route path="/userProfile" element={
            <pages.Protected Component={pages.UserProfile} />
          } />
          <Route path="/notification" element={
            <pages.Protected Component={pages.Notification} />
          } />
          <Route path="*" element={<pages.Error />} />
        </Routes>
        <components.Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
