import React, { useEffect, useState } from "react";
import { fetchCustomerWarranties } from "../../../api/orderService";

const statusColor = {
  ACTIVE: "text-green-600 font-semibold",
  EXPIRED: "text-red-500 font-semibold",
  PENDING: "text-yellow-500 font-semibold",
};

const WarrantyTable = ({ onDelete = () => {} }) => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState(null);

  // Lấy userId từ localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomerWarranties(userId);
        setWarranties(data.content || []);
      } catch (e) {
        setWarranties([]);
      }
      setLoading(false);
    };
    if (userId) fetchData();
  }, [userId]);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          <div className="w-16 p-4 text-slate-800/90 text-sm font-medium">
            ID
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Serial
          </div>
          <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">
            Sản phẩm
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Ngày bắt đầu
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Ngày kết thúc
          </div>
          <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">
            Trạng thái
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Thao tác
          </div>
        </div>
        {/* Rows */}
        {loading ? (
          <div className="p-6 text-center text-gray-400 w-full">
            Đang tải...
          </div>
        ) : warranties.length === 0 ? (
          <div className="p-6 text-center text-gray-400 w-full">
            No warranties found.
          </div>
        ) : (
          warranties.map((item) => (
            <React.Fragment key={item.warrantyId}>
              <div className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300">
                <div className="w-16 p-4 text-zinc-800 text-sm">{item.warrantyId}</div>
                <div className="w-32 p-4 text-zinc-800 text-sm">{item.serialNumber}</div>
                <div className="w-40 p-4 text-zinc-800 text-sm">{item.productName}</div>
                <div className="w-32 p-4 text-zinc-800 text-sm">
                  {item.startDate ? new Date(item.startDate).toLocaleDateString("vi-VN") : "---"}
                </div>
                <div className="w-32 p-4 text-zinc-800 text-sm">
                  {item.endDate ? new Date(item.endDate).toLocaleDateString("vi-VN") : "---"}
                </div>
                <div className={`w-24 p-4 text-sm ${statusColor[item.status] || ""}`}>{item.status}</div>
                <div className="w-32 p-4 flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedWarrantyId(
                        selectedWarrantyId === item.warrantyId ? null : item.warrantyId
                      )
                    }
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
                  >
                    {selectedWarrantyId === item.warrantyId ? "Đóng" : "Xem"}
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              {/* Chi tiết bảo hành đổ xuống */}
              {selectedWarrantyId === item.warrantyId && item.warrantyPolicy && (
                <div
                  className="bg-gray-50 border-l-4 border-blue-400 p-6 text-sm"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <div className="mb-2">
                    <span className="font-medium">Thời hạn:</span> {item.warrantyPolicy.duration} tháng
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Điều kiện:</span> {item.warrantyPolicy.condition}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Ngoại lệ:</span> {item.warrantyPolicy.exception}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Ghi chú:</span> {item.warrantyPolicy.note}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Tên chính sách:</span> {item.warrantyPolicy.name}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Cấu hình:</span> {item.optionResponse?.ram}GB RAM, {item.optionResponse?.rom}GB ROM, Màu: {item.optionResponse?.colorName}, Giá: {item.optionResponse?.price?.toLocaleString()}₫
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default WarrantyTable;
