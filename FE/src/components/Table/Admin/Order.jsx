import React, { useEffect, useState } from "react";
import { fetchOrders, confirmOrder } from "../../../api/orderService"; // Đường dẫn đúng tới orderService.js
import { useNavigate } from "react-router-dom";

const statusColor = {
  PENDING: "text-yellow-600 font-medium",
  PROCESSING: "text-blue-600 font-medium",
  SHIPPED: "text-purple-600 font-medium",
  DELIVERED: "text-green-600 font-medium",
  CANCELLED: "text-red-600 font-medium",
  RETURNED: "text-gray-600 font-medium",
};

const typeColor = {
  DELIVERY: "text-blue-600",
  PICKUP: "text-green-600",
  EXPRESS: "text-purple-600",
};

const defaultColumns = [
  { key: "id", label: "Order #", width: "w-12" },
  { key: "type", label: "Type", width: "w-20" },
  { key: "method", label: "Shipping", width: "w-28" }, // Thêm cột method
  { key: "status", label: "Status", width: "w-24" },
  { key: "customer", label: "Customer", width: "w-32" },
  { key: "email", label: "Email", width: "w-40" },
  { key: "phone", label: "Phone", width: "w-32" },
  { key: "promotionCode", label: "Promotion Code", width: "w-32" },
  { key: "shippingAddress", label: "Address", width: "w-64" },
  { key: "createAt", label: "Date", width: "w-24" },
  { key: "totalMoney", label: "Total", width: "w-28" },
  { key: "productCount", label: "Items", width: "w-16" },
];

