import React, { useEffect, useState } from "react";
import { fetchCustomerWarranties } from "../../../api/orderService";

const statusColor = {
  Active: "text-green-600 font-semibold",
  Expired: "text-red-500 font-semibold",
  Pending: "text-yellow-500 font-semibold",
};

const WarrantyTable = ({
  onView = () => {},
  onDelete = () => {},
}) => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState(""); // filter status

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Admin chỉ truyền status filter, không truyền userId
        const data = await fetchCustomerWarranties(undefined, page, 10, status ? { status } : {});
        setWarranties(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (e) {
        setWarranties([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchData();
  }, [page, status]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="flex items-center gap-4 p-4">
        <label className="font-medium">Trạng thái:</label>
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(0); }}
        >
          <option value="">Tất cả</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">
            Mã bảo hành
          </div>
          <div className="w-40 p-4 text-slate-800/90 text-sm font-medium">
            Sản phẩm
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Khách hàng
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
          <div className="p-6 text-center text-gray-400 w-full">Đang tải...</div>
        ) : warranties.length === 0 ? (
          <div className="p-6 text-center text-gray-400 w-full">No warranties found.</div>
        ) : (
          warranties.map((item, idx) => (
            <div
              key={item.warrantyId || idx}
              className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300"
            >
              <div className="w-40 p-4 text-zinc-800 text-sm">{item.warrantyId}</div>
              <div className="w-40 p-4 text-zinc-800 text-sm">{item.productName}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">{item.customerName || "-"}</div>
              <div className="w-32 p-4 text-zinc-800 text-sm">
                {item.startDate ? new Date(item.startDate).toLocaleDateString("vi-VN") : "---"}
              </div>
              <div className="w-32 p-4 text-zinc-800 text-sm">
                {item.endDate ? new Date(item.endDate).toLocaleDateString("vi-VN") : "---"}
              </div>
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
          ))
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 p-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-medium"
          onClick={handlePrev}
          disabled={page === 0}
        >
          Trang trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs font-medium"
          onClick={handleNext}
          disabled={page >= totalPages - 1}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default WarrantyTable;
