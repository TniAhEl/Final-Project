import React from 'react';

const statusColor = {
  Active: 'text-green-500',
  Inactive: 'text-neutral-600',
  Banned: 'text-red-500 font-bold',
};

const UserTable = ({
  users = [
    { userId: 'U001', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { userId: 'U002', name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', status: 'Inactive' },
    { userId: 'U003', name: 'Alice', email: 'alice@example.com', role: 'Customer', status: 'Banned' },
  ],
  onView = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">ID</div>
          <div className="w-56 p-6 text-slate-800/90 text-sm font-normal">Name</div>
          <div className="flex-1 p-6 text-slate-800/90 text-sm font-normal">Email</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Role</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Status</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Actions</div>
        </div>
        {/* Rows */}
        {users.map((user, idx) => (
          <div key={user.userId} className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300">
            <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{user.userId}</div>
            <div className="w-56 p-6 text-zinc-800 text-sm font-normal">{user.name}</div>
            <div className="flex-1 p-6 text-zinc-800 text-sm font-normal">{user.email}</div>
            <div className="w-40 p-6 text-zinc-800 text-sm font-normal">{user.role}</div>
            <div className={`w-40 p-6 text-sm font-normal ${statusColor[user.status] || 'text-neutral-600'}`}>{user.status}</div>
            <div className="w-40 p-6 flex gap-2">
              <button onClick={() => onView(user)} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium">View</button>
              <button onClick={() => onDelete(user)} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
