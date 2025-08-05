import React from "react";

const statusOptions = [
  "PENDING",
  "CONFIRM", 
  "RECEIVED",
  "CANCELLED"
];

const typeOptions = [
  "DELIVERY",
  "PICKUP"
];

const priceRangeOptions = [
  { label: "All", min: "", max: "" },
  { label: "Under 100K VND", min: "", max: 100000 },
  { label: "100K - 500K VND", min: 100000, max: 500000 },
  { label: "500K - 1M VND", min: 500000, max: 1000000 },
  { label: "1M - 5M VND", min: 1000000, max: 5000000 },
  { label: "Over 5M VND", min: 5000000, max: "" },
];

export default function CustomerOrderFilter({ filter, onChange }) {
  const handlePriceRangeChange = (option) => {
    onChange({
      ...filter,
      minTotalMoney: option.min || "",
      maxTotalMoney: option.max || "",
    });
  };

  const handleClearFilters = () => {
    onChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter.statuses && filter.statuses.length > 0) count++;
    if (filter.types && filter.types.length > 0) count++;
    if (filter.promotionCodes && filter.promotionCodes.length > 0) count++;
    if (filter.startDate || filter.endDate) count++;
    if (filter.minTotalMoney || filter.maxTotalMoney) count++;
    return count;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 mb-4">
      {/* Header with clear button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Filter Orders</h3>
        <div className="flex items-center gap-3">
          {getActiveFiltersCount() > 0 && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {getActiveFiltersCount()} filter(s) active
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Status - Dropdown */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Order Status
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            value={filter.statuses && filter.statuses.length > 0 ? filter.statuses[0] : ""}
            onChange={(e) => {
              const selectedStatus = e.target.value;
              if (selectedStatus) {
                onChange({ ...filter, statuses: [selectedStatus] });
              } else {
                onChange({ ...filter, statuses: [] });
              }
            }}
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Type - Dropdown */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Delivery Type
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition text-sm"
            value={filter.types && filter.types.length > 0 ? filter.types[0] : ""}
            onChange={(e) => {
              const selectedType = e.target.value;
              if (selectedType) {
                onChange({ ...filter, types: [selectedType] });
              } else {
                onChange({ ...filter, types: [] });
              }
            }}
          >
            <option value="">All Types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Date Range
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">From</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                value={filter.startDate ? filter.startDate.split('T')[0] : ""}
                onChange={(e) => {
                  const date = e.target.value ? `${e.target.value}T00:00:00` : "";
                  onChange({ ...filter, startDate: date });
                }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">To</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                value={filter.endDate ? filter.endDate.split('T')[0] : ""}
                onChange={(e) => {
                  const date = e.target.value ? `${e.target.value}T23:59:59` : "";
                  onChange({ ...filter, endDate: date });
                }}
              />
            </div>
          </div>
        </div>

        {/* Promotion Code */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Promotion Code
          </label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            value={filter.promotionCodes ? filter.promotionCodes.join(', ') : ""}
            onChange={(e) => {
              const codes = e.target.value.split(',').map(code => code.trim()).filter(code => code);
              onChange({ ...filter, promotionCodes: codes });
            }}
            placeholder="Enter codes (comma separated)"
          />
          <small className="text-gray-500 mt-1">Separate multiple codes with commas</small>
        </div>

        {/* Price Range */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Price Range
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            value=""
            onChange={(e) => {
              const selectedOption = priceRangeOptions[e.target.value];
              if (selectedOption) {
                handlePriceRangeChange(selectedOption);
              }
            }}
          >
            <option value="">Select Range</option>
            {priceRangeOptions.slice(1).map((option, index) => (
              <option key={index + 1} value={index + 1}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Price Range */}
        <div className="flex flex-col">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Custom Price Range (VND)
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Amount</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                value={filter.minTotalMoney || ""}
                onChange={(e) =>
                  onChange({ ...filter, minTotalMoney: e.target.value ? Number(e.target.value) : "" })
                }
                placeholder="Min amount"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Amount</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
                value={filter.maxTotalMoney || ""}
                onChange={(e) =>
                  onChange({ ...filter, maxTotalMoney: e.target.value ? Number(e.target.value) : "" })
                }
                placeholder="Max amount"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filter.statuses && filter.statuses.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Status: {filter.statuses.join(', ')}
              </span>
            )}
            {filter.types && filter.types.length > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Type: {filter.types.join(', ')}
              </span>
            )}
            {filter.promotionCodes && filter.promotionCodes.length > 0 && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Codes: {filter.promotionCodes.join(', ')}
              </span>
            )}
            {(filter.startDate || filter.endDate) && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                Date: {filter.startDate ? filter.startDate.split('T')[0] : 'Start'} - {filter.endDate ? filter.endDate.split('T')[0] : 'End'}
              </span>
            )}
            {(filter.minTotalMoney || filter.maxTotalMoney) && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                Price: {filter.minTotalMoney || "0"} - {filter.maxTotalMoney || "∞"} VND
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
