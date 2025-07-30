import { useState } from "react";

const UserInformationForm = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
    address: "",
  });

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User info:", data);
  };

  return (
    <div className="w-[400px] max-w-full rounded-[5px] border border-violet-500 p-4 bg-white">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">First Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your first name"
            className="p-3 bg-slate-50 rounded-sm outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email"
            className="p-3 bg-slate-50 rounded-sm outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Phone Number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter your phone number"
            className="p-3 bg-slate-50 rounded-sm outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Birthday</label>
          <input
            type="date"
            value={data.birthday}
            onChange={(e) => handleChange("birthday", e.target.value)}
            className="p-3 bg-slate-50 rounded-sm outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Gender</label>
          <select
            value={data.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="p-3 bg-slate-50 rounded-sm outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-500">Address</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter your address"
            className="p-3 bg-slate-50 rounded-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-violet-500 text-white py-3 px-6 rounded-sm font-medium hover:bg-violet-600 transition-colors mt-2"
        >
          Save Information
        </button>
      </form>
    </div>
  );
};

export default UserInformationForm;
