import { useState } from "react";
import PromotionForm from "../../Form/Promtion";

const statusColor = {
  Active: "text-green-600 font-semibold",
  Expired: "text-red-500 font-semibold",
  Upcoming: "text-yellow-500 font-semibold",
};

const PromotionTable = ({
  promotions = [],
  onView = () => {},
  onDelete = () => {},
  onCreate = () => {},
}) => {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddPromotion = () => {
    setShowForm(true);
    setSuccessMessage("");
  };

  const handleFormSubmit = (formData) => {
    onCreate(formData);
    setShowForm(false);
    setSuccessMessage("🎉 Promotion added successfully!");

    // Hide message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-['Roboto']">
      {!showForm ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Promotion List</h2>
            <button
              onClick={handleAddPromotion}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm"
            >
              + Add Promotion
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded border border-green-300 text-sm">
              {successMessage}
            </div>
          )}

          {/* Table */}
          <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white">
            <div className="divide-y divide-slate-300">
              {/* Header */}
              <div className="flex bg-neutral-50">
                <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">Promotion Name</div>
                <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Code</div>
                <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Type</div>
                <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">Value</div>
                <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Start Date</div>
                <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">End Date</div>
                <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">Status</div>
                <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Actions</div>
              </div>

              {/* Rows */}
              {promotions.length === 0 && (
                <div className="p-6 text-center text-gray-400 w-full">
                  No promotions found.
                </div>
              )}
              {promotions.map((promo, idx) => (
                <div
                  key={promo.code + idx}
                  className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300"
                >
                  <div className="w-40 p-4 text-zinc-800 text-sm">{promo.name}</div>
                  <div className="w-32 p-4 text-zinc-800 text-sm">{promo.code}</div>
                  <div className="w-32 p-4 text-zinc-800 text-sm">{promo.type}</div>
                  <div className="w-24 p-4 text-zinc-800 text-sm">{promo.value}</div>
                  <div className="w-32 p-4 text-zinc-800 text-sm">{promo.startDate}</div>
                  <div className="w-32 p-4 text-zinc-800 text-sm">{promo.endDate}</div>
                  <div className={`w-24 p-4 text-sm ${statusColor[promo.status] || ""}`}>
                    {promo.status}
                  </div>
                  <div className="w-32 p-4 flex gap-2">
                    <button
                      onClick={() => onView(promo)}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(promo)}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Form replaces table
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Promotion</h2>
          <PromotionForm
            isEditing={false}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
};

export default PromotionTable;
