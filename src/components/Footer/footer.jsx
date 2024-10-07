import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../../config";
import { useAuth } from "../../store/auth";
function Footer() {
  const { userdata , islogedIn} = useAuth();

  function reset() {
    document.getElementById("subEmail").value = "";
  }

  const [email, setEmail] = useState("");

  const handelEmail = (e) => {
    setEmail(e.target.value);
  };

  function checkEmail() {
    var mail = document.getElementById("subEmail").value;
    if (!mail.includes("@") || !mail.includes(".")) {
      toast.warn("Please enter a valid email", {
        position: "top-center",
      });
    } else {
      return true;
    }
  }
  const handelEmailSubmit = async (e) => {
    try {
      e.preventDefault();
      const pass = checkEmail();
      if (pass) {
        const emailResponse = await fetch(
          `${config.backendUrl}/subscribeEmail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );
        const emailData = await emailResponse.json();

        if (!(emailResponse.status === 422)) {
          reset();
          toast.success(`${emailData.message}`, {
            position: "top-center",
          });
        } else {
          if (emailData.extrD) {
            toast.error(`${emailData.msg + emailData.extrD}`, {
              position: "top-center",
            });
          } else {
            toast.error(`${emailData.message}`, {
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
  if (userdata.email !== null || userdata.email !== "") {
    setEmail(userdata.email);
  }
  if (!islogedIn) {
    setEmail("");
  }
}, [userdata.email, islogedIn]);

  return (
    <footer className="footer">
      <div className="footer-top section">
        <div className="container grid-list">
          <div className="footer-brand">
            <a href="#" className="logo"></a>

            <p className="footer-brand-text">
              Lorem ipsum dolor amet consecto adi pisicing elit sed eiusm tempor
              incidid unt labore dolore.
            </p>

            <div className="wrapper">
              <span className="span">Add:</span>

              <address className="address">70-80 Upper St Norwich NR2</address>
            </div>

            <div className="wrapper">
              <span className="span">Call:</span>

              <a href="tel:+011234567890" className="footer-link">
                +01 123 4567 890
              </a>
            </div>

            <div className="wrapper">
              <span className="span">Email:</span>

              <a href="mailto:info@eduweb.com" className="footer-link">
                info@eduweb.com
              </a>
            </div>
          </div>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Online Platform</p>
            </li>

            <li>
              <Link to="/About">About</Link>
            </li>

            <li>
              <Link to="/Contact">Contact Us</Link>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Links</p>
            </li>

            <li>
              <Link to="/SignIn">Sign In/Registration</Link>
            </li>

            <li>
              <Link to="/ComingSoon">Coming Soon</Link>
            </li>
          </ul>

          <div className="footer-list">
            <p className="footer-list-title">Contacts</p>

            <p className="footer-list-text">
              Enter your email address to register to our newsletter
              subscription
            </p>

            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                name="email"
                id="subEmail"
                value={email}
                onChange={handelEmail}
                className="input-field"
                style={{"color": "black"}}
              />

              <button
                type="button"
                className="btn has-before"
                onClick={handelEmailSubmit}
              >
                <span className="span">Subscribe</span>

                <ion-icon
                  name="arrow-forward-outline"
                  aria-hidden="true"
                ></ion-icon>
              </button>
            </form>

            <ul className="social-list">
              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-facebook"></ion-icon>
                </a>
              </li>

              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-linkedin"></ion-icon>
                </a>
              </li>

              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-instagram"></ion-icon>
                </a>
              </li>

              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-twitter"></ion-icon>
                </a>
              </li>

              <li>
                <a href="#" className="social-link">
                  <ion-icon name="logo-youtube"></ion-icon>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
