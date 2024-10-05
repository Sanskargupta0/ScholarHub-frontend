import React, { useEffect, useState } from "react";
import { components } from "../../../components";
import { useAuth } from "../../../store/auth";

function Notification() {
  const {
    newNotification,
    setNewNotification,
    userdata,
    globalNotification,
    setGlobalNotification,
  } = useAuth();

  const [notification, setNotification] = useState([]);

  const sortNotification = (userNotification, globalNotification) => {
    const notification = [...userNotification, ...globalNotification];
    notification.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    return notification;
  };

  useEffect(() => {
    if (newNotification.title) {
      if (newNotification.date != globalNotification[0].date) {
        setNotification([newNotification, ...notification]);
        setGlobalNotification([newNotification, ...globalNotification]);
        setNewNotification({});
      }
    } else {
      if (userdata.notifications.length === 0) {
        setTimeout(() => {
            setNotification(
              sortNotification(userdata.notifications, globalNotification)
            );
        }, 1000);
      } else {
        setNotification(
          sortNotification(userdata.notifications, globalNotification)
        );
      }
    }
  }, [newNotification]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold text-800 mb-6"
        style={{ color: "#1DB398" }}
      >
        Notifications
      </h1>
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

export default Notification;
