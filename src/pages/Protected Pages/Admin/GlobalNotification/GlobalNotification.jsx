import React, { useState, useEffect } from "react";
import { components } from "../../../../components";
import { toast } from "react-toastify";
import { useAuth } from "../../../../store/auth";
import axios from "axios";
import config from "../../../../config";

function GlobalNotification() {
  const { globalNotification } = useAuth();
  const [notification, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    description: "",
  });

  // Initialize notifications with safety checks
  useEffect(() => {
    setIsLoading(true);
    try {
      if (Array.isArray(globalNotification)) {
        // Sort by date, newest first
        const sorted = [...globalNotification].sort((a, b) => {
          if (!a || !b || !a.date || !b.date) return 0;
          return new Date(b.date) - new Date(a.date);
        });
        setNotification(sorted);
      } else {
        setNotification([]);
      }
    } catch (error) {
      console.error("Error initializing notifications:", error);
      toast.error("Failed to load notifications", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }, [globalNotification]);

  const newNotificationData = (e) => {
    setNewNotification({
      ...newNotification,
      [e.target.name]: e.target.value,
    });
  };

  const validateNotification = () => {
    if (!newNotification.title.trim()) {
      toast.error("Title is required", {
        position: "top-center",
      });
      return false;
    }
    if (!newNotification.description.trim()) {
      toast.error("Description is required", {
        position: "top-center",
      });
      return false;
    }
    return true;
  };

  const handleSendNotification = async () => {
    if (!validateNotification()) return;

    setIsSending(true);
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
        // Add new notification to the top of the list
        if (res.data.notification) {
          setNotification([res.data.notification, ...notification]);
        }
      } else {
        toast.error(res.data.msg || "Failed to send notification", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(error.response?.data?.msg || "An error occurred", {
        position: "top-center",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="adminpanel container mx-auto px-4 py-8 dark:bg-gray-900">
      <h1
        className="text-4xl font-bold text-800 mb-6 dark:text-gray-100"
        style={{ color: "#1DB398" }}
      >
        Global Notifications
      </h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          Add New Global Notification
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter title"
            onChange={newNotificationData}
            name="title"
            value={newNotification.title}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={isSending}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newNotification.description}
            onChange={newNotificationData}
            placeholder="Enter description"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={4}
            disabled={isSending}
          />
        </div>

        <div className="flex space-x-4 justify-between">
          <button
            className="buttonrpt mt-3"
            onClick={() => {
              setNewNotification({ title: "", description: "" });
            }}
            disabled={isSending}
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
            className={`sendbtn ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`} 
            onClick={handleSendNotification}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <span>Sending...</span>
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      )}

      {!isLoading && notification.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-xl dark:text-gray-300">No notifications sent yet</p>
        </div>
      )}

      <div className="space-y-4">
        {notification.map((item, index) => (
          <components.NotificationCard
            key={`${item.title}-${item.date}-${index}`}
            title={item.title}
            description={item.description}
            date={item.date}
            isGlobal={true}
          />
        ))}
      </div>
    </div>
  );
}

export default GlobalNotification;
