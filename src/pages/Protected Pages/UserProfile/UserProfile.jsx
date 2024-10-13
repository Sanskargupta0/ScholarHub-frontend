import React, { useEffect, useState } from "react";
import { images } from "../../../assets";
import { useAuth } from "../../../store/auth";
import { toast } from "react-toastify";
import config from "../../../config";
import "./UserProfile.css";
const UserProfile = () => {
  const { userdata, setRerunData } = useAuth();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatarURL: "",
    facebook: "",
    instagram: "",
    twitter: "",
    github: "",
    rollNumber: "",
  });
  function checkInput() {
    if (
      userdata.firstName === user.firstName &&
      userdata.lastName === user.lastName &&
      userdata.phone === user.phone &&
      userdata.avatarURL === user.avatarURL &&
      userdata.facebook === user.facebook &&
      userdata.instagram === user.instagram &&
      userdata.twitter === user.twitter &&
      userdata.github === user.github &&
      userdata.rollNumber === user.rollNumber
    ) {
      toast.warn("No changes made, Nothing to Update ", {
        position: "top-center",
      });
    } else if (user.firstName.length < 4) {
      toast.warn("First name should be at least 4 characters long", {
        position: "top-center",
      });
    } else if (user.lastName.length < 4) {
      toast.warn("Last name should be at least 4 characters long", {
        position: "top-center",
      });
    } else if (user.phone.length != 0 && user.phone.length != 10) {
      toast.warn("Phone number must be 10 digits long", {
        position: "top-center",
      });
    } else if (user.instagram.length != 0 && user.instagram.length < 5) {
      toast.warn("Instagram ID should be at least 5 characters long", {
        position: "top-center",
      });
    } else if (
      user.facebook.length != 0 &&
      /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/)(?:profile\.php\?id=\d+|[a-zA-Z0-9.]+)/.test(
        user.facebook
      ) === false
    ) {
      toast.warn("Enter a Valid Facebook Profile Link", {
        position: "top-center",
      });
    } else if (user.twitter.length != 0 && user.twitter.length < 4) {
      toast.warn("Enter a Valid Twitter Id", {
        position: "top-center",
      });
    } else if (user.github.length != 0 && user.github.length < 4) {
      toast.warn("Enter a Valid Github Id", {
        position: "top-center",
      });
    } else if (user.rollNumber.length != 0 && user.rollNumber.length < 5) {
      toast.warn("Enter a Valid Roll Number", {
        position: "top-center",
      });
    } else {
      return true;
    }
  }
  const [edit, setEdit] = useState(false);
  const handleEdit = () => {
    setEdit(!edit);
  };
  const convertBase64 = (e) => {
    const file = e.target.files[0];

    // Check if file size is within the limit (500KB = 500 * 1024 bytes)
    if (file.size > 500 * 1024) {
      toast.error("Image size exceeds 500KB limit", {
        position: "top-center",
      });
      return; // Stop further processing
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUser({
        ...user,
        avatarURL: reader.result,
      });
      toast.success("Image converted to Base64", {
        position: "top-center",
      });
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
      toast.error("Failed to convert the image into Base64", {
        position: "top-center",
      });
    };
  };
  const handleBack = () => {
    setUser({
      ...user,
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      phone: userdata.phone,
      avatarURL: userdata.avatarURL,
      facebook: userdata.facebook,
      instagram: userdata.instagram,
      twitter: userdata.twitter,
      github: userdata.github,
      rollNumber: userdata.rollNumber,
    });
    setEdit(!edit);
  };
  const handleUser = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const handleReset = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      phone: userdata.phone,
      avatarURL: userdata.avatarURL,
      facebook: userdata.facebook,
      instagram: userdata.instagram,
      twitter: userdata.twitter,
      github: userdata.github,
      rollNumber: userdata.rollNumber,
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (checkInput()) {
      try {
        const userCopy = { ...user };
        delete userCopy.email;
        for (let key in userCopy) {
          if (userCopy[key] === userdata[key]) {
            delete userCopy[key];
          }
        }
        const Token = localStorage.getItem("Token");
        const responce = await fetch(`${config.backendUrl}/updateUserData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify({ updateData: userCopy }),
        });
        const data = await responce.json();
        if (responce.status === 200) {
          setRerunData();
          toast.success(data.msg, {
            position: "top-center",
          });
          setEdit(!edit);
        } else {
          toast.error(data.msg, {
            position: "top-center",
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if (userdata) {
      setUser({
        firstName: userdata.firstName,
        lastName: userdata.lastName,
        email: userdata.email,
        phone: userdata.phone,
        avatarURL: userdata.avatarURL,
        facebook: userdata.facebook,
        instagram: userdata.instagram,
        twitter: userdata.twitter,
        github: userdata.github,
        rollNumber: userdata.rollNumber,
      });
    }
  }, [userdata]);

  return (
    <>
      {edit ? (
        <div className="editform">
          {" "}
          <form className="form">
            <div className="imageUpload">
              <div>
                <h2>User Profile</h2>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={user.avatarURL}
                  onChange={(e) =>
                    setUser({ ...user, avatarURL: e.target.value })
                  }
                >
                  <option value={userdata.avatarURL}>Default</option>
                  <option value="Avatar1">Avatar1</option>
                  <option value="Avatar2">Avatar2</option>
                  <option value="Avatar3">Avatar3</option>
                  <option value="Avatar4">Avatar4</option>
                  <option value="Avatar5">Avatar5</option>
                  <option value="Avatar6">Avatar6</option>
                </select>
              </div>
              <img
                style={{
                  position: "relative",
                  left: "26px",
                  width: "11rem",
                  height: "11rem",
                }}
                src={
                  user.avatarURL == null
                    ? ""
                    : user.avatarURL.length < 10
                    ? images[user.avatarURL]
                    : user.avatarURL
                }
                className="img-radius"
                alt="User-Profile-Image"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fname">First Name:</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="fname"
                  name="firstName"
                  type="text"
                  pattern="[a-zA-Z\s]+"
                  required=""
                  autoFocus=""
                  title="First Name should only contain letters. e.g. Sanskar"
                  placeholder="Type your First name here..."
                  value={user.firstName}
                  onChange={handleUser}
                />
                <i className="fa fa-user"></i>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lname">Last Name:</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="lname"
                  name="lastName"
                  type="text"
                  pattern="[a-zA-Z\s]+"
                  required=""
                  autoFocus=""
                  title="Last Name should only contain letters. e.g. Gupta"
                  placeholder="Type your Last name here..."
                  value={user.lastName}
                  onChange={handleUser}
                />
                <i className="fa fa-user"></i>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number:</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="rollNumber"
                  name="rollNumber"
                  type="number"
                  min="0"
                  step="1"
                  pattern="[0-9]+"
                  required=""
                  autoFocus=""
                  title="Roll Number should only contain Numbers. e.g. 19103001"
                  placeholder="Type your Roll Number here..."
                  value={user.rollNumber}
                  onChange={handleUser}
                />
                <i className="fa fa-id-card-o" aria-hidden="true"></i>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Contact Number:</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="phone"
                  name="phone"
                  type="Number"
                  maxLength="10"
                  required=""
                  autoComplete="phone"
                  placeholder="Type your Mobile Number..."
                  title="Mobile Number should only contain Numbers."
                  value={user.phone}
                  onChange={handleUser}
                />
                <i className="fa fa-phone"></i>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="Instagram">Instagram</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="Instagram"
                  name="instagram"
                  type="text"
                  placeholder="Mention your Instagram ID"
                  title="Instagram ID should only contain letters and Numbers."
                  value={user.instagram}
                  onChange={handleUser}
                />
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="FaceBook">FaceBook URL</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="FaceBook"
                  name="facebook"
                  type="url"
                  pattern="https?://.+"
                  required=""
                  placeholder="Mention your FaceBook URL..."
                  title="Please enter a valid URL"
                  value={user.facebook}
                  onChange={handleUser}
                />
                <i className="fa fa-facebook-official" aria-hidden="true"></i>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="twitter">Twitter</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="twitter"
                  name="twitter"
                  type="text"
                  placeholder="Mention your Twitter ID"
                  value={user.twitter}
                  onChange={handleUser}
                />
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="github">Github</label>
              <div className="relative">
                <input
                  className="form-control"
                  id="github"
                  name="github"
                  type="text"
                  placeholder="Mention your github ID"
                  value={user.github}
                  onChange={handleUser}
                />
                <i className="fa fa-github" aria-hidden="true"></i>
              </div>
            </div>

            <div className="tright">
              <span className="buttonbck">
                <button className="button" onClick={handleBack}>
                  <div className="button-box">
                    <span className="button-elem">
                      <svg viewBox="0 0 46 40">
                        <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                      </svg>
                    </span>
                    <span className="button-elem">
                      <svg viewBox="0 0 46 40">
                        <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
                      </svg>
                    </span>
                  </div>
                </button>
              </span>

              <a href="">
                <button
                  className="movebtn movebtnre"
                  type="button"
                  style={{ marginRight: "1rem" }}
                  onClick={handleReset}
                >
                  <i className="fa fa-refresh"></i> Reset{" "}
                </button>
              </a>
              <a href="">
                <button
                  className="movebtn movebtnsu"
                  type="Submit"
                  onClick={handleUpdate}
                >
                  Submit <i className="fa fa-fw fa-paper-plane"></i>
                </button>
              </a>
            </div>
          </form>
          <form className="file-upload-form">
            <label htmlFor="file" className="file-upload-label">
              <div className="file-upload-design">
                <svg viewBox="0 0 640 512" height="1em">
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"></path>
                </svg>
                <p>Drag and Drop</p>
                <p>or</p>
                <span className="browse-button">Browse file</span>
              </div>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={convertBase64}
              />
            </label>
          </form>
        </div>
      ) : (
        <div>
          <div
            className="page-content page-container profilemain"
            id="page-content"
          >
            <div className="padding">
              <div className="row container d-flex justify-content-center">
                <div className="col-xl-6 col-md-12">
                  <div className="card user-card-full">
                    <div
                      className="row m-l-0 m-r-0 profilemaindiv"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <div className="col-sm-4 bg-c-lite-green user-profile">
                        <div className="card-block text-center text-white">
                          <div className="m-b-25">
                            <img
                              src={
                                userdata.avatarURL == null
                                  ? ""
                                  : userdata.avatarURL.length < 10
                                  ? images[userdata.avatarURL]
                                  : userdata.avatarURL
                              }
                              className="img-radius"
                              alt="User-Profile-Image"
                            />
                          </div>
                          <h6 className="f-w-600">
                            {user.firstName} {user.lastName}
                          </h6>
                          <p style={{ fontSize: "1.5rem" }}>
                            <i
                              className="fa fa-id-card-o"
                              aria-hidden="true"
                            ></i>
                            &nbsp;
                            {user.rollNumber}
                          </p>
                          <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="card-block">
                          <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                            Information
                          </h6>
                          <div className="row">
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">First Name</p>
                              <h6 className="text-muted f-w-400">
                                {user.firstName}
                              </h6>
                            </div>
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">Last Name</p>
                              <h6 className="text-muted f-w-400">
                                {user.lastName}
                              </h6>
                            </div>
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">Email</p>
                              <h6 className="text-muted f-w-400">
                                {user.email}
                              </h6>
                            </div>
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">Phone</p>
                              <h6 className="text-muted f-w-400">
                                {user.phone}
                              </h6>
                            </div>
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">FaceBook</p>
                              <h6
                                className="text-muted f-w-400"
                                style={{ wordBreak: "break-all" }}
                              >
                                URL({user.facebook})
                              </h6>
                            </div>
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">Instagram</p>
                              <h6 className="text-muted f-w-400">
                                @{user.instagram}
                              </h6>
                            </div>
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">Twitter</p>
                              <h6 className="text-muted f-w-400">
                                @{user.twitter}
                              </h6>
                            </div>
                            <div className="col-sm-6">
                              <p className="m-b-10 f-w-600">Github</p>
                              <h6 className="text-muted f-w-400">
                                @{user.github}
                              </h6>
                            </div>
                          </div>
                          <ul className="social-link list-unstyled m-t-40 m-b-10">
                            <button
                              className="edit-button"
                              onClick={handleEdit}
                            >
                              <svg
                                className="edit-svgIcon"
                                viewBox="0 0 512 512"
                              >
                                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                              </svg>
                            </button>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
