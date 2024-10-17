import React, { useState } from "react";
import { useEffect } from "react";
import styleAbout from "../About/About.module.css";
import { Link } from "react-router-dom";
const About = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (entry.isIntersecting) {
          document
            .querySelector(`nav li a[href="#${id}"]`)
            .parentElement.classList.add(styleAbout.active);
        } else {
          document
            .querySelector(`nav li a[href="#${id}"]`)
            .parentElement.classList.remove(styleAbout.active);
        }
      });
    });

    // Track all sections that have an `id` applied
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      // Clean up the observer on component unmount
      observer.disconnect();
    };
  }, []);

  const [selectedTab, setSelectedTab] = useState(true);
  const aboutStyles = {
    display: selectedTab ? "block" : "none",
    textDecorationLine: selectedTab ? "underline" : "none",
    color: selectedTab ? "#1AB79D" : "black",
  };

  const joinStyles = {
    display: selectedTab ? "none" : "block",
    textDecorationLine: selectedTab ? "none" : "underline",
    color: selectedTab ? "black" : "#1AB79D",
  };

  const changeSelectedTab = () => {
    setSelectedTab((prevTab) => !prevTab);
  };

  return (
    <div className="container">
      <div className={styleAbout.about}>
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="default-tab"
            style={{
              justifyContent: "center",
              display: "flex",
              gap: "5rem",
              marginBottom: "1rem",
              marginTop: "1rem",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            <li className="me-2" role="presentation">
              <button
                className="inline-block p-4  rounded-t-lg  hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                id="about-Us"
                data-tabs-target="#about"
                type="button"
                style={{
                  textDecorationLine: aboutStyles.textDecorationLine,
                  color: aboutStyles.color,
                }}
                onClick={changeSelectedTab}
              >
                Privacy Policy
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                className="inline-block p-4  rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                id="join"
                data-tabs-target="#join"
                type="button"
                style={{
                  textDecorationLine: joinStyles.textDecorationLine,
                  color: joinStyles.color,
                }}
                onClick={changeSelectedTab}
              >
                Terms & Conditions
              </button>
            </li>
          </ul>
        </div>
        <div id="default-tab-content">
          <div style={{ display: aboutStyles.display }} id="aboutUsBody">
            <div className={styleAbout.stickybtn}>
              <a href="#">
                <button className={styleAbout.button}>
                  <svg className={styleAbout.svgIcon} viewBox="0 0 384 512">
                    <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
                  </svg>
                </button>
              </a>
            </div>
            <main>
              <div className="darkmode">
                <section id="aboutScholarHub">
                  <h1
                    className="text-4xl"
                    style={{
                      textAlign: "center",
                      marginBottom: "1rem",
                      textDecorationLine: "underline",
                      fontWeight: "400",
                    }}
                  >
                    Introduction
                  </h1>
                  <p>
                    We value your privacy and are committed to protecting your
                    personal information. This Privacy Policy outlines how we
                    collect, use, and protect your data when you use our library
                    management system and online study platform. We collect
                    personal data such as your name, email address, and login
                    credentials when you sign up using our form or third-party
                    services like Google, Facebook, GitHub, or Twitter. We also
                    collect information on the files you upload and download,
                    such as books or previous years' question papers.
                  </p>
                </section>
                <section id="ourMission">
                  <h2>
                    <b>Use of Data</b>
                  </h2>
                  <section id="ourMission1">
                    <h3>
                      <b>The data collected is used to:</b>
                    </h3>
                    <p>
                      <li className="list-disc legalDark">
                        Facilitate uploading and downloading of study materials
                      </li>
                      <li className="list-disc legalDark">Provide user support.</li>
                      <li className="list-disc legalDark">
                        Improve the functionality of the website.
                      </li>
                      <li className="list-disc legalDark">
                        Send account-related notifications and updates{" "}
                      </li>
                    </p>
                  </section>
                  <section id="ourMission2">
                    <h3>
                      <b>Third-Party Services</b>
                    </h3>
                    <p>
                      We use third-party services such as Google, Facebook,
                      GitHub, and Twitter for authentication, and these
                      platforms may also collect information about you. We also
                      use analytics tools to improve user experience.
                    </p>
                    <h3>
                      <b>Data Security</b>
                    </h3>
                    <p>
                      We use industry-standard encryption and security practices
                      to protect your data. However, no system is 100% secure,
                      and we cannot guarantee the absolute security of your
                      information.
                    </p>
                    <h3>
                      <b>User Rights</b>
                    </h3>
                    <p>
                      You have the right to access, correct, or delete your
                      personal data. You may also withdraw your consent to data
                      collection at any time.
                    </p>
                    <h3>
                      <b>Contact Information</b>
                    </h3>
                    <p>
                      For any questions or concerns about this Privacy Policy,
                      please contact us at{" "}
                      <b style={{ "color": "blue" }}>
                   
                        <Link to={"mailto:ScholarHubOfficial.help@gmail.com"} target="_blank">
                          ScholarHubOfficial.help@gmail.com
                        </Link>
                      </b>
                    </p>
                  </section>
                </section>
                <section id="whatWeOffer">
                  <h2>
                    <b>Disclaimer</b>
                  </h2>
                  <section id="whatWeOffer1">
                    <h3>
                      <b>General Information</b>
                    </h3>
                    <p>
                      The content on this platform is for educational purposes
                      only. We make no guarantees regarding the accuracy or
                      completeness of the uploaded materials, such as books and
                      question papers.
                    </p>
                  </section>
                  <section id="whatWeOffer2">
                    <h3>
                      <b>Third-Party Links</b>
                    </h3>
                    <p>
                      We may provide links to external sites for convenience. We
                      are not responsible for the content on these third-party
                      sites.
                    </p>
                  </section>
                </section>
                <section id="whyus">
                  <h2>
                    <b>Cookie Policy</b>
                  </h2>
                  <section id="Cookies">
                    <h2>
                      <b>What Cookies Are</b>
                    </h2>
                    <p>
                      Cookies are small text files that are stored on your
                      device when you visit our website.
                    </p>
                    <h2>
                      <b>Types of Cookies We Use</b>
                    </h2>
                    <p>
                      <li className="list-disc legalDark">
                        <b>Necessary Cookies:</b> Required for the website to
                        function properly.
                      </li>
                      <li className="list-disc legalDark">
                        <b>Analytical Cookies:</b> Used to track user behavior
                        and improve the platform.
                      </li>
                    </p>
                    <h2>
                      <b> We use cookies to:</b>
                    </h2>
                    <p>
                      <li className="list-disc legalDark">
                        Save your login preferences.
                      </li>
                      <li className="list-disc legalDark">
                        Analyze site usage to improve functionality.
                      </li>
                    </p>
                    <h2>
                      <b>How to Control Cookies</b>
                    </h2>
                    <p>
                      You can manage or block cookies through your browser
                      settings. However, blocking cookies may affect the
                      functionality of the site.
                    </p>
                  </section>
                </section>
              </div>
              <nav className={styleAbout.sectionNav}>
                <ol>
                  <li>
                    <a href="#aboutScholarHub">Introduction</a>
                  </li>
                  <li>
                    <a href="#ourMission">Use of Data</a>
                    <ul>
                      <li>
                        <a href="#ourMission1">
                          The data collected is used to:
                        </a>
                      </li>
                      <li>
                        <a href="#ourMission2">Third-Party Services</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#whatWeOffer">Disclaimer</a>
                    <ul>
                      <li>
                        <a href="#whatWeOffer1">General Information</a>
                      </li>
                      <li>
                        <a href="#whatWeOffer2">Third-Party Links</a>
                      </li>
                    </ul>
                    <a href="#whyus">Cookie Policy</a>
                  </li>
                  <li>
                    <a href="#Cookies">Conclusion</a>
                    <ul>
                      <li>
                        <a href="#powerhouse1"></a>
                      </li>
                    </ul>
                  </li>
                </ol>
                <div className={styleAbout.backToTopBtn}>
                  <a href="#about-Us">
                    <button className={styleAbout.button}>
                      <svg className={styleAbout.svgIcon} viewBox="0 0 384 512">
                        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
                      </svg>
                    </button>
                  </a>
                </div>
              </nav>
            </main>
          </div>
          <div id="joinbody" style={{ display: joinStyles.display }}>
            <div className={styleAbout.stickybtn}>
              <a href="#">
                <button className={styleAbout.button}>
                  <svg className={styleAbout.svgIcon} viewBox="0 0 384 512">
                    <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
                  </svg>
                </button>
              </a>
            </div>
            <main>
              <div className="darkmode">
                <section id="intro">
                  <h1
                    className="text-4xl"
                    style={{
                      textAlign: "center",
                      marginBottom: "1rem",
                      textDecorationLine: "underline",
                      fontWeight: "400",
                    }}
                  >
                    Terms and Conditions
                  </h1>
                  <p>
                  These Terms and Conditions govern your use of our library management system and online study platform. By accessing or using the website, you agree to these terms.
                  </p>
                </section>
                <section id="getStarted">
                  <h2><b>User Responsibilities</b></h2>
                  <p>
                    <li className="list-disc legalDark">You are responsible for the accuracy of the information you provide when signing up.</li>
                    <li className="list-disc legalDark">You may not upload any unlawful or inappropriate content.</li>
                    <li className="list-disc legalDark">You agree not to misuse the platform or its resources.</li>
                  </p>
                  <section id="getStarted1">
                    <h3><b>Intellectual Property</b></h3>
                    <p>
                    All content, including uploaded books and question papers, belongs to the respective rights holders. You are responsible for ensuring that any materials you upload do not infringe on intellectual property rights.
                    </p>
                  </section>
                  <section id="getStarted2">
                    <h3><b>Liability Limitations</b></h3>
                    <p>
                    We are not responsible for the accuracy of the content uploaded by users. The platform is provided "as is," and we are not liable for any issues or damages arising from your use of the website.
                    </p>
                    
                  </section>
                  <section id="getStarted3">
                  <h3><b>Termination</b></h3>
                    <p>
                    We reserve the right to terminate or suspend user accounts if these Terms are violated.
                    </p>
                  </section>
                </section>
                <section id="Regt-tour">
                  <h2><b>Refund Policy (If applicable)</b></h2>
                  <section id="Regt-tour1">
                    <h3><b>Eligibility for Refund</b></h3>
                    <p>
                    Since the website offers free access to educational materials, no refunds apply unless specified for premium services or subscriptions.
                    </p>
                  </section>
                </section>
                
                
                
              </div>
              <nav className={styleAbout.sectionNav}>
                <ol>
                  <li>
                    <a href="#intro">Terms and Conditions</a>
                  </li>
                  <li>
                    <a href="#getStarted">User Responsibilities</a>
                    <ul>
                      <li>
                        <a href="#getStarted1">Intellectual Property</a>
                      </li>
                      <li>
                        <a href="#getStarted2">Liability Limitations</a>
                      </li>
                      <li>
                        <a href="#getStarted3">Termination</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#Regt-tour">Refund Policy (If applicable)</a>
                    <ul>
                      <li>
                        <a href="#Regt-tour1" style={{ textWrap: "nowrap" }}>
                        Eligibility for Refund
                        </a>
                      </li>
                      
                    </ul>
                  </li>
                 
                </ol>
                <div className={styleAbout.backToTopBtn}>
                  <a href="#join">
                    <button className={styleAbout.button}>
                      <svg className={styleAbout.svgIcon} viewBox="0 0 384 512">
                        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
                      </svg>
                    </button>
                  </a>
                </div>
              </nav>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
