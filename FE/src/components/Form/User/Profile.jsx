import React from "react";

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow mt-6">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div className="flex-1">
          <div className="text-2xl font-semibold text-gray-800">Alexa Rawles</div>
          <div className="text-gray-500">alexarawles@gmail.com</div>
        </div>
        <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Edit</button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-gray-600 mb-1">Full Name</label>
          <input className="w-full bg-gray-100 rounded px-4 py-2 outline-none" placeholder="Your First Name" disabled />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Nick Name</label>
          <input className="w-full bg-gray-100 rounded px-4 py-2 outline-none" placeholder="Your First Name" disabled />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Gender</label>
          <select className="w-full bg-gray-100 rounded px-4 py-2 outline-none" disabled>
            <option>Your First Name</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Country</label>
          <select className="w-full bg-gray-100 rounded px-4 py-2 outline-none" disabled>
            <option>Your First Name</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Language</label>
          <select className="w-full bg-gray-100 rounded px-4 py-2 outline-none" disabled>
            <option>Your First Name</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Time Zone</label>
          <select className="w-full bg-gray-100 rounded px-4 py-2 outline-none" disabled>
            <option>Your First Name</option>
          </select>
        </div>
      </div>

      {/* Email Address */}
      <div className="mb-4 text-lg font-semibold text-gray-700">My email Address</div>
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
          <svg width="20" height="20" fill="currentColor" className="text-blue-500" viewBox="0 0 20 20"><path d="M2.94 6.94a8 8 0 1111.31 11.31A8 8 0 012.94 6.94zm8.49 8.49a6 6 0 10-8.49-8.49 6 6 0 008.49 8.49z"></path></svg>
        </div>
        <div>
          <div className="text-gray-800">alexarawles@gmail.com</div>
          <div className="text-gray-400 text-sm">1 month ago</div>
        </div>
      </div>
      <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-500 rounded font-medium hover:bg-blue-200 transition">+ Add Email Address</button>
    </div>
  );
};

export default Profile;
