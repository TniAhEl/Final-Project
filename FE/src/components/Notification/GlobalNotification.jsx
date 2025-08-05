import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

const GlobalNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // success, error, warning

  useEffect(() => {
    // Check for notification in localStorage on mount
    const shouldShowNotification = localStorage.getItem("showNotification");
    const message = localStorage.getItem("notificationMessage");
    
    if (shouldShowNotification === "true" && message) {
      setNotificationMessage(message);
      setShowNotification(true);
      setNotificationType("success");
      
      // Clear localStorage
      localStorage.removeItem("showNotification");
      localStorage.removeItem("notificationMessage");
      
      // Auto hide after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }

    // Listen for custom events
    const handleShowNotification = (event) => {
      const { message, type = "success" } = event.detail;
      setNotificationMessage(message);
      setNotificationType(type);
      setShowNotification(true);
      
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    };

    window.addEventListener("showNotification", handleShowNotification);
    
    return () => {
      window.removeEventListener("showNotification", handleShowNotification);
    };
  }, []);

  const getNotificationStyles = () => {
    switch (notificationType) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-black";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getIcon = () => {
    switch (notificationType) {
      case "success":
        return <Check size={16} />;
      case "error":
        return <X size={16} />;
      case "warning":
        return <X size={16} />;
      default:
        return <Check size={16} />;
    }
  };

  if (!showNotification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${getNotificationStyles()} px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out`}>
      <div className="flex items-center gap-2">
        {getIcon()}
        <span className="text-sm font-medium">{notificationMessage}</span>
        <button
          onClick={() => setShowNotification(false)}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default GlobalNotification; 