import React, { useState } from "react";
import { useEffect } from "react";
import styleAbout from "./About.module.css";
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
    color: selectedTab ?  "black":"#1AB79D",
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
                style={{ textDecorationLine: aboutStyles.textDecorationLine,
                color: aboutStyles.color
                 }}
                onClick={changeSelectedTab}
              >
                About Us
              </button>
            </li>
            <li className="me-2" role="presentation">
              <button
                className="inline-block p-4  rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                id="join"
                data-tabs-target="#join"
                type="button"
                style={{ textDecorationLine: joinStyles.textDecorationLine,
                color: joinStyles.color
                 }}
                onClick={changeSelectedTab}
              >
                How To Join ?
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
                    About ScholarHub
                  </h1>
                  <p>
                  Welcome to the University Library, your gateway to an extensive world of knowledge, research, and academic support. We are dedicated to fostering a rich learning environment that helps students, faculty, and researchers access the information they need quickly and easily. Our library is designed to serve as an academic hub that combines both traditional resources and innovative digital solutions, ensuring that users can leverage the best tools for their educational journey.
                  </p>
                </section>
                <section id="ourMission">
                  <h2><b>Key Features of Our Library Website:</b></h2>
                  <section id="ourMission1">
                    <h3><b>Book Issuing & Returning</b></h3>
                    <p>
                    Our website offers seamless book issuing and returning services for all registered users. Whether you prefer to browse our physical collection or search our online catalog, you can easily:<br/>
                    - Search for available books in various subjects. <br/>
                    - Reserve books online for pick-up at your convenience.<br/>
                    - Check the status of your borrowed books, due dates, and overdue alerts.<br/>
                    - Return books with a simple online return process, making it easier to manage your loans.<br/>
                    </p>
                  </section>
                  <section id="ourMission2">
                    <h3><b>Access to Previous Year Question Papers (PYQs)</b></h3>
                    <p>
                    We understand the importance of exam preparation, which is why we provide access to a comprehensive database of <b>previous year question papers</b>. Students can search and download past exam papers from various courses and departments to aid in their studies. This archive is regularly updated, helping students review patterns and better understand the types of questions asked in past exams.
                    <br/>
                    By reviewing PYQs, students can identify recurring question patterns, better understand examination formats, and gain insight into what areas of the syllabus are frequently tested.
                    </p>
                  </section>
                </section>
                <section id="whatWeOffer">
                  <h2><b>AI features</b></h2>
                  <section id="whatWeOffer1">
                    <h3>
                    <b>AI-Powered Solutions for PYQs</b>
                    </h3>
                    <p>
                    To make studying even more efficient, our website integrates advanced <b>AI features</b> for logged-in users. By utilizing these tools, you can: <br/>
                    - Get instant solutions and explanations for previous year question papers.<br/>
                    - Receive personalized recommendations for study materials based on the PYQs.<br/>
                    - Explore possible questions that may appear in future exams, based on AI analysis of past trends.<br/>
                    This cutting-edge technology enables students to prepare strategically and gain deeper insights into their coursework.<br/>
                    </p>
                  </section>
                  <section id="whatWeOffer2">
                    <h3><b>Online Assistance and Support</b></h3>
                    <p>
                    We know that navigating academic resources can sometimes be challenging. That's why we offer <b>real-time support</b> through: <br/>
                    - <b>Live Chat with Librarians:</b> Get quick answers to your questions or guidance on finding resources via our live chat feature.<br/>
                    - <b>Research Consultations:</b> Schedule one-on-one consultations with our librarians to receive in-depth assistance on research projects, paper citations, or utilizing our digital resources effectively.
                    - <b>FAQs and Tutorials:</b> Browse through a curated list of frequently asked questions or access video tutorials that guide you on how to make the most out of the library’s online tools.

                    </p>
                  </section>
                </section>
                <section id="whyus">
                  <h2><b>Why Choose Our Library?</b></h2>
                  <section id="powerhouse1">
                    <h2><b>University Library</b></h2>
                    <p>
                     
                    Our mission is to support the academic success of our university community by providing easy access to valuable resources. We continuously update our services to meet the evolving needs of students and faculty, blending traditional library services with innovative digital tools for an unparalleled learning experience.
                    </p>
                  </section>
        

                </section>  
              </div>
              <nav className={styleAbout.sectionNav}>
                <ol>
                  <li>
                    <a href="#aboutScholarHub">About ScholarHub</a>
                  </li>
                <li>
                    <a href="#ourMission">Feature's offered</a>
                    <ul>
                      <li>
                        <a href="#ourMission1">Issue & Return</a>
                      </li>
                      <li>
                        <a href="#ourMission2">Previous year Question's</a>
                      </li>
                    </ul>
                  </li>
                <li>
                    <a href="#whatWeOffer">AI-Features</a>
                    <ul>
                      <li>
                        <a href="#whatWeOffer1">AI powered Answers</a>
                      </li>
                      <li>
                        <a href="#whatWeOffer2">Assistance & Support</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#whyus">Conclusion</a>
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
                    How to join ScholarHub
                  </h1>
                  <p>
                  <b>Welcome to ScholarHub – Empowering Your Academic Success! <br/></b>
                  ScholarHub is designed to be your go-to platform for all things academic, providing an array of resources to help you stay on top of your studies, prepare for exams, and engage with valuable learning materials. Whether you’re a student, educator, or lifelong learner, ScholarHub offers a user-friendly experience tailored to meet your educational needs.
                  </p>
                </section>
                <section id="getStarted">
                  <h2><b>Getting Started: Explore Without Signing Up</b></h2>
                  <section id="getStarted1">
                    <h3>Visit the ScholarHub Website:</h3>
                    <p>
                    At ScholarHub, we understand the need for quick access to information, so we've made it easy to <b>explore the platform without logging in</b>. As a guest, you can:
                    </p>
                  </section>
                  <section id="getStarted2">
                    <h3><b>Explore Available Resources:</b></h3>
                    <p> 
                    - Browse through previous years' question papers across various subjects and disciplines.<br/>
                    - View page details and content for research, preparation, or curiosity.
                    <br />
                    This means you can start gaining insights and gathering information the moment you land on the site. No barriers, just seamless access to valuable content.
                    </p>
                  </section>
                </section>
                <section id="Regt-tour">
                  <h2><b>Unlock Advanced Features with a Free Account</b></h2>
                  <section id="Regt-tour1">
                    <p>To enhance your ScholarHub experience, signing up for an account opens the door to a host of advanced features that make your learning experience more engaging and efficient. By creating an account, you can:</p>
                    <p>
                  <h3><b>Download question papers for offline study, ensuring you have access whenever you need it</b></h3>
                  - Use <b>AI-powered tools</b> that can help you generate study plans, summarize complex topics, and offer personalized learning recommendations.<br/>
                  - <b>Issue and return books</b> from our digital or physical libraries, providing the convenience of academic resources at your fingertips.<br/>
                  - <b>Track late fines and make payments</b> easily through your ScholarHub account, ensuring you stay on top of your responsibilities.<br/>
                    </p>
                  </section>
                   <section id="Regt-tour2">
                    <h3><b>Simple Sign-Up Process: Your Gateway to Learning</b></h3>
                    <p>
                    To access these features, simply click the <b>"Join" button</b> at the top of the homepage. ScholarHub offers several ways to sign up, giving you flexibility and ease of use:
                    </p>
                  </section>
                </section>
                <section id="prep4tour">
                  <h2><b>SignIn/Login</b></h2>
                  <section id="prep4tour1">
                    <p>
                    <b>Sign up with your personal details:</b> Provide your first name, last name, email address, and password to create a standard account.
                    </p>
                    <p>
                     <b>Continue with Social Media or GitHub</b>: Prefer a quicker sign-up? You can easily create your account using <b>Google</b>, <b>GitHub</b>, <b>Twitter</b>, or <b>Facebook</b>. Just a few clicks and you’re ready to explore all that ScholarHub has to offer!
                    </p>
                  </section>
                  <section id="prep4tour2">
                    <h2><b>Personalized Experience at Your Fingertips</b></h2>
                    <p>
                    Once you're logged in, ScholarHub customizes your dashboard based on your academic interests and preferences. You can:<br/>
                    - Save your favorite resources and materials for easy access.<br/>
                    - Track your progress on borrowed books, late fines, and upcoming deadlines.<br/>
                    - Receive recommendations for study guides, papers, and books that align with your academic journey<br/>.
                    - Stay updated on new resources, question papers, and learning tools tailored to your subjects of interest.<br/>
                    </p>
                  </section>
                  <section id="prep4tour3">
                    <h2>Why Wait? Join ScholarHub Today!</h2>
                    <p>
                    Whether you’re preparing for exams, conducting research, or simply expanding your knowledge, ScholarHub makes it easy to access and manage academic resources. Join today and take the next step in your academic journey with all the tools and features you need, right at your fingertips.
                    </p>
                  </section>
                </section> 
                <section id="fun-enjoy">
                  <h2 className="text-2xl " style={{ marginBottom: "1rem" }}>
                    <b>Conclusion</b>
                  </h2>
                  
                </section>
                <section id="connected">
                  <h2 className="text-2xl" style={{ marginBottom: "1rem" }}>
                  Empower Your Learning Journey with ScholarHub
                  </h2>
                  <p style={{ marginBottom: "2rem" }}>
                  ScholarHub is more than just a resource hub—it's your academic partner, designed to make learning easier, more efficient, and personalized. Whether you're accessing previous years' question papers without logging in or utilizing our advanced features like AI-powered tools, downloading materials, or managing book loans, ScholarHub provides everything you need to succeed academically.<br/>

                  By creating an account, you unlock a wealth of resources and tools that cater to your unique learning style and academic goals. Don’t miss out on the opportunity to enhance your education—<b>sign up today</b> and start your journey with ScholarHub. With just a few clicks, you’ll have the power of knowledge at your fingertips, ready to help you thrive in your studies!.
                  </p>
                </section>
              </div>
              <nav className={styleAbout.sectionNav}>
                <ol>
                  <li>
                    <a href="#intro">Introduction</a>
                  </li>
                  <li>
                    <a href="#getStarted">How to get started</a>
                    <ul>
                      <li>
                        <a href="#getStarted1">Visit ScholarHub</a>
                      </li>
                      <li>
                        <a href="#getStarted2">Instant Access</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#Regt-tour">Advanced-Features</a>
                    <ul>
                      <li>
                        <a href="#Regt-tour1" style={{ textWrap: "nowrap" }}>
                          Options available
                        </a>
                      </li>
                      <li>
                        <a href="#Regt-tour2">How to Join</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#prep4tour">Sign-Up/Login</a>
                    <ul>
                      <li>
                        <a href="#prep4tour1">Create Your Account</a>
                      </li>
                      <li>
                        <a href="#prep4tour2">Personalize your experience</a>
                      </li>
                      <li>
                        <a href="#prep4tour3">Start Learning</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#fun-enjoy">Conclusion</a>
                  </li>
                  <li>
                    <a href="#connected">Academic Empowerment</a>
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
