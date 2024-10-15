import React, { useState, useEffect } from "react";
import { Edit, Trash2, ToggleLeft, ToggleRight, RotateCcw } from "lucide-react";
import { components } from "../../../../components";
import { images } from "../../../../assets";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../../../config";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [hideLastThreeColumns, setHideLastThreeColumns] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editUserData, setEditUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUserData, setDeleteUserData] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    lastName: "",
    email: "",
    rollNumber: "",
    role: "",
    phone: "",
    returnBook: "",
  });
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

  useEffect(() => {
    fetchUsersData();
    if (
      filters.name !== "" ||
      filters.email !== "" ||
      filters.rollNumber !== "" ||
      filters.role !== "" ||
      filters.phone !== "" ||
      filters.returnBook !== "" ||
      filters.lastName !== ""
    ) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [currentPage, rowsPerPage, filters]);

  function checkInput() {
    if (
      editUserData.firstName === user.firstName &&
      editUserData.lastName === user.lastName &&
      editUserData.phone === user.phone &&
      editUserData.avatarURL === user.avatarURL &&
      editUserData.facebook === user.facebook &&
      editUserData.instagram === user.instagram &&
      editUserData.twitter === user.twitter &&
      editUserData.github === user.github &&
      editUserData.rollNumber === user.rollNumber
    ) {
      toast.warn("No changes made, Nothing to Update ", {
        position: "top-center",
      });
    } else if (editUserData.firstName.length < 4) {
      toast.warn("First name should be at least 4 characters long", {
        position: "top-center",
      });
    } else if (editUserData.lastName.length < 4) {
      toast.warn("Last name should be at least 4 characters long", {
        position: "top-center",
      });
    } else if (
      editUserData.phone.length != 0 &&
      editUserData.phone.length != 10
    ) {
      toast.warn("Phone number must be 10 digits long", {
        position: "top-center",
      });
    } else if (
      editUserData.instagram.length != 0 &&
      editUserData.instagram.length < 5
    ) {
      toast.warn("Instagram ID should be at least 5 characters long", {
        position: "top-center",
      });
    } else if (
      editUserData.facebook.length != 0 &&
      /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/)(?:profile\.php\?id=\d+|[a-zA-Z0-9.]+)/.test(
        editUserData.facebook
      ) === false
    ) {
      toast.warn("Enter a Valid Facebook Profile Link", {
        position: "top-center",
      });
    } else if (
      editUserData.twitter.length != 0 &&
      editUserData.twitter.length < 4
    ) {
      toast.warn("Enter a Valid Twitter Id", {
        position: "top-center",
      });
    } else if (
      editUserData.github.length != 0 &&
      editUserData.github.length < 4
    ) {
      toast.warn("Enter a Valid Github Id", {
        position: "top-center",
      });
    } else if (
      editUserData.rollNumber.length != 0 &&
      editUserData.rollNumber.length < 5
    ) {
      toast.warn("Enter a Valid Roll Number", {
        position: "top-center",
      });
    } else {
      return true;
    }
  }

  const fetchUsersData = async () => {
    try {
      const { data } = await axios.post(
        `${config.backendUrl}/admin/getAllUsers?page=${currentPage}&perPage=${rowsPerPage}`,
        { filterdata: filters },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUsersData(data.users);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleLastThreeColumns = () => {
    setHideLastThreeColumns(!hideLastThreeColumns);
  };

  const handleReset = () => {
    setFilters({
      name: "",
      lastName: "",
      email: "",
      rollNumber: "",
      role: "",
      phone: "",
      returnBook: "",
    });
    setShowReset(false);
    fetchUsersData();
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleEditClick = (user) => {
    setEditUserData(user);
    setUser(user);
    setIsModalOpen(true);
  };

  const handleBack = () => {
    setIsModalOpen(false);
    setEditUserData(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (checkInput()) {
      try {
        const userCopy = { ...editUserData };
        delete userCopy.email;
        for (let key in userCopy) {
          if (userCopy[key] === user[key]) {
            delete userCopy[key];
          }
        }
        const Token = localStorage.getItem("Token");
        const responce = await fetch(`${config.backendUrl}/admin/updateUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify({ updateData: userCopy, id: editUserData._id }),
        });
        const data = await responce.json();
        if (responce.status === 200) {
          toast.success(data.msg, {
            position: "top-center",
          });
          fetchUsersData();
          setIsModalOpen(false);
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

  const handleStatusChange = (id) => async (e) => {
    try {
      const res = await axios.put(
        `${config.backendUrl}/admin/updateUser`,
        { id, updateData: { status: e.target.checked } },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.msg, {
          position: "top-center",
        });
        setUsersData(
          usersData.map((user) =>
            user._id === id ? { ...user, status: !e.target.checked } : user
          )
        );
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
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
      setEditUserData({
        ...editUserData,
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

  const handleDeleteUser = async (id) => {
    try {
      const res = await axios.post(
        `${config.backendUrl}/admin/deleteUser`,
        {
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        console.log(res);
        toast.success(res.data.msg, {
          position: "top-center",
        });
        setUsersData(usersData.filter((user) => user._id !== id));
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUser = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setEditUserData({
      ...editUserData,
      [name]: value,
    });
  };

  const handleResetform = (e) => {
    e.preventDefault();
    setEditUserData({
      ...editUserData,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarURL: user.avatarURL,
      facebook: user.facebook,
      instagram: user.instagram,
      twitter: user.twitter,
      github: user.github,
      rollNumber: user.rollNumber,
    });
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  return (
    <div className="container mx-auto p-4 adminpanel">
      <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={toggleLastThreeColumns}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {hideLastThreeColumns ? "Show" : "Hide"} Columns
        </button>

        <div className="flex items-center space-x-2">
          <label htmlFor="rowsPerPage" className="text-gray-700 font-semibold">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 rounded px-2 py-1"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {!isModalOpen ? (
        <>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-800 text-white text-sm uppercase leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  {!hideLastThreeColumns && (
                    <>
                      <th className="py-3 px-6 text-left">last Name</th>
                    </>
                  )}
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Roll Number</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  {!hideLastThreeColumns && (
                    <>
                      <th className="py-3 px-6 text-left">Phone No.</th>
                      <th className="py-3 px-6 text-left">Book Return</th>
                    </>
                  )}
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                  <td className="py-3 px-6">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Filter Name"
                      type="text"
                      title="Name should only contain letters"
                      value={filters.name}
                      onChange={(e) =>
                        setFilters({ ...filters, name: e.target.value })
                      }
                    />
                  </td>
                  {!hideLastThreeColumns && (
                    <td className="py-3 px-6">
                      <input
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Filter Last Name"
                        type="text"
                        title="Last Name should only contain letters"
                        value={filters.lastName}
                        onChange={(e) =>
                          setFilters({ ...filters, lastName: e.target.value })
                        }
                      />
                    </td>
                  )}
                  <td className="py-3 px-6">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Filter Email"
                      type="email"
                      title="Enter a valid email address"
                      value={filters.email}
                      onChange={(e) =>
                        setFilters({ ...filters, email: e.target.value })
                      }
                    />
                  </td>
                  <td className="py-3 px-6">
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Filter Roll Number"
                      type="number"
                      title="Roll Number should only contain Numbers"
                      value={filters.rollNumber}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          rollNumber: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="py-3 px-6">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={filters.role}
                      onChange={(e) =>
                        setFilters({ ...filters, role: e.target.value })
                      }
                    >
                      <option value="">All</option>
                      <option value="true">Admin</option>
                      <option value="false">User</option>
                    </select>
                  </td>
                  {!hideLastThreeColumns && (
                    <>
                      <td className="py-3 px-6">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          placeholder="Filter Phone No."
                          type="number"
                          title="Phone Number should only contain Numbers"
                          value={filters.phone}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              phone: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="py-3 px-6">
                        <select
                          className="border rounded px-2 py-1 w-full"
                          value={filters.returnBook}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              returnBook: e.target.value,
                            })
                          }
                        >
                          <option value="">All</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </td>
                    </>
                  )}
                  <td className="py-3 px-6">
                    <div className="flex items-center space-x-2">
                      {showReset && (
                        /* From Uiverse.io by andrew-demchenk0 */
                        <button className="buttonrpt" onClick={handleReset}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            viewBox="0 0 20 20"
                            height="20"
                            fill="none"
                            className="svg-icon"
                          >
                            <g
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              stroke="#ff342b"
                            >
                              <path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path>
                              <path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path>
                            </g>
                          </svg>
                          <span className="lable">Reset</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {usersData.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-200" : "bg-white"
                    } border-b border-gray-200 hover:bg-gray-100`}
                  >
                    <td className="py-3 px-6">{user.firstName}</td>
                    {!hideLastThreeColumns && (
                      <td className="py-3 px-6">{user.lastName}</td>
                    )}
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.rollNumber}</td>
                    <td className="py-3 px-6">
                      {user.isAdmin ? "Admin" : "User"}
                    </td>
                    {!hideLastThreeColumns && (
                      <>
                        <td className="py-3 px-6">{user.phone}</td>
                        <td className="py-3 px-6">
                          {user.bookReturn ? user.bookReturn : 0}
                        </td>
                      </>
                    )}
                    <td className="py-3 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(user)}
                        >
                          <svg className="edit-svgIcon" viewBox="0 0 512 512">
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                          </svg>
                        </button>

                        <button
                          className="dltbutton"
                          onClick={() => {
                            setDeleteUserData(user);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <svg viewBox="0 0 448 512" className="svgIcon">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                          </svg>
                        </button>

                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={user.status}
                            onChange={handleStatusChange(user._id)}
                          />
                          <div className="slider">
                            <div className="circle">
                              <svg
                                className="cross"
                                xmlSpace="preserve"
                                style={{ enableBackground: "new 0 0 512 512" }}
                                viewBox="0 0 365.696 365.696"
                                y="0"
                                x="0"
                                height="6"
                                width="6"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path
                                    data-original="#000000"
                                    fill="currentColor"
                                    d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
                                  ></path>
                                </g>
                              </svg>
                              <svg
                                className="checkmark"
                                xmlSpace="preserve"
                                style={{ enableBackground: "new 0 0 512 512" }}
                                viewBox="0 0 24 24"
                                y="0"
                                x="0"
                                height="10"
                                width="10"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path
                                    className=""
                                    data-original="#000000"
                                    fill="currentColor"
                                    d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                                  ></path>
                                </g>
                              </svg>
                            </div>
                          </div>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 mb-4 flex justify-between items-center">
            <div>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <div>
              <span className="text-gray-600">
                Showing {indexOfFirstRow + 1} to{" "}
                {Math.min(indexOfLastRow, totalUsers)} of {totalUsers} entries
              </span>
            </div>
            <components.Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      ) : (
        ""
      )}

      {isModalOpen && (
        <div className="flex items-center justify-center">
          <div className="editform">
            {" "}
            <form className="form">
              <div className="imageUpload">
                <div>
                  <h2>User Profile</h2>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={editUserData.avatarURL}
                    onChange={(e) =>
                      setEditUserData({
                        ...editUserData,
                        avatarURL: e.target.value,
                      })
                    }
                  >
                    <option value={user.avatarURL}>Default</option>
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
                    editUserData.avatarURL == null
                      ? ""
                      : editUserData.avatarURL.length < 10
                      ? images[editUserData.avatarURL]
                      : editUserData.avatarURL
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
                    value={editUserData.firstName}
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
                    value={editUserData.lastName}
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
                    value={editUserData.rollNumber}
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
                    value={editUserData.phone}
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
                    value={editUserData.instagram}
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
                    value={editUserData.facebook}
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
                    value={editUserData.twitter}
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
                    value={editUserData.github}
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
                    onClick={handleResetform}
                  >
                    <i className="fa fa-refresh"></i> Reset{" "}
                  </button>
                </a>
                <a href="">
                  <button
                    className="movebtn movebtnsu"
                    type="button"
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
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Delete User</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this user?
            </p>
            <p className="mb-4">
              <strong>Name:</strong>{" "}
              {deleteUserData.firstName + " " + deleteUserData.lastName}
              <br />
              <strong>Email:</strong> {deleteUserData.email}
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteUser(deleteUserData._id);
                  setIsDeleteOpen(false);
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
