import { useState } from "react";
import GoogleButton from "../../Button/Google";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/authService";

const SignInForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Thêm state này
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    if (field === "username") setUsername(value);
    if (field === "password") setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userId", res.id);
      alert("Sign in successfully");
      navigate("/"); 
    } catch (error) {
      alert("Sign in failed!");
      console.error(error);
    }
  };

  return (
    <div className="w-[420px] max-w-full rounded-[8px] p-8 bg-white flex flex-col gap-8 shadow-lg">
      <div>
        <h2 className="text-3xl font-bold text-blue-600 mb-1">Welcome Back</h2>
        <div className="text-sm text-gray-400 tracking-widest mb-8">
          LOGIN TO CONTINUE
        </div>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-gray-700">
            Username
          </label>
          <input
            type="username"
            value={username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Enter your username ..."
            className="p-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-base"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password..."
              className="p-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-base w-full"
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm select-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-400 hover:underline cursor-pointer mb-2 w-fit">
          Forget Password ?
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition"
        >
          LOGIN
        </button>
        <GoogleButton />
      </form>
      <div className="text-sm text-gray-400 mt-2">
        NEW USER ?{" "}
        <span
          className="text-blue-600 font-semibold cursor-pointer hover:underline"
          onClick={() => navigate("/signup")}
        >
          SIGN UP
        </span>
      </div>
    </div>
  );
};

export default SignInForm;
