import React, { useState, useEffect } from "react";
import InsuranceForm from "../../Form/Insurance.jsx";
import { getAllInsurances } from "../../../api/insuranceService";

const statusColor = {
  Active: "text-green-600 font-semibold",
  Expired: "text-red-500 font-semibold",
  Pending: "text-yellow-500 font-semibold",
};

const InsuranceTable = () => {
  const [insurances, setInsurances] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // object or null
  const [editingInsurance, setEditingInsurance] = useState(null); // object or null

  const fetchInsurances = async () => {
    const res = await getAllInsurances();
    setInsurances(res.data || []);
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  const handleAddInsurance = (insuranceData) => {
    // TODO: integrate API for adding new insurance
    setShowAddForm(false);
    fetchInsurances();
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleView = (item) => {
    setShowDetail(item);
  };

  const handleCloseDetail = () => {
    setShowDetail(null);
  };

  const handleUpdate = (item) => {
    setEditingInsurance(item);
  };

  const handleUpdateSubmit = (formData) => {
    // TODO: integrate API for updating insurance if available
    setEditingInsurance(null);
    fetchInsurances();
  };

  const handleCancelUpdate = () => {
    setEditingInsurance(null);
  };

  const handleDelete = (item) => {
    // TODO: integrate API for deleting insurance if available
    fetchInsurances();
  };

  return (
    <div className="w-full relative">
      {/* Add Insurance Button */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Insurance Management
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors font-medium"
        >
          Add Insurance
        </button>
      </div>

      {/* Add Insurance Form Modal */}
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

      {/* Update Insurance Form Modal */}
      {editingInsurance && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Insurance
              </h2>
              <button
                onClick={handleCancelUpdate}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <InsuranceForm
                initialValues={editingInsurance}
                isEditing={true}
                onSubmit={handleUpdateSubmit}
                onCancel={handleCancelUpdate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Insurance Detail
              </h2>
              <button
                onClick={handleCloseDetail}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-2">
              <div><b>Name:</b> {showDetail.name}</div>
              <div><b>Provider:</b> {showDetail.provider}</div>
              <div><b>Release At:</b> {showDetail.releaseAt}</div>
              <div><b>Insured:</b> {showDetail.insured}</div>
              <div><b>Terms:</b> {showDetail.terms}</div>
              <div><b>Status:</b> {showDetail.status}</div>
              <div><b>Coverage Money:</b> {showDetail.coverageMoney?.toLocaleString()}₫</div>
              <div><b>Fee:</b> {showDetail.fee?.toLocaleString()}₫</div>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Table */}
      <div className="rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
        <div className="divide-y divide-slate-300">
          {/* Header */}
          <div className="flex bg-neutral-50">
            <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">Name</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Provider</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Release At</div>
            <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">Insured</div>
            <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">Terms</div>
            <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">Status</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Coverage</div>
            <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">Fee</div>
            <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Actions</div>
          </div>
          {/* Rows */}
          {insurances.length === 0 && (
            <div className="p-6 text-center text-gray-400 w-full">
              No insurance contracts found.
            </div>
          )}
          {insurances.map((item, idx) => (
            <div key={item.name + idx} className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300">
              <div className="w-40 p-4 text-zinc-800 text-sm">{item.name}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">{item.provider}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">{item.releaseAt}</div>
              <div className="w-24 p-4 text-zinc-800 text-sm">{item.insured}</div>
              <div className="w-40 p-4 text-zinc-800 text-sm">{item.terms}</div>
              <div className={`w-24 p-4 text-sm ${statusColor[item.status] || ""}`}>{item.status}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">{item.coverageMoney?.toLocaleString()}₫</div>
              <div className="w-24 p-4 text-zinc-800 text-sm">{item.fee?.toLocaleString()}₫</div>
              <div className="w-32 p-4 flex gap-2">
                <button
                  onClick={() => handleView(item)}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => handleUpdate(item)}
                  className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-xs font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item)}
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
