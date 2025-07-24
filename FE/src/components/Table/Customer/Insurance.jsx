import React, { useEffect, useState } from "react";
import { fetchCustomerInsurances } from "../../../api/insuranceService";

const statusColor = {
  ACTIVE: "text-green-600 font-semibold",
  EXPIRED: "text-red-500 font-semibold",
  PENDING: "text-yellow-500 font-semibold",
};

const InsuranceTable = () => {
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [openDetail, setOpenDetail] = useState(null); // id của insurance đang mở detail

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("Không tìm thấy userId");
        const data = await fetchCustomerInsurances(userId, page, size);
        setInsurances(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError("Không thể tải danh sách hợp đồng bảo hiểm.");
        setInsurances([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [page, size]);

  return (
    <>
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
          {loading ? (
            <div className="p-6 text-center text-gray-400 w-full">Đang tải...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 w-full">{error}</div>
          ) : insurances.length === 0 ? (
            <div className="p-6 text-center text-gray-400 w-full">No insurance contracts found.</div>
          ) : (
            insurances.map((item, idx) => (
              <React.Fragment key={item.contractId + idx}>
                <div className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300">
                  <div className="w-40 p-4 text-zinc-800 text-sm">{item.contractId}</div>
                  <div className="w-40 p-4 text-zinc-800 text-sm">{item.insuranceResponse?.name || "-"}</div>
                  <div className="w-32 p-4 text-zinc-800 text-sm">{item.userResponse ? `${item.userResponse.lastName || ""} ${item.userResponse.firstName || ""}`.trim() : "-"}</div>
                  <div className="w-32 p-4 text-zinc-800 text-sm">{item.createAt}</div>
                  <div className="w-32 p-4 text-zinc-800 text-sm">{item.expiredDate}</div>
                  <div className={`w-24 p-4 text-sm ${statusColor[item.contractStatus] || ""}`}>{item.contractStatus}</div>
                  <div className="w-32 p-4 flex gap-2">
                    <button
                      onClick={() => setOpenDetail(openDetail === item.contractId ? null : item.contractId)}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium"
                    >
                      {openDetail === item.contractId ? "Ẩn" : "Xem"}
                    </button>
                  </div>
                </div>
                {/* Chi tiết insuranceResponse dạng dropdown */}
                {openDetail === item.contractId && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm animate-fade-in">
                    <div><b>Tên gói:</b> {item.insuranceResponse?.name}</div>
                    <div><b>Nhà cung cấp:</b> {item.insuranceResponse?.provider}</div>
                    <div><b>Giá trị bảo hiểm:</b> {item.insuranceResponse?.coverageMoney?.toLocaleString("en-US")} VND</div>
                    <div><b>Phí:</b> {item.insuranceResponse?.fee?.toLocaleString("en-US")} VND</div>
                    <div><b>Ngày phát hành:</b> {item.insuranceResponse?.releaseAt}</div>
                    <div><b>Điều khoản:</b> {item.insuranceResponse?.terms}</div>
                    <div><b>Trạng thái:</b> {item.insuranceResponse?.status}</div>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-2 mt-6 select-none">
        <button
          onClick={() => setPage(0)}
          disabled={page === 0}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
          title="First page"
        >&#171;</button>
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
          title="Previous"
        >&#8249;</button>
        {Array.from({ length: totalPages }, (_, i) => i)
          .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2)
          .map((i, idx, arr) => (
            <React.Fragment key={i}>
              {idx > 0 && i - arr[idx - 1] > 1 && (
                <span className="px-1 text-gray-400">...</span>
              )}
              <button
                onClick={() => setPage(i)}
                className={`w-8 h-8 flex items-center justify-center rounded-full mx-0.5 font-semibold transition-colors ${i === page ? "bg-blue-600 text-white shadow" : "bg-gray-100 hover:bg-blue-100 text-gray-700"}`}
                aria-current={i === page ? "page" : undefined}
              >{i + 1}</button>
            </React.Fragment>
          ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
          title="Next"
        >&#8250;</button>
        <button
          onClick={() => setPage(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
          title="Last page"
        >&#187;</button>
        <div className="flex items-center ml-4">
          <span className="mr-2 text-gray-600 text-sm">Rows per page:</span>
          <select
            value={size}
            onChange={e => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 border rounded text-sm"
          >
            {[5, 10, 20, 50].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default InsuranceTable;
