import React from "react";

const statusColor = {
  Active: "text-green-600 font-semibold",
  Expired: "text-red-500 font-semibold",
  Pending: "text-yellow-500 font-semibold",
};

const InsuranceTable = ({
  insurances = [],
  onView = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">Mã hợp đồng</div>
          <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">Sản phẩm</div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Khách hàng</div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Ngày bắt đầu</div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Ngày kết thúc</div>
          <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">Trạng thái</div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">Thao tác</div>
        </div>
        {/* Rows */}
        {insurances.length === 0 && (
          <div className="p-6 text-center text-gray-400 w-full">Không có hợp đồng bảo hiểm nào.</div>
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
                Xem
              </button>
              <button
                onClick={() => onDelete(item)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsuranceTable;
