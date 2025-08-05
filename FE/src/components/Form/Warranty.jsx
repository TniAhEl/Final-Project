import { useState } from "react";

const WarrantyForm = ({ onSubmit, onCancel }) => {
  const [warrantyData, setWarrantyData] = useState({
    name: "",
    duration: "",
    condition: "",
    exception: "",
    note: "",
  });

  const handleInputChange = (field, value) => {
    setWarrantyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // warranty
    if (onSubmit) {
      onSubmit(warrantyData);
    }
  };

  return (
    <div className="w-[492px] max-w-full rounded-[5px] border border-violet-500 p-4 bg-white">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* name */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 text-base font-normal font-['IBM_Plex_Sans']">
            Warranty Package Name
          </label>
          <input
            type="text"
            value={warrantyData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="E.g: Manufacturer Warranty, Extended Warranty..."
            className="p-3 bg-slate-50 rounded-sm text-gray-700 text-base font-normal font-['IBM_Plex_Sans'] outline-none"
          />
        </div>
        {/* duration */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 text-base font-normal font-['IBM_Plex_Sans']">
            Warranty Duration
          </label>
          <input
            type="number"
            value={warrantyData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            placeholder="E.g: 12 (months)"
            className="p-3 bg-slate-50 rounded-sm text-gray-700 text-base font-normal font-['IBM_Plex_Sans'] outline-none"
          />
        </div>
        {/* condition */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 text-base font-normal font-['IBM_Plex_Sans']">
            Warranty Conditions
          </label>
          <textarea
            value={warrantyData.condition}
            onChange={(e) => handleInputChange("condition", e.target.value)}
            placeholder="E.g: Product must be in original condition, no physical damage..."
            rows="3"
            className="p-3 bg-slate-50 rounded-sm text-gray-700 text-base font-normal font-['IBM_Plex_Sans'] outline-none resize-none"
          />
        </div>
        {/* exception */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 text-base font-normal font-['IBM_Plex_Sans']">
            Exclusions
          </label>
          <textarea
            value={warrantyData.exception}
            onChange={(e) => handleInputChange("exception", e.target.value)}
            placeholder="E.g: No warranty for water damage, physical impact..."
            rows="3"
            className="p-3 bg-slate-50 rounded-sm text-gray-700 text-base font-normal font-['IBM_Plex_Sans'] outline-none resize-none"
          />
        </div>
        {/* note */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-500 text-base font-normal font-['IBM_Plex_Sans']">
            Notes
          </label>
          <textarea
            value={warrantyData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
            placeholder="E.g: Additional warranty policy information..."
            rows="2"
            className="p-3 bg-slate-50 rounded-sm text-gray-700 text-base font-normal font-['IBM_Plex_Sans'] outline-none resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-sm font-['IBM_Plex_Sans'] text-base font-medium hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-violet-500 text-white py-3 px-6 rounded-sm font-['IBM_Plex_Sans'] text-base font-medium hover:bg-violet-600 transition-colors"
          >
            Save Warranty
          </button>
        </div>
      </form>
    </div>
  );
};

export default WarrantyForm;
