import React, { useState, useEffect } from "react";
import "./Login.css";

function Login() {
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const loginForm = document.querySelector("form.login");
    const loginText = document.querySelector(".title-text .login");

    if (isSignup) {
      loginForm.style.marginLeft = "-50%";
      loginText.style.marginLeft = "-50%";
    } else {
      loginForm.style.marginLeft = "0%";
      loginText.style.marginLeft = "0%";
    }
  }, [isSignup]);

  const handleSignupClick = () => {
    setIsSignup(true);
  };

  const handleLoginClick = () => {
    setIsSignup(false);
  };

  return (
    <div className="loginStyle">
      <div className="wrapper">
        <div className="title-text" style={{color:"black"}}>
          <div className="title login">Login Form</div>
          <div className="title signup">Signup Form</div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" name="slide" id="login" checked={!isSignup} readOnly />
            <input type="radio" name="slide" id="signup" checked={isSignup} readOnly />
            <label htmlFor="login" className="slide login" onClick={handleLoginClick}>
              Login
            </label>
            <label htmlFor="signup" className="slide signup" onClick={handleSignupClick}>
              Signup
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <form action="#" className="login">
              <div className="field">
                <input type="text" placeholder="Email Address" required />
              </div>
              <div className="field">
                <input type="password" placeholder="Password" required />
              </div>
              <div className="pass-link">
                <a href="#">Forgot password?</a>
              </div>
              <div className="field btnn">
                <div className="btnn-layer"></div>
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link">
                Not a member? <a href="#" onClick={handleSignupClick}>Signup now</a>
              </div>
            </form>
            <form action="#" className="signup">
              <div className="field">
                <input type="text" placeholder="Email Address" required />
              </div>
              <div className="field">
                <input type="password" placeholder="Password" required />
              </div>
              <div className="field">
                <input type="password" placeholder="Confirm password" required />
              </div>
              <div className="field btnn">
                <div className="btnn-layer"></div>
                <input type="submit" value="Signup" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
