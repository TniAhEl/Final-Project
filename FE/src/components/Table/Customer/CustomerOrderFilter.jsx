import React from "react";

const statusOptions = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];
const typeOptions = ["DELIVERY", "PICKUP", "EXPRESS"];

export default function CustomerOrderFilter({ filter, onChange }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 flex flex-wrap gap-6 items-end mb-4 md:gap-8 md:p-8">
      {/* Status */}
      <div className="flex flex-col min-w-[140px]">
        <label className="block text-sm font-semibold mb-2">Status</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={filter.status || ""}
          onChange={(e) => onChange({ ...filter, status: e.target.value })}
        >
          <option value="">All</option>
          {statusOptions.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>
      {/* Type */}
      <div className="flex flex-col min-w-[140px]">
        <label className="block text-sm font-semibold mb-2">Type</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={filter.type || ""}
          onChange={(e) => onChange({ ...filter, type: e.target.value })}
        >
          <option value="">All</option>
          {typeOptions.map((tp) => (
            <option key={tp} value={tp}>
              {tp}
            </option>
          ))}
        </select>
      </div>
      {/* Promotion Code */}
      <div className="flex flex-col min-w-[160px]">
        <label className="block text-sm font-semibold mb-2">
          Promotion Code
        </label>
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={filter.promotionCode || ""}
          onChange={(e) =>
            onChange({ ...filter, promotionCode: e.target.value })
          }
          placeholder="Enter code"
        />
      </div>
      {/* Date */}
      <div className="flex flex-col min-w-[140px]">
        <label className="block text-sm font-semibold mb-2">Date</label>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={filter.date || ""}
          onChange={(e) => onChange({ ...filter, date: e.target.value })}
        />
      </div>
      {/* Min Total */}
      <div className="flex flex-col min-w-[120px]">
        <label className="block text-sm font-semibold mb-2">Min Total</label>
        <input
          type="number"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={filter.minTotalMoney || ""}
          onChange={(e) =>
            onChange({ ...filter, minTotalMoney: e.target.value })
          }
          placeholder="Min"
        />
      </div>
      {/* Max Total */}
      <div className="flex flex-col min-w-[120px]">
        <label className="block text-sm font-semibold mb-2">Max Total</label>
        <input
          type="number"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={filter.maxTotalMoney || ""}
          onChange={(e) =>
            onChange({ ...filter, maxTotalMoney: e.target.value })
          }
          placeholder="Max"
        />
      </div>
    </div>
  );
}
