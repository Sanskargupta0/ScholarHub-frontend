import React, { useState, useEffect } from "react";
import { components } from "../../../../components";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/auth";
import axios from "axios";
import config from "../../../../config";

function GlobalNotification() {
  const { globalNotification } = useAuth();
  const [notification, setNotification] = useState(() => [...globalNotification].reverse());
  const [newNotification, setNewNotification] = useState({
    title: "",
    description: "",
  });

  const newNotificationData = (e) => {
    setNewNotification({
      ...newNotification,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendNotification = async () => {
    try {
      const res = await axios.post(
        `${config.backendUrl}/createGobalNotification`,
        {
          title: newNotification.title,
          description: newNotification.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success(res.data.msg, {
          position: "top-center",
        });
        setNewNotification({
          title: "",
          description: "",
        });
        setNotification([res.data.notification, ...notification]);
      } else {
        toast.error(res.data.msg, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="adminpanel container mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold text-800 mb-6"
        style={{ color: "#1DB398" }}
      >
        Global Notifications
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Add New Global Notification
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            placeholder="Enter title"
            onChange={newNotificationData}
            name="title"
            value={newNotification.title}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={newNotification.description}
            onChange={newNotificationData}
            placeholder="Enter description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex space-x-4 justify-between">
          <button
            className="buttonrpt mt-3"
            onClick={() => {
              setNewNotification({ title: "", description: "" });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="0 0 20 20"
              height="20"
              fill="none"
              className="svg-icon"
            >
              <g strokeWidth="1.5" strokeLinecap="round" stroke="#ff342b">
                <path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path>
                <path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path>
              </g>
            </svg>
            <span className="lable">Reset</span>
          </button>

          <button
            className="sendbtn"
            onClick={() => handleSendNotification()}
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span>Send</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notification.map((item, index) => (
          <components.NotificationCard
            key={index}
            title={item.title}
            description={item.description}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
}

export default GlobalNotification;
