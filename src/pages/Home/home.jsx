import React from "react";
import { images } from "../../assets";
import "./home.css";
function Home() {
  return (
    <main>
      <article>
        <section
          className="section hero has-bg-image"
          id="home"
          aria-label="home"
          style={{ backgroundImage: `url(${images.hero_bg})` }}
        >
          <div className="container">
            <div className="hero-content">
              <h1 className="h1 section-title">
              Borrow and Reserve Books <span className="span">Enroll</span> for
                Advance AI
              </h1>

              <p className="hero-text">
              Access textbooks, research papers, previous year papers, and study guides covering all subjects and academic levels.
              </p>

              <a href="#" className="btn has-before">
                <span className="span">Find Books</span>

                <ion-icon
                  name="arrow-forward-outline"
                  aria-hidden="true"
                ></ion-icon>
              </a>
            </div>

            <figure className="hero-banner">
              <div
                className="img-holder one"
                style={{ width: "270", height: "300" }}
              >
                <img
                  src={images.hero_banner_1}
                  width="270"
                  height="300"
                  alt="hero banner"
                  className="img-cover"
                />
              </div>

              <div
                className="img-holder two"
                style={{ width: "240", height: "370" }}
              >
                <img
                  src={images.hero_banner_2}
                  width="240"
                  height="370"
                  alt="hero banner"
                  className="img-cover"
                />
              </div>

              <img
                src={images.hero_shape_1}
                width="380"
                height="190"
                alt=""
                className="shape hero-shape-1"
              />

              <img
                src={images.hero_shape_2}
                width="622"
                height="551"
                alt=""
                className="shape hero-shape-2"
              />
            </figure>
          </div>
        </section>

        <section className="section category" aria-label="category">
          <div className="container">
            <p className="section-subtitle">Categories</p>

            <h2 className="h2 section-title">
              Online <span className="span">Books</span> For Remote Learning.
            </h2>

            <p className="section-text">
            Library Events and Updates
            </p>

            <ul className="grid-list">
              <li>
                <div
                  className="category-card"
                  style={{ color: "170, 75%, 41%" }}
                >
                  <div className="card-icon">
                    <img
                      src={images.category_1}
                      width="40"
                      height="40"
                      loading="lazy"
                      alt="Online Degree Programs"
                      className="img"
                    />
                  </div>

                  <h3 className="h3">
                    <a href="#" className="card-title">
                    Academic Resources
                    </a>
                  </h3>

                  <p className="card-text">
                  Access textbooks, research papers, previous year papers, and study guides covering all subjects and academic levels.
                  </p>

                </div>
              </li>

              <li>
                <div
                  className="category-card"
                  style={{ color: "351, 83%, 61%" }}
                >
                  <div className="card-icon">
                    <img
                      src={images.category_2}
                      width="40"
                      height="40"
                      loading="lazy"
                      alt="Non-Degree Programs"
                      className="img"
                    />
                  </div>

                  <h3 className="h3">
                    <a href="#" className="card-title">
                    Easy Digital Downloads
                    </a>
                  </h3>

                  <p className="card-text">
                  Download PDFs of previous year question papers, academic textbooks, and more for all semesters and trades.
                  </p>

                
                </div>
              </li>

              <li>
                <div
                  className="category-card"
                  style={{ color: "229, 75%, 58%" }}
                >
                  <div className="card-icon">
                    <img
                      src={images.category_3}
                      width="40"
                      height="40"
                      loading="lazy"
                      alt="Off-Campus Programs"
                      className="img"
                    />
                  </div>

                  <h3 className="h3">
                    <a href="#" className="card-title">
                    Interactive User Experience
                    </a>
                  </h3>

                  <p className="card-text">
                  Leave reviews, share reading lists, and track your progress for a seamless and engaging library experience.
                  </p>

                 
                </div>
              </li>

              <li>
                <div
                  className="category-card"
                  style={{ color: "42, 94%, 55%" }}
                >
                  <div className="card-icon">
                    <img
                      src={images.category_4}
                      width="40"
                      height="40"
                      loading="lazy"
                      alt="Hybrid Distance Programs"
                      className="img"
                    />
                  </div>

                  <h3 className="h3">
                    <a href="#" className="card-title">
                    Simple Book Reservations
                    </a>
                  </h3>

                  <p className="card-text">
                  Reserve books currently on loan and receive notifications when they become available.
                  </p>

                 
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="section about" id="about" aria-label="about">
          <div className="container">
            <figure className="about-banner">
              <div
                className="img-holder"
                style={{ width: "520", height: "370" }}
              >
                <img
                  src={images.about_banner}
                  width="520"
                  height="370"
                  loading="lazy"
                  alt="about banner"
                  className="img-cover"
                />
              </div>

              <img
                src={images.about_shape_1}
                width="360"
                height="420"
                loading="lazy"
                alt=""
                className="shape about-shape-1"
              />

              <img
                src={images.about_shape_2}
                width="371"
                height="220"
                loading="lazy"
                alt=""
                className="shape about-shape-2"
              />

              <img
                src={images.about_shape_3}
                width="722"
                height="528"
                loading="lazy"
                alt=""
                className="shape about-shape-3"
              />
            </figure>

            <div className="about-content">
              <p className="section-subtitle">About Us</p>

              <h2 className="h2 section-title">
                Over 100+ Books<span className="span">of Great learning</span>{" "}
                for Skill Development
              </h2>

              <p className="section-text">
              Be a part of our growing community of learners and readers. Sign up for a free account to start exploring our AI collection of academic resources.
              </p>

              <ul className="about-list">
                <li className="about-item">
                  <ion-icon
                    name="checkmark-done-outline"
                    aria-hidden="true"
                  ></ion-icon>

                  <span className="span">Stay Updated</span>
                </li>

                <li className="about-item">
                  <ion-icon
                    name="checkmark-done-outline"
                    aria-hidden="true"
                  ></ion-icon>

                  <span className="span">Online Remote Learning</span>
                </li>

                <li className="about-item">
                  <ion-icon
                    name="checkmark-done-outline"
                    aria-hidden="true"
                  ></ion-icon>

                  <span className="span">Lifetime Access</span>
                </li>
              </ul>

              <img
                src={images.about_shape_4}
                width="100"
                height="100"
                loading="lazy"
                alt=""
                className="shape about-shape-4"
              />
            </div>
          </div>
        </section>

        <section className="section course" id="courses" aria-label="course">
          <div className="container">
            <p className="section-subtitle">Popular Books</p>

            <h2 className="h2 section-title">Pick A Book To Get Started</h2>

            <ul className="grid-list">
              <li>
                <div className="course-card">
                  <figure
                    className="card-banner img-holder"
                    style={{ width: "370", height: "220" }}
                  >
                    <img
                      src={images.course_1}
                      width="370"
                      height="220"
                      loading="lazy"
                      alt="Build Responsive Real- World Websites with HTML and CSS"
                      className="img-cover"
                    />
                  </figure>

                  

                  <div className="card-content">
                    <span className="badge">Beginner</span>

                    <h3 className="h3">
                      <a href="#" className="card-title">
                        Build Responsive Real- World Websites with HTML and CSS
                      </a>
                    </h3>

                    <div className="wrapper">
                      <div className="rating-wrapper">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>

                      <p className="rating-text">(5.0/7 Rating)</p>
                    </div>

                    

                    <ul className="card-meta-list">
                      <li className="card-meta-item">
                        <ion-icon
                          name="library-outline"
                          aria-hidden="true"
                        ></ion-icon>

                        <span className="span">8 Lessons</span>
                      </li>

                      <li className="card-meta-item">
                        <ion-icon
                          name="people-outline"
                          aria-hidden="true"
                        ></ion-icon>

                        <span className="span">20 Students</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              <li>
                <div className="course-card">
                  <figure
                    className="card-banner img-holder"
                    style={{ width: "370", height: "220" }}
                  >
                    <img
                      src={images.course_2}
                      width="370"
                      height="220"
                      loading="lazy"
                      alt="Java Programming Masterclass for Software Developers"
                      className="img-cover"
                    />
                  </figure>

                  

                  <div className="card-content">
                    <span className="badge">Advanced</span>

                    <h3 className="h3">
                      <a href="#" className="card-title">
                        Java Programming Masterclass for Software Developers
                      </a>
                    </h3>

                    <div className="wrapper">
                      <div className="rating-wrapper">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>

                      <p className="rating-text">(4.5 /9 Rating)</p>
                    </div>

                    

                    <ul className="card-meta-list">
                      <li className="card-meta-item">
                        <ion-icon
                          name="library-outline"
                          aria-hidden="true"
                        ></ion-icon>

                        <span className="span">15 Lessons</span>
                      </li>

                      <li className="card-meta-item">
                        <ion-icon
                          name="people-outline"
                          aria-hidden="true"
                        ></ion-icon>

                        <span className="span">35 Students</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              <li>
                <div className="course-card">
                  <figure
                    className="card-banner img-holder"
                    style={{ width: "370", height: "220" }}
                  >
                    <img
                      src={images.course_3}
                      width="370"
                      height="220"
                      loading="lazy"
                      alt="The Complete Camtasia Course for Content Creators"
                      className="img-cover"
                    />
                  </figure>

                  

                  <div className="card-content">
                    <span className="badge">Intermediate</span>

                    <h3 className="h3">
                      <a href="#" className="card-title">
                        The Complete Camtasia Course for Content Creators
                      </a>
                    </h3>

                    <div className="wrapper">
                      <div className="rating-wrapper">
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </div>

                      <p className="rating-text">(4.9 /7 Rating)</p>
                    </div>

                    

                    <ul className="card-meta-list">
                      <li className="card-meta-item">
                        <ion-icon
                          name="library-outline"
                          aria-hidden="true"
                        ></ion-icon>

                        <span className="span">13 Lessons</span>
                      </li>

                      <li className="card-meta-item">
                        <ion-icon
                          name="people-outline"
                          aria-hidden="true"
                        ></ion-icon>

                        <span className="span">18 Students</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>

            <a href="#" className="btn has-before">
              <span className="span">Browse more books</span>

              <ion-icon
                name="arrow-forward-outline"
                aria-hidden="true"
              ></ion-icon>
            </a>
          </div>
        </section>

        <section
          className="video has-bg-image"
          aria-label="video"
          style={{ backgroundImage: `url(${images.video_bg})` }}
        >
          <div className="container">
            <div className="video-card">
              <div className="video-banner img-holder has-after">
                <img
                  src={images.video_banner}
                  width="970"
                  height="550"
                  loading="lazy"
                  alt="video banner"
                  className="img-cover"
                />

                <button className="play-btn" aria-label="play video">
                  <ion-icon name="play" aria-hidden="true"></ion-icon>
                </button>
              </div>

              <img
                src={images.video_shape_1}
                width="1089"
                height="605"
                loading="lazy"
                alt=""
                className="shape video-shape-1"
              />

              <img
                src={images.video_shape_2}
                width="158"
                height="174"
                loading="lazy"
                alt=""
                className="shape video-shape-2"
              />
            </div>
          </div>
        </section>

        <section className="section stats" aria-label="stats">
          <div className="container">
            <ul className="grid-list">
              <li>
                <div className="stats-card" style={{ color: "170, 75%, 41%" }}>
                  <h3 className="card-title">1500+</h3>

                  <p className="card-text">Overall Book Collections</p>
                </div>
              </li>

              <li>
                <div className="stats-card" style={{ color: "351, 83%, 61%" }}>
                  <h3 className="card-title">1000+</h3>

                  <p className="card-text">Previous Year Question Papers</p>
                </div>
              </li>

              <li>
                <div className="stats-card" style={{ color: "260, 100%, 67%" }}>
                  <h3 className="card-title">100%</h3>

                  <p className="card-text">User Satisfaction Rate</p>
                </div>
              </li>

              <li>
                <div className="stats-card" style={{ color: "42, 94%, 55%" }}>
                  <h3 className="card-title">354+</h3>

                  <p className="card-text">Academic Resources Uploaded</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section
          className="section blog has-bg-image"
          id="blog"
          aria-label="blog"
          style={{ backgroundImage: `url(${images.blog_bg})` }}
        >
          <div className="container">
            <p className="section-subtitle">Latest</p>

            <h2 className="h2 section-title">Features in ScholarHub</h2>

            <ul className="grid-list">
              <li>
                <div className="blog-card">
                  <figure
                    className="card-banner img-holder has-after"
                    style={{ width: "370", height: "370" }}
                  >
                    <img
                      src={images.blog_1}
                      width="370"
                      height="370"
                      loading="lazy"
                      alt="Become A Better Blogger: Content Planning"
                      className="img-cover"
                    />
                  </figure>

                  <div className="card-content">
                    <a href="#" className="card-btn" aria-label="read more">
                      <ion-icon
                        name="arrow-forward-outline"
                        aria-hidden="true"
                      ></ion-icon>
                    </a>

                    

                    <h3 className="h3">
                      <a href="#" className="card-title">
                      Upload and Download Books with Ease
                      </a>
                    </h3>

                    

                    <p className="card-text">
                    Our platform allows you to upload and share educational resources, research papers, and books. 
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <div className="blog-card">
                  <figure
                    className="card-banner img-holder has-after"
                    style={{ width: "370", height: "370" }}
                  >
                    <img
                      src={images.blog_2}
                      width="370"
                      height="370"
                      loading="lazy"
                      alt="Become A Better Blogger: Content Planning"
                      className="img-cover"
                    />
                  </figure>

                  <div className="card-content">
                    <a href="#" className="card-btn" aria-label="read more">
                      <ion-icon
                        name="arrow-forward-outline"
                        aria-hidden="true"
                      ></ion-icon>
                    </a>

                   

                    <h3 className="h3">
                      <a href="#" className="card-title">
                      AI-Driven Question Paper Prediction
                      </a>
                    </h3>

                    
                    <p className="card-text">
                    One of the most innovative features of our library is our AI-powered question paper prediction tool.
                    </p>
                  </div>
                </div>
              </li>

              <li>
                <div className="blog-card">
                  <figure
                    className="card-banner img-holder has-after"
                    style={{ width: "370", height: "370" }}
                  >
                    <img
                      src={images.blog_3}
                      width="370"
                      height="370"
                      loading="lazy"
                      alt="Become A Better Blogger: Content Planning"
                      className="img-cover"
                    />
                  </figure>

                  <div className="card-content">
                    <a href="#" className="card-btn" aria-label="read more">
                      <ion-icon
                        name="arrow-forward-outline"
                        aria-hidden="true"
                      ></ion-icon>
                    </a>

                   

                    <h3 className="h3">
                      <a href="#" className="card-title">
                      Reserve and Borrow Books Online
                      </a>
                    </h3>

                    

                    <p className="card-text">
                    Our platform enables users to reserve books online, ensuring you can borrow them as soon as they become available.
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <img
              src={images.blog_shape}
              width="186"
              height="186"
              loading="lazy"
              alt=""
              className="shape blog-shape"
            />
          </div>
        </section>
      </article>
    </main>
  );
}

export default Home;