const OrderTable = ({
  orders = [],
  columns = defaultColumns,
  onView = () => {},
  onUpdate = () => {}, // Thêm prop onUpdate
  onDelete = () => {},
  showActions = true,
  compact = true,
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          {columns.map((col) => (
            <div
              key={col.key}
              className={`${col.width} ${
                compact ? "p-3" : "p-6"
              } text-slate-800/90 ${
                compact ? "text-xs" : "text-sm"
              } font-medium`}
            >
              {col.label}
            </div>
          ))}
          {showActions && (
            <div
              className={`w-32 ${compact ? "p-3" : "p-6"} text-slate-800/90 ${
                compact ? "text-xs" : "text-sm"
              } font-medium`}
            >
              Actions
            </div>
          )}
        </div>
        {/* Rows */}
        {orders.map((order, idx) => (
          <div
            key={order.number + idx}
            className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300"
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className={`${col.width} ${
                  compact ? "p-3" : "p-6"
                } text-zinc-800 ${compact ? "text-xs" : "text-sm"} font-normal`}
              >
                {col.key === "status" ? (
                  <span
                    className={`${
                      statusColor[order.status] || "text-neutral-600"
                    } ${compact ? "text-xs" : "text-sm"}`}
                  >
                    {order.status}
                  </span>
                ) : col.key === "type" ? (
                  <span
                    className={`${typeColor[order.type] || "text-gray-600"} ${
                      compact ? "text-xs" : "text-sm"
                    }`}
                  >
                    {order.type}
                  </span>
                ) : col.key === "method" ? (
                  <span
                    className={`font-medium ${compact ? "text-xs" : "text-sm"}`}
                  >
                    {order.method || "-"}
                  </span>
                ) : col.key === "totalMoney" ? (
                  <span
                    className={`font-medium ${compact ? "text-xs" : "text-sm"}`}
                  >
                    {order.totalMoney
                      ? `${order.totalMoney.toLocaleString("en-US")} VND`
                      : "-"}
                  </span>
                ) : col.key === "createAt" ? (
                  <span className={`${compact ? "text-xs" : "text-sm"}`}>
                    {new Date(order.createAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ) : col.key === "shippingAddress" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order.shippingAddress}
                  >
                    {order.shippingAddress}
                  </span>
                ) : col.key === "productCount" ? (
                  <span
                    className={`${
                      compact ? "text-xs" : "text-sm"
                    } font-medium text-blue-600`}
                  >
                    {order.orderProducts ? order.orderProducts.length : 0}
                  </span>
                ) : col.key === "promotionCode" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order.promotionResponse?.promotionInfo?.code || "-"}
                  >
                    {order.promotionResponse?.promotionInfo?.code || "-"}
                  </span>
                ) : col.key === "customer" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={
                      order.user
                        ? `${order.user.lastName || ""} ${
                            order.user.firstName || ""
                          }`.trim()
                        : order.user?.email || ""
                    }
                  >
                    {order.user
                      ? `${order.user.lastName || ""} ${
                          order.user.firstName || ""
                        }`.trim() || order.user.email
                      : ""}
                  </span>
                ) : col.key === "email" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order.user?.email || ""}
                  >
                    {order.user?.email || ""}
                  </span>
                ) : col.key === "phone" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order.user?.phone || ""}
                  >
                    {order.user?.phone || ""}
                  </span>
                ) : (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order[col.key]}
                  >
                    {order[col.key]}
                  </span>
                )}
              </div>
            ))}
            {showActions && (
              <div className={`w-32 ${compact ? "p-3" : "p-6"} flex gap-2`}>
                <button
                  onClick={() => onView(order)}
                  className={`${
                    compact ? "px-2 py-1 text-xs" : "px-3 py-1 text-xs"
                  } rounded bg-blue-600 text-white hover:bg-blue-700 font-medium`}
                  title="View Order"
                >
                  {compact ? "V" : "View"}
                </button>
                <button
                  onClick={() => onUpdate(order)}
                  className={`${
                    compact ? "px-2 py-1 text-xs" : "px-3 py-1 text-xs"
                  } rounded bg-yellow-500 text-white hover:bg-yellow-600 font-medium`}
                  title="Update Order"
                >
                  {compact ? "U" : "Update"}
                </button>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div
            className={`${compact ? "p-4" : "p-6"} text-center text-gray-400 ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateOrder, setUpdateOrder] = useState(null); // Thêm state cho update
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders({}, currentPage, pageSize);
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        setOrders([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    getOrders();
  }, [currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };
  const handleView = (order) => {
    setSelectedOrder(order);
    setUpdateOrder(null);
  };
  const handleUpdate = (order) => {
    setUpdateOrder(order);
    setSelectedOrder(null);
  };
  const handleCloseModal = () => {
    setSelectedOrder(null);
    setUpdateOrder(null);
  };
  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleChangeStatus = async (status) => {
    try {
      const adminId = localStorage.getItem("adminId");
      const orderId = updateOrder.id;
      await confirmOrder({ adminId, orderId, status });
      alert("Cập nhật trạng thái thành công!");
      setUpdateOrder(null);
      // Reload lại danh sách đơn hàng
      setLoading(true);
      const data = await fetchOrders({});
      setOrders(data.content || []);
      setLoading(false);
    } catch (err) {
      alert("Có lỗi khi cập nhật trạng thái!");
    }
  };

  return (
    <div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-700">
              Tổng số đơn: {orders.length}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          <OrderTable
            orders={orders}
            onView={handleView}
            onUpdate={handleUpdate}
          />
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-4 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    i === currentPage
                      ? "bg-violet-500 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal hiển thị chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-opacity-10 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          ></div>
          {/* Popup */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-[900px] max-w-full mx-4 animate-popup-in border border-slate-200 max-h-[80vh] overflow-y-auto"
            style={{ zIndex: 60 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 focus:outline-none"
              onClick={handleCloseModal}
              title="Đóng"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Chi tiết đơn hàng #{selectedOrder.id}
            </h2>
            {/* Thông tin User */}
            <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2 text-base">
                Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Họ tên:</span>{" "}
                  {selectedOrder.user
                    ? `${selectedOrder.user.lastName || ""} ${
                        selectedOrder.user.firstName || ""
                      }`.trim()
                    : "---"}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedOrder.user?.email || "---"}
                </div>
                <div>
                  <span className="font-medium">Số điện thoại:</span>{" "}
                  {selectedOrder.user?.phone || "---"}
                </div>
                <div>
                  <span className="font-medium">Địa chỉ:</span>{" "}
                  {selectedOrder.user?.address || "---"}
                </div>
              </div>
            </div>
            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <span className="font-medium">Trạng thái:</span>{" "}
                {selectedOrder.status}
              </div>
              <div>
                <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
                {selectedOrder.shippingAddress}
              </div>
              <div>
                <span className="font-medium">Ngày tạo:</span>{" "}
                {new Date(selectedOrder.createAt).toLocaleString("vi-VN")}
              </div>
              <div>
                <span className="font-medium">Tổng tiền:</span>{" "}
                {selectedOrder.totalMoney?.toLocaleString("vi-VN") || "---"} VND
              </div>
              <div>
                <span className="font-medium">Loại đơn:</span>{" "}
                {selectedOrder.type}
              </div>
              <div>
                <span className="font-medium">Số lượng sản phẩm:</span>{" "}
                {selectedOrder.orderProducts?.length || 0}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Ghi chú:</span>{" "}
                {selectedOrder.note || "---"}
              </div>
            </div>
            {/* Thông tin vận chuyển */}
            {selectedOrder.transport && (
              <div className="mb-4 p-4 rounded bg-purple-50 border border-purple-100">
                <h3 className="font-semibold text-purple-700 mb-2 text-base">
                  Thông tin vận chuyển
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Trạng thái giao hàng:</span>{" "}
                    {selectedOrder.transport.ship}
                  </div>
                  <div>
                    <span className="font-medium">Mã vận đơn:</span>{" "}
                    {selectedOrder.transport.trackingNumber || "---"}
                  </div>
                  <div>
                    <span className="font-medium">Ngày tạo vận đơn:</span>{" "}
                    {selectedOrder.transport.createAt
                      ? new Date(
                          selectedOrder.transport.createAt
                        ).toLocaleString("vi-VN")
                      : "---"}
                  </div>
                  <div>
                    <span className="font-medium">Ngày cập nhật:</span>{" "}
                    {selectedOrder.transport.updateAt
                      ? new Date(
                          selectedOrder.transport.updateAt
                        ).toLocaleString("vi-VN")
                      : "---"}
                  </div>
                </div>
              </div>
            )}
            {/* Thông tin promotion áp dụng */}
            {selectedOrder.promotionResponse &&
              selectedOrder.promotionResponse.promotionInfo && (
                <div className="mb-4">
                  <h3 className="font-semibold text-green-700 mb-2 text-base">
                    Khuyến mãi áp dụng
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-slate-200 rounded-lg text-sm">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-3 py-2 border-b text-left">
                            Tên KM
                          </th>
                          <th className="px-3 py-2 border-b text-left">Mã</th>
                          <th className="px-3 py-2 border-b text-left">Loại</th>
                          <th className="px-3 py-2 border-b text-left">
                            Giá trị
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Mô tả
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Hiệu lực
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="px-3 py-2 border-b">
                            {selectedOrder.promotionResponse.promotionInfo.name}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {selectedOrder.promotionResponse.promotionInfo.code}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {selectedOrder.promotionResponse.promotionInfo.type}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {selectedOrder.promotionResponse.promotionInfo
                              .type === "PERCENTAGE"
                              ? `${selectedOrder.promotionResponse.promotionInfo.value}%`
                              : `${selectedOrder.promotionResponse.promotionInfo.value?.toLocaleString(
                                  "vi-VN"
                                )} VND`}
                          </td>
                          <td className="px-3 py-2 border-b">
                            {
                              selectedOrder.promotionResponse.promotionInfo
                                .description
                            }
                          </td>
                          <td className="px-3 py-2 border-b">
                            {
                              selectedOrder.promotionResponse.promotionInfo
                                .startDate
                            }{" "}
                            -{" "}
                            {
                              selectedOrder.promotionResponse.promotionInfo
                                .endDate
                            }
                          </td>
                          <td className="px-3 py-2 border-b">
                            {
                              selectedOrder.promotionResponse.promotionInfo
                                .status
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {typeof selectedOrder.promotionResponse.totalDiscount ===
                    "number" && (
                    <div className="mt-2 text-sm text-green-700 font-medium">
                      Tổng tiền đã giảm:{" "}
                      <span className="font-bold">
                        {selectedOrder.promotionResponse.totalDiscount.toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VND
                      </span>
                    </div>
                  )}
                </div>
              )}
            <div>
              <span className="font-medium">Danh sách sản phẩm:</span>
              <div className="flex flex-col gap-4 mt-2 max-h-60 overflow-y-auto">
                {selectedOrder.orderProducts &&
                selectedOrder.orderProducts.length > 0 ? (
                  selectedOrder.orderProducts.map((prod, idx) => (
                    <div
                      key={`prod-${
                        Number.isFinite(prod.id) ? prod.id : "noid"
                      }-${idx}`}
                      className="bg-white rounded-xl border border-slate-200 shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => prod.id && navigate(`/product/${prod.id}`)}
                    >
                      <div className="text-lg font-semibold text-blue-700 mb-2">
                        {prod.name}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Màu:
                          </span>{" "}
                          {prod.colorName}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            RAM:
                          </span>{" "}
                          {prod.ram}GB
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            ROM:
                          </span>{" "}
                          {prod.rom}GB
                        </div>
                        {prod.quantity && (
                          <div>
                            <span className="font-medium text-gray-600">
                              SL:
                            </span>{" "}
                            {prod.quantity}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-600">
                            Giá:
                          </span>{" "}
                          <span className="text-green-700 font-semibold">
                            {prod.price?.toLocaleString("vi-VN")} VND
                          </span>
                        </div>
                        {selectedOrder.status === "CONFIRM" && (
                          <button
                            className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Xử lý mở modal hoặc chuyển trang review ở đây
                            }}
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">Không có sản phẩm</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal update trạng thái đơn hàng */}
      {updateOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0  duration-300"
            onClick={handleCloseModal}
          ></div>
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-popup-in border border-slate-200"
            style={{ zIndex: 60 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 focus:outline-none"
              onClick={handleCloseModal}
              title="Đóng"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-yellow-700">
              Cập nhật trạng thái đơn hàng #{updateOrder.id}
            </h2>
            <div className="mb-4 p-4 rounded bg-yellow-50 border border-yellow-100">
              <div className="mb-2">
                <span className="font-medium">Họ tên:</span>{" "}
                {updateOrder.user
                  ? `${updateOrder.user.lastName || ""} ${
                      updateOrder.user.firstName || ""
                    }`.trim()
                  : "---"}
              </div>
              <div className="mb-2">
                <span className="font-medium">Email:</span>{" "}
                {updateOrder.user?.email || "---"}
              </div>
              <div className="mb-2">
                <span className="font-medium">Số điện thoại:</span>{" "}
                {updateOrder.user?.phone || "---"}
              </div>
              <div className="mb-2">
                <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
                {updateOrder.shippingAddress ||
                  updateOrder.user?.address ||
                  "---"}
              </div>
              <div className="mb-2">
                <span className="font-medium">Tổng giá trị đơn hàng:</span>{" "}
                {updateOrder.totalMoney?.toLocaleString("vi-VN") || "---"} VND
              </div>
              <div className="mb-2">
                <span className="font-medium">Phương thức thanh toán:</span>{" "}
                {updateOrder.type || "---"}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                onClick={() => handleChangeStatus("CONFIRM")}
              >
                CONFIRM
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
                onClick={() => handleChangeStatus("CANCEL")}
              >
                CANCEL
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                onClick={() => handleChangeStatus("DELIVER")}
              >
                DELIVER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderPage;
