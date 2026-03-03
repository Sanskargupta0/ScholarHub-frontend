import React, { useEffect, useState } from "react";
import { components } from "../../../components";
import { useAuth } from "../../../store/auth";

function Notification() {
  const {
    newNotification,
    setNewNotification,
    userdata,
    globalNotification,

  } = useAuth();

  const [notification, setNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortNotification = (userNotification, globalNotification) => {
    try {
      // Create safe copies to prevent mutation issues
      const userNotifs = Array.isArray(userNotification) ? [...userNotification] : [];
      const globalNotifs = Array.isArray(globalNotification) ? [...globalNotification] : [];
      
      const combined = [...userNotifs, ...globalNotifs];
      
      // Sort by date (newest first)
      return combined.sort((a, b) => {
        if (!a || !b || !a.date || !b.date) return 0;
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error sorting notifications:", error);
      return [];
    }
  };

  useEffect(() => {
    // Initialize notifications
    const loadNotifications = () => {
      setIsLoading(true);
      
      try {
        // Check if both required arrays are available
        if (Array.isArray(userdata.notifications) && Array.isArray(globalNotification)) {
          const sorted = sortNotification(userdata.notifications, globalNotification);
          setNotification(sorted);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotifications();
    
    // Create a 10-second refresh interval to ensure notifications stay current
    const refreshInterval = setInterval(loadNotifications, 10000);
    
    return () => clearInterval(refreshInterval);
  }, [userdata.notifications, globalNotification]);

  // Handle new incoming notifications separately
  useEffect(() => {
    if (newNotification && newNotification.title && !isLoading) {
      try {
        // Check if the notification is already in the list to avoid duplicates
        const isDuplicate = notification.some(item => 
          item.title === newNotification.title && 
          item.description === newNotification.description &&
          item.date === newNotification.date
        );
        
        if (!isDuplicate) {
          // Add the new notification at the top
          setNotification(prev => [newNotification, ...prev]);
          
          // Clear the new notification to prevent reprocessing
          setNewNotification({});
        }
      } catch (err) {
        console.error("Error handling new notification:", err);
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
      
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}
      
      {!isLoading && !error && notification.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-xl">No notifications yet</p>
        </div>
      )}
      
      <div className="space-y-4">
        {notification.map((item, index) => (
          <components.NotificationCard
            key={`${item.title}-${item.date}-${index}`}
            title={item.title}
            description={item.description}
            date={item.date}
            isGlobal={!userdata.notifications.some(n => 
              n.title === item.title && 
              n.description === item.description &&
              n.date === item.date
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default Notification;
