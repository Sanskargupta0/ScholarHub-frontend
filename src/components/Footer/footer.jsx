import React from "react";
import "./footer.css";
function Footer() {
  return (
    <footer
      className="footer"
      
    >
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
              <a href="#" className="footer-link">
                About
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Courses
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Instructor
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Events
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Instructor Profile
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Purchase Guide
              </a>
            </li>
          </ul>

          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Links</p>
            </li>

            <li>
              <a href="#" className="footer-link">
                Contact Us
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Gallery
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                News & Articles
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                FAQ's
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Sign In/Registration
              </a>
            </li>

            <li>
              <a href="#" className="footer-link">
                Coming Soon
              </a>
            </li>
          </ul>

          <div className="footer-list">
            <p className="footer-list-title">Contacts</p>

            <p className="footer-list-text">
              Enter your email address to register to our newsletter
              subscription
            </p>

            <form action="" className="newsletter-form">
              <input
                type="email"
                name="email_address"
                placeholder="Your email"
                required
                className="input-field"
              />

              <button type="submit" className="btn has-before">
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

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            Copyright 2022 All Rights Reserved by{" "}
            <a href="#" className="copyright-link">
              codewithsadee
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
