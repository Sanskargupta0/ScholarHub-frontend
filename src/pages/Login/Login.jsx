import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth";
import {
  auth,
  googleProvider,
  twitterProvide,
  facebookProvider,
  githubProvider,
} from "../../store/firebase-auth";
import { signInWithPopup } from "firebase/auth";
import { components } from "../../components";
import config from "../../config";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { storeTokenInLs, islogedIn } = useAuth();
  useEffect(() => {
    if (islogedIn) {
      toast.error(`You are Already Loged In`, {
        position: "top-center",
      });
      navigate("/dashboard");
    }
  }, []);

  const [login, setLogin] = useState({
    email: "",
    password: "",
    rememberMe: "",
  });

  const [loader, setLoader] = useState(false);

  const handleLogin = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setLogin({
      ...login,
      [name]: value,
    });
  };
  const handleRememberMe = () => {
    let rememberMe = login.rememberMe;
    if (rememberMe) {
      rememberMe = "";
    } else {
      rememberMe = "true";
    }
    setLogin({
      ...login,
      rememberMe: rememberMe,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });
      const responseData = await response.json();
      if (response.status === 200) {
        storeTokenInLs(responseData.token);
        toast.success(`${responseData.msg}`, {
          position: "top-center",
        });
        setLogin({
          email: "",
          password: "",
        });
        navigate("/dashboard");
      } else if (responseData.redirectedURL) {
        navigate(responseData.redirectedURL + `?email=${login.email}`);
      } else {
        toast.error(`${responseData.msg}`, {
          position: "top-center",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSocialLogin = async (e, provider) => {
    e.preventDefault();
    setLoader(true);
    try {
      const userData = await signInWithPopup(auth, provider);
      const response = await fetch(
        `${config.backendUrl}/loginWithSocialMedia`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({"token":userData._tokenResponse.idToken}),
        }
      );
      const responseData = await response.json();
      if (response.status === 200 || response.status === 201) {
        setLoader(false);
        storeTokenInLs(responseData.token);
        toast.success(`${responseData.msg}`, {
          position: "top-center",
        });
        navigate("/dashboard");
      } else {
        setLoader(false);
        toast.error(`${responseData.msg}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error("Login failed", {
        position: "top-center",
      });
    }
  };

  const [isSignup, setIsSignup] = useState(false);

  const nevigate = useNavigate();
  function checkInput() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var cpassword = document.getElementById("cpassword").value;

    if (firstName.length < 4) {
      toast.warn("First name should be at least 4 characters long", {
        position: "top-center",
      });
    } else if (lastName.length < 4) {
      toast.warn("Last name should be at least 4 characters long", {
        position: "top-center",
      });
    } else if (email === "") {
      toast.warn("Please enter your email", {
        position: "top-center",
      });
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.warn("Please enter a valid email address", {
        position: "top-center",
      });
    } else if (password === "") {
      toast.warn("Please enter your password", {
        position: "top-center",
      });
    } else if (cpassword === "") {
      toast.warn("Please enter your confirm password", {
        position: "top-center",
      });
    } else if (password !== cpassword) {
      toast.warn("Password and confirm password do not match", {
        position: "top-center",
      });
    } else {
      return true;
    }
  }

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleUser = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleRegistration = async (e) => {
    try {
      e.preventDefault();
      const pass = checkInput();
      if (pass) {
        const registrationResponse = await fetch(
          `${config.backendUrl}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        const registrationData = await registrationResponse.json();
        if (registrationResponse.status === 201) {
          setUser({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          });
          document.getElementById("password").value = "";
          toast.success(`${registrationData.msg}`, {
            position: "top-center",
          });
          nevigate(`/otpVerfication?email=${user.email}`);
        } else {
          if (registrationData.extrD === undefined) {
            toast.error(`${registrationData.msg}`, {
              position: "top-center",
            });
          } else {
            toast.error(`${registrationData.msg + registrationData.extrD}`, {
              position: "top-center",
            });
          }
        }
      }
    } catch (error) {
      console.log({ err: error });
    }
  };

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
    <>
      {loader ? (
        <div
          className="loader"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "10rem",
            marginBottom: "10rem",
          }}
        >
          <components.Loader />
          <div className="font-semibold text-xl text-lime-600">
            <h2
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginLeft: "1rem",
                marginRight: "1rem",
              }}
            >
              <br />
              Your Verification is in progress
            </h2>
          </div>
        </div>
      ) : (
        <div className="loginStyle">
          <div className="wrapper">
            <div className="title-text" style={{ color: "black" }}>
              <div className="title login">Login Form</div>
              <div className="title signup">Signup Form</div>
            </div>
            <div className="form-container">
              <div className="slide-controls">
                <input
                  type="radio"
                  name="slide"
                  id="login"
                  checked={!isSignup}
                  readOnly
                />
                <input
                  type="radio"
                  name="slide"
                  id="signup"
                  checked={isSignup}
                  readOnly
                />
                <label
                  htmlFor="login"
                  className="slide login"
                  onClick={handleLoginClick}
                >
                  Login
                </label>
                <label
                  htmlFor="signup"
                  className="slide signup"
                  onClick={handleSignupClick}
                >
                  Signup
                </label>
                <div className="slider-tab"></div>
              </div>
              <div className="form-inner">
                <form action="#" className="login">
                  <div className="field">
                    <input
                      type="email"
                      id="loginEmail"
                      maxLength="254"
                      name="email"
                      value={login.email}
                      onChange={handleLogin}
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="password"
                      id="loginPassword"
                      name="password"
                      value={login.password}
                      onChange={handleLogin}
                      autoComplete="off"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="flex mt-4">
                    <label
                      className="container"
                      style={{ maxWidth: "max-content", marginRight: "1rem" }}
                    >
                      <input
                        type="checkbox"
                        name="rememberMe"
                        onClick={handleRememberMe}
                      />
                      <div
                        className="checkmark"
                        style={{ marginLeft: "12px" }}
                      ></div>
                    </label>
                    <label style={{ fontSize: "1em" }}>Remember me</label>
                    <Link
                      to={
                        "/otpVerfication?email=" +
                        login.email +
                        "&mode=ResetPassword"
                      }
                      className="forget-password"
                    >
                      Forget Password?
                    </Link>
                  </div>
                  <div className="field btnn">
                    <div className="btnn-layer"></div>
                    <input
                      type="button"
                      value="Login"
                      id="login"
                      onClick={handleLoginSubmit}
                    />
                  </div>
                  <div className="signup-link">
                    Not a member?{" "}
                    <a href="#" onClick={handleSignupClick}>
                      Signup now
                    </a>
                  </div>
                  <div className="continueWithGoogle">
                    <button
                      className="button"
                      type="button"
                      onClick={(e) => {
                        handleSocialLogin(e, googleProvider);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid"
                        viewBox="0 0 256 262"
                        className="svg"
                      >
                        <path
                          fill="#4285F4"
                          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                          className="blue"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                          className="green"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                          className="yellow"
                        ></path>
                        <path
                          fill="#EB4335"
                          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                          className="red"
                        ></path>
                      </svg>
                      <span className="text">Continue with Google</span>
                    </button>
                  </div>
                  <div className="loginContainer">
                    <div className="parent">
                      <div className="child child-1">
                        <button
                          className="button btn-1"
                          onClick={(e) => {
                            handleSocialLogin(e, twitterProvide);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 512 512"
                            fill="#1e90ff"
                          >
                            <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="child child-3">
                        <button
                          className="button btn-3"
                          onClick={(e) => {
                            handleSocialLogin(e, githubProvider);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 496 512"
                          >
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="child child-4">
                        <button
                          className="button btn-4"
                          onClick={(e) => {
                            handleSocialLogin(e, facebookProvider);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 320 512"
                            fill="#4267B2"
                          >
                            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <form action="#" className="signup">
                  <div className="field">
                    <input
                      type="text"
                      placeholder="First Name"
                      id="firstName"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleUser}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Last Name"
                      id="lastName"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleUser}
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user.email}
                      onChange={handleUser}
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="password"
                      placeholder="Password"
                      id="password"
                      required
                    />
                  </div>
                  <div className="field">
                    <input
                      type="password"
                      placeholder="Confirm password"
                      id="cpassword"
                      name="password"
                      value={user.password}
                      onChange={handleUser}
                      required
                    />
                  </div>
                  <div className="field btnn">
                    <div className="btnn-layer"></div>
                    <input
                      type="button"
                      value="Signup"
                      onClick={handleRegistration}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
