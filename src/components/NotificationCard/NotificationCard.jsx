import React from "react";

function NotificationCard(props) {
    
    //function to convert the datetime to time ago
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {props.title}
      </h2>
      <p className="text-gray-600 mb-4">
        {props.description}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{timeAgo(props.date)} ago</span>
      </div>
    </div>
  );
}

export default NotificationCard;
