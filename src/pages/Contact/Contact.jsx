import React, { useState } from "react";
import { images } from "../../assets";
import { components } from "../../components";
import constactStyles from "./Contact.module.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import config from "../../config";
import { useAuth } from "../../store/auth";

const Contact = () => {
  const { userdata } = useAuth();
  const [contactData, setContactData] = useState(true);

  function reset() {
    document.getElementById("name").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("message").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("subEmail").value = "";
  }

  function check() {
    var name = document.getElementById("name").value;
    var mail = document.getElementById("mail").value;
    var message = document.getElementById("message").value;
    var phone = document.getElementById("phone").value;

    if (name === "" || mail === "" || message === "") {
      toast.warn("Please fill all the fields", {
        position: "top-center",
      });
    } else if (phone.length > 0 && phone.length != 10) {
      toast.warn("Please enter a valid phone number", {
        position: "top-center",
      });
    } else if (!mail.includes("@") || !mail.includes(".")) {
      toast.warn("Please enter a valid email", {
        position: "top-center",
      });
    } else if (message.length < 10) {
      toast.warn("Please enter a valid message", {
        position: "top-center",
      });
    } else if (name.length < 3) {
      toast.warn("Please enter a valid name", {
        position: "top-center",
      });
    } else {
      try {
        return true;
      } catch (error) {
        confirm.log(error);
        toast.warn("Something went wrong", {
          position: "top-center",
        });
      }
    }
  }

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleConatct = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setContact({
      ...contact,
      [name]: value,
    });
  };

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

  const handelConatct = async (e) => {
    try {
      e.preventDefault();
      const pass = check();
      if (pass) {
        const contactResponse = await fetch(`${config.backendUrl}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contact),
        });
        const contactData = await contactResponse.json();
        if (!(contactResponse.status === 422)) {
          reset();
          toast.success(`${contactData.message}`, {
            position: "top-center",
          });
        } else {
          if (contactData.extrD) {
            toast.error(`${contactData.msg + contactData.extrD}`, {
              position: "top-center",
            });
          } else {
            toast.error(`${contactData.msg}`, {
              position: "top-center",
            });
          }
        }
      }
    } catch (error) {
      console.log({ err: error });
    }
  };

  if (contactData && userdata) {
    setContactData(false);
    if (userdata.firstName !== null && userdata.email !== null) {
      setEmail(userdata.email);
      setContact({
        ...contact,
        name: userdata.firstName,
        email: userdata.email,
        phone: userdata.phone,
      });
    }
  }
  return (
    <div className="container">
      <div className={constactStyles.formscontainer}>
        <div className={constactStyles.forms}>
          <span className={constactStyles.heading}>Get in touch</span>
          <input
            name="name"
            placeholder="Name"
            id="name"
            type="text"
            className={constactStyles.input}
            value={contact.name}
            onChange={handleConatct}
          />
          <input
            name="email"
            placeholder="Email"
            id="mail"
            type="email"
            className={constactStyles.input}
            value={contact.email}
            onChange={handleConatct}
          />
          <input
            name="phone"
            placeholder="Phone  ( Optional )"
            id="phone"
            type="number"
            className={constactStyles.input}
            value={contact.phone}
            onChange={handleConatct}
          />
          <textarea
            placeholder="Say Hello"
            rows="10"
            cols="30"
            id="message"
            name="message"
            className={constactStyles.textarea}
            value={contact.message}
            onChange={handleConatct}
          ></textarea>
          <div className={constactStyles.buttoncontainer}>
            <div className={constactStyles.sendbutton} onClick={handelConatct}>
              Send
            </div>
            <div className={constactStyles.resetbuttoncontainer}>
              <div
                id="reset-btn"
                className={constactStyles.resetbutton}
                onClick={reset}
              >
                Reset
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={constactStyles.Contributor} style={{fontSize:"15px"}}>
        <components.Contributor
          name="Akash Gupta"
          dev="Co-Founder"
          images={images.Akash}
          git="https://github.com/saysky2"
          mail="mailto:10582akash@gmail.com"
          linkedin="https://www.linkedin.com/in/saysky2/"
        />
        <components.Contributor
          name="Sanskar Gupta"
          dev=" Founder"
          images={images.Sanskar}
          git="https://github.com/Sanskargupta0"
          mail="mailto:Sanskar362002@gmail.com"
          linkedin="https://www.linkedin.com/in/sanskar-gupta-12476423b/"
        />
        <components.Contributor
          name="Aman Raj"
          dev="Co-Founder"
          images={images.Aman}
          git="https://github.com/igamanraj"
          mail="mailto:amanra812727@gmail.com"
          linkedin="https://www.linkedin.com/in/aman-raj-63733623b/?trk=contact-info"
        />
      </div>

      <div
        className="flex flex-col items-center justify-center h-screen dark"
        style={{ height: "20rem", margin: "3rem" }}
      >
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            Subscribe to Our Newsletter
          </h2>

          <form className="flex flex-col">
            <input
              placeholder="Enter your email address"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="email"
              name="email"
              id="subEmail"
              value={email}
              onChange={handelEmail}
            />

            <button
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150"
              type="submit"
              onClick={handelEmailSubmit}
            >
              Subscribe
            </button>
          </form>

          <div className="flex justify-center mt-4">
            <Link className="text-sm text-gray-400 hover:underline" to="/legal">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
