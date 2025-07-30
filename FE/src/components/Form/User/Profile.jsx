import React, { useEffect, useState } from "react";
import { getInformation, updateInformation } from "../../../api/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Get userId and token from localStorage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    // Fetch user information
    getInformation(userId)
      .then((data) => {
        setUser(data);
        setFormData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user information");
        setLoading(false);
      });
  }, []);

  // Handle edit mode
  const handleEdit = () => {
    setEditing(true);
    setFormData({ ...user });
  };

  // Handle save changes
  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    setSaving(true);
    setError(null);
    setSuccessMsg("");
    try {
      await updateInformation(userId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        bday: formData.bday || null,
        address: formData.address,
        phone: formData.phone,
      });
      setUser({ ...user, ...formData });
      setEditing(false);
      setSuccessMsg("Update successful!");
    } catch (e) {
      setError("Update failed!");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(""), 2500);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...user });
    setError(null);
    setSuccessMsg("");
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow mt-6">
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow mt-6">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow mt-6">
        <div className="text-center text-gray-500">
          No user information available
        </div>
      </div>
    );
  }

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
          <div className="text-2xl font-semibold text-gray-800">
            {editing
              ? `${formData.firstName || ""} ${formData.lastName || ""}`
              : `${user.firstName} ${user.lastName}`}
          </div>
          <div className="text-gray-500">
            {editing ? formData.email : user.email}
          </div>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-60"
              disabled={saving}
            >
              {saving ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
        )}
      </div>
      {successMsg && (
        <div className="mb-4 text-green-600 font-medium">{successMsg}</div>
      )}
      {/* Form */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-gray-600 mb-1">First Name</label>
          <input
            className={`w-full rounded px-4 py-2 outline-none ${
              editing ? "bg-white border border-gray-300" : "bg-gray-100"
            }`}
            value={editing ? formData.firstName || "" : user.firstName || ""}
            onChange={(e) =>
              editing && handleInputChange("firstName", e.target.value)
            }
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Last Name</label>
          <input
            className={`w-full rounded px-4 py-2 outline-none ${
              editing ? "bg-white border border-gray-300" : "bg-gray-100"
            }`}
            value={editing ? formData.lastName || "" : user.lastName || ""}
            onChange={(e) =>
              editing && handleInputChange("lastName", e.target.value)
            }
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Phone</label>
          <input
            className={`w-full rounded px-4 py-2 outline-none ${
              editing ? "bg-white border border-gray-300" : "bg-gray-100"
            }`}
            value={editing ? formData.phone || "" : user.phone || "N/A"}
            onChange={(e) =>
              editing && handleInputChange("phone", e.target.value)
            }
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Address</label>
          <input
            className={`w-full rounded px-4 py-2 outline-none ${
              editing ? "bg-white border border-gray-300" : "bg-gray-100"
            }`}
            value={editing ? formData.address || "" : user.address || "N/A"}
            onChange={(e) =>
              editing && handleInputChange("address", e.target.value)
            }
            disabled={!editing}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Birthday</label>
          {editing ? (
            <input
              type="date"
              className="w-full rounded px-4 py-2 outline-none bg-white border border-gray-300"
              value={formData.bday ? formData.bday.slice(0, 10) : ""}
              onChange={(e) => handleInputChange("bday", e.target.value)}
              disabled={!editing}
            />
          ) : (
            <input
              className="w-full rounded px-4 py-2 outline-none bg-gray-100"
              value={user.bday || "N/A"}
              disabled
            />
          )}
        </div>
      </div>

      {/* Email Address */}
      <div className="mb-4 text-lg font-semibold text-gray-700">
        My Email Address
      </div>
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="text-blue-500"
            viewBox="0 0 20 20"
          >
            <path d="M2.94 6.94a8 8 0 1111.31 11.31A8 8 0 012.94 6.94zm8.49 8.49a6 6 0 10-8.49-8.49 6 6 0 008.49 8.49z"></path>
          </svg>
        </div>
        <div>
          <div className="text-gray-800">
            {editing ? formData.email : user.email}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
