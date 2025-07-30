import React from "react";
import { FaWallet } from "react-icons/fa";

const Dashboard = ({}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl shadow p-6 flex flex-col items-start gap-3 max-w-xs">
      <div className="flex items-center gap-3 mb-2">
        <FaWallet className="text-blue-600 text-2xl" />
        <span className="text-lg font-bold text-blue-900">Total Spent</span>
      </div>
      <div className="text-3xl font-extrabold text-blue-700 mb-1">${15}</div>
      <div className="text-sm text-blue-800 opacity-80">{}</div>
    </div>
  );
};

export default Dashboard;
