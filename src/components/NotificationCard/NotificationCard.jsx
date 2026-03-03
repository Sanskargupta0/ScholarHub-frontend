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

  // Determine if notification is new (less than 1 hour old)
  const isNew = () => {
    const notificationDate = new Date(props.date);
    const currentUTC = new Date();
    const currentIST = new Date(currentUTC.getTime() + 5.5 * 60 * 60 * 1000);
    const diffInSeconds = Math.floor((currentIST - notificationDate) / 1000);
    return diffInSeconds < 3600; // Less than 1 hour
  };

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border-l-4 ${isNew() ? 'border-blue-500 animate-pulse-once' : 'border-gray-200 dark:border-gray-700'} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          {props.title}
          {isNew() && (
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
          )}
        </h2>
        <span className="text-gray-500 dark:text-gray-400 text-sm">{timeAgo(props.date)} ago</span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-3">{props.description}</p>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(props.date).toLocaleDateString()}</span>
        </div>
        {props.isGlobal && (
          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">Global</span>
        )}
      </div>
    </div>
  );
}

export default NotificationCard;
