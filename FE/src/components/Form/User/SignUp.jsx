import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../../../api/authService";
import { Check } from "lucide-react";

const SignUpForm = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const navigate = useNavigate();

  // Function to show notification
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  };

  // Function to show notification on homepage
  const showNotificationOnHomepage = (message) => {
    localStorage.setItem("showNotification", "true");
    localStorage.setItem("notificationMessage", message);
    window.dispatchEvent(new CustomEvent("showNotification", { detail: { message } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCustomer(form);
      showNotificationOnHomepage("Đăng ký thành công!");
      navigate("/signin");
    } catch (error) {
      showNotificationMessage("Đăng ký thất bại!");
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative">
      <div className="w-[750px] max-w-full rounded-[8px]  p-6 bg-white shadow-md">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-medium">
            First Name
          </label>
          <input
            type="text"
            value={form.fname}
            onChange={(e) => handleChange("fname", e.target.value)}
            placeholder="Enter your first name"
            className="p-3 bg-slate-50 rounded outline-none text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-medium">
            Last Name
          </label>
          <input
            type="text"
            value={form.lname}
            onChange={(e) => handleChange("lname", e.target.value)}
            placeholder="Enter your last name"
            className="p-3 bg-slate-50 rounded outline-none text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email"
            className="p-3 bg-slate-50 rounded outline-none text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-medium">
            Username
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Enter your username"
            className="p-3 bg-slate-50 rounded outline-none text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-medium">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Enter your password"
            className="p-3 bg-slate-50 rounded outline-none text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 text-[15px] font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter your phone number"
            className="p-3 bg-slate-50 rounded outline-none text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full  bg-blue-500 text-white py-3 px-6 rounded font-semibold text-base hover:bg-blue-600 transition-colors mt-2 cursor-pointer"
        >
          Sign Up
        </button>
      </form>
      </div>
      
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span className="text-sm font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
