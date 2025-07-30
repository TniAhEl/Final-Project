import React, { useEffect, useState } from "react";
import { getAllUsersAdmin } from "../../../api/authService";

const statusColor = {
  Active: "text-green-500",
  Inactive: "text-neutral-600",
  Banned: "text-red-500 font-bold",
};

const statusMap = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  BANNED: "Banned",
};

const UserTable = ({
  onView = () => {},
  onDelete = () => {},
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState(""); // filter status

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsersAdmin(page, 10, status || undefined);
        setUsers(res.content || []);
        setTotalPages(res.totalPages || 1);
      } catch (e) {
        setUsers([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [page, status]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      {/* Status filter */}
      <div className="flex items-center gap-4 p-4">
        <label className="font-medium">Status:</label>
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(0); }}
        >
          <option value="">All</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>
      <div className="divide-y divide-slate-300 overflow-x-auto">
        {/* Header */}
        <div className="flex bg-neutral-50 min-w-max">
          <div className="w-60 p-6 text-slate-800/90 text-sm font-normal">Email</div>
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">Last Name</div>
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">First Name</div>
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">Phone</div>
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">Birth Date</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Address</div>
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">Status</div>
          {users.some(u => u.role) && (
            <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">Role</div>
          )}
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Actions</div>
        </div>
        {/* Rows */}
        {loading ? (
          <div className="p-6 text-center text-gray-400 w-full">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-400 w-full">No users found.</div>
        ) : (
          users.map((user, idx) => (
            <div
              key={user.email || idx}
              className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300 min-w-max"
            >
              <div className="w-60 p-6 text-zinc-800 text-sm font-normal">{user.email}</div>
              <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{user.lastName}</div>
              <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{user.firstName}</div>
              <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{user.phone}</div>
              <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{user.bday ? new Date(user.bday).toLocaleDateString("en-US") : "---"}</div>
              <div className="w-40 p-6 text-zinc-800 text-sm font-normal">{user.address}</div>
              <div className={`w-32 p-6 text-sm font-normal ${statusColor[statusMap[user.status]] || "text-neutral-600"}`}>{statusMap[user.status] || user.status}</div>
              {user.role && (
                <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{user.role}</div>
              )}
              <div className="w-40 p-6 flex gap-2">
                <button
                  onClick={() => onView(user)}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 p-4">
        <button
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(0)}
          disabled={page === 0}
        >
          First
        </button>
        <button
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={page === 0}
        >
          &lt;
        </button>
        
        {/* Page number buttons */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i;
          } else if (page < 2) {
            pageNum = i;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 5 + i;
          } else {
            pageNum = page - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              className={`px-3 py-2 rounded text-sm font-medium ${
                page === pageNum
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setPage(pageNum)}
            >
              {pageNum + 1}
            </button>
          );
        })}
        
        <button
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={page >= totalPages - 1}
        >
          &gt;
        </button>
        <button
          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(totalPages - 1)}
          disabled={page >= totalPages - 1}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default UserTable;
