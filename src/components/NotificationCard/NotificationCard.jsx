import React from "react";

function NotificationCard(props) {
  //function to convert the datetime to time ago
  const timeAgo = (date) => {
    // Convert the provided date to a Date object
    const notificationDate = new Date(date);

    // Get the current UTC time
    const currentUTC = new Date();

    // Convert the current UTC time to IST (UTC + 5:30)
    const currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);

    // Get the difference in seconds between current IST time and the notification date
    const diffInSeconds = Math.floor((currentIST - notificationDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days`;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {props.title}
      </h2>
      <p className="text-gray-600 mb-4">{props.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{timeAgo(props.date)} ago</span>
      </div>
    </div>
  );
}

export default NotificationCard;
