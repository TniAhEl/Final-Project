import React, { useState } from "react";
import InsuranceForm from "../../Form/Insurance.jsx";

const statusColor = {
  Active: "text-green-600 font-semibold",
  Expired: "text-red-500 font-semibold",
  Pending: "text-yellow-500 font-semibold",
};

const InsuranceTable = ({
  insurances = [],
  onView = () => {},
  onDelete = () => {},
  onAdd = () => {},
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  // Nếu có edit thì có thể thêm state editingInsurance, isEditing nếu cần

  const handleAddInsurance = (insuranceData) => {
    onAdd(insuranceData);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  return (
    <div className="w-full relative">
      {/* Add Insurance Button */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Insurance Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors font-medium"
        >
          Add Insurance
        </button>
      </div>

      {/* Add Insurance Form Modal - style giống ProductTable */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Insurance
              </h2>
              <button
                onClick={handleCancelAdd}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <InsuranceForm
                onSubmit={handleAddInsurance}
                onCancel={handleCancelAdd}
              />
            </div>
          </div>
        </div>
      )}

      {/* Insurance Table */}
      <div className="rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
        <div className="divide-y divide-slate-300">
          {/* Header */}
          <div className="flex bg-neutral-50">
            <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">Contract Code</div>
            <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">Product</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Customer</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Start Date</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">End Date</div>
            <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">Status</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Actions</div>
          </div>
          {/* Rows */}
          {insurances.length === 0 && (
            <div className="p-6 text-center text-gray-400 w-full">No insurance contracts found.</div>
          )}
          {insurances.map((item, idx) => (
            <div key={item.code + idx} className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300">
              <div className="w-40 p-4 text-zinc-800 text-sm">{item.code}</div>
              <div className="w-40 p-4 text-zinc-800 text-sm">{item.product}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">{item.customer}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">{item.startDate}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">{item.endDate}</div>
              <div className={`w-24 p-4 text-sm ${statusColor[item.status] || ""}`}>{item.status}</div>
              <div className="w-32 p-4 flex gap-2">
                <button
                  onClick={() => onView(item)}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsuranceTable;
