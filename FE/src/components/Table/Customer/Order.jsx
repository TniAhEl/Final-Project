import React, { useEffect, useState } from "react";
import { fetchCustomerOrders } from "../../../api/orderService";
import { submitProductReview } from "../../../api/orderService";
import { useNavigate } from "react-router-dom";
import CustomerOrderFilter from "./CustomerOrderFilter";
import ReviewPopup from "../../PopUp/Review";

const statusColor = {
  Processing: "text-green-500",
  Deferred: "text-red-500 font-bold",
  Paused: "text-neutral-600",
};

const defaultColumns = [
  { key: "id", label: "Order #", width: "w-20" },
  { key: "type", label: "Type", width: "w-20" },
  { key: "status", label: "Status", width: "w-24" },
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
              className={`w-20 ${compact ? "p-3" : "p-6"} text-slate-800/90 ${
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
            key={(order.id || order.number) + idx}
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
                    className={`${
                      compact ? "text-xs" : "text-sm"
                    } text-blue-600`}
                  >
                    {order.type}
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
                    {order.createAt
                      ? new Date(order.createAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
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
              <div className={`w-20 ${compact ? "p-3" : "p-6"} flex gap-1`}>
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
                  onClick={() => onDelete(order)}
                  className={`${
                    compact ? "px-2 py-1 text-xs" : "px-3 py-1 text-xs"
                  } rounded bg-red-500 text-white hover:bg-red-600 font-medium`}
                  title="Delete Order"
                >
                  {compact ? "D" : "Delete"}
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

const CustomerOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy userId từ localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User ID not found in localStorage.");
          setLoading(false);
          return;
        }
        const data = await fetchCustomerOrders(userId, page, size, filter);
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError("Could not load orders.");
        setOrders([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [filter, page, size]);

  const handleView = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <CustomerOrderFilter filter={filter} onChange={setFilter} />
      {loading || (orders.length === 0 && !error) ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">
          <div className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500">
          {error
            .replace(
              "Không thể tải danh sách đơn hàng.",
              "Could not load orders."
            )
            .replace(
              "Không tìm thấy userId trong localStorage.",
              "User ID not found in localStorage."
            )}
        </div>
      ) : (
        <>
          <OrderTable orders={orders} onView={handleView} />
          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6 select-none">
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
              title="First page"
            >
              &#171;
            </button>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
              title="Previous"
            >
              &#8249;
            </button>
            {/* Hiển thị dãy số trang */}
            {Array.from({ length: totalPages }, (_, i) => i)
              .filter(
                (i) =>
                  i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2
              )
              .map((i, idx, arr) => (
                <React.Fragment key={i}>
                  {idx > 0 && i - arr[idx - 1] > 1 && (
                    <span className="px-1 text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full mx-0.5 font-semibold transition-colors
                      ${
                        i === page
                          ? "bg-blue-600 text-white shadow"
                          : "bg-gray-100 hover:bg-blue-100 text-gray-700"
                      }`}
                    aria-current={i === page ? "page" : undefined}
                  >
                    {i + 1}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
              title="Next"
            >
              &#8250;
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
              title="Last page"
            >
              &#187;
            </button>
            <div className="flex items-center ml-4">
              <span className="mr-2 text-gray-600 text-sm">Rows per page:</span>
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
                className="px-2 py-1 border rounded text-sm"
              >
                {[5, 10, 20, 50].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Modal hiển thị chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          ></div>
          {/* Popup */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 animate-popup-in border border-slate-200"
            style={{ zIndex: 60 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 focus:outline-none"
              onClick={handleCloseModal}
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Order Details #{selectedOrder.id || selectedOrder.number}
            </h2>
            {/* User Info */}
            <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2 text-base">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Full Name:</span>{" "}
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
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedOrder.user?.phone || "---"}
                </div>
                <div>
                  <span className="font-medium">Address:</span>{" "}
                  {selectedOrder.user?.address || "---"}
                </div>
              </div>
            </div>
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <span className="font-medium">Status:</span>{" "}
                {selectedOrder.status}
              </div>
              <div>
                <span className="font-medium">Shipping Address:</span>{" "}
                {selectedOrder.shippingAddress}
              </div>
              <div>
                <span className="font-medium">Created At:</span>{" "}
                {selectedOrder.createAt
                  ? new Date(selectedOrder.createAt).toLocaleString("en-US")
                  : "---"}
              </div>
              <div>
                <span className="font-medium">Total:</span>{" "}
                {selectedOrder.totalMoney?.toLocaleString("en-US") || "---"} VND
              </div>
              <div>
                <span className="font-medium">Type:</span> {selectedOrder.type}
              </div>
              <div>
                <span className="font-medium">Product Count:</span>{" "}
                {selectedOrder.orderProducts?.length || 0}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Note:</span>{" "}
                {selectedOrder.note || "---"}
              </div>
            </div>
            {/* Promotion Info */}
            {selectedOrder.promotionResponse &&
              selectedOrder.promotionResponse.promotionInfo && (
                <div className="mb-4">
                  <h3 className="font-semibold text-green-700 mb-2 text-base">
                    Applied Promotion
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-slate-200 rounded-lg text-sm">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-3 py-2 border-b text-left">Name</th>
                          <th className="px-3 py-2 border-b text-left">Code</th>
                          <th className="px-3 py-2 border-b text-left">Type</th>
                          <th className="px-3 py-2 border-b text-left">
                            Value
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Description
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Valid
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Status
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
                                  "en-US"
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
                      Total Discount:{" "}
                      <span className="font-bold">
                        {selectedOrder.promotionResponse.totalDiscount.toLocaleString(
                          "en-US"
                        )}{" "}
                        VND
                      </span>
                    </div>
                  )}
                </div>
              )}
            {/* Product List in Modal */}
            <div>
              <span className="font-medium">Product List:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 max-h-72 overflow-y-auto">
                {selectedOrder.orderProducts &&
                selectedOrder.orderProducts.length > 0 ? (
                  selectedOrder.orderProducts.map((prod, idx) => (
                    <div
                      key={prod.id ? `prod-${prod.id}` : `idx-${idx}`}
                      className="bg-white rounded-xl border border-slate-200 shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => navigate(`/product/${prod.productId}`)}
                      title="View product details"
                    >
                      <div className="text-lg font-semibold text-blue-700 mb-2">
                        {prod.name}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Color:
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
                              Qty:
                            </span>{" "}
                            {prod.quantity}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-600">
                            Price:
                          </span>{" "}
                          <span className="text-green-700 font-semibold">
                            {prod.price?.toLocaleString("en-US")} VND
                          </span>
                        </div>
                        {selectedOrder.status === "CONFIRM" && (
                          <button
                            className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReviewProduct(prod);
                              setReviewOpen(true);
                            }}
                          >
                            Review now
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No products</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Popup Review */}
      <ReviewPopup
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        product={reviewProduct}
        orderId={selectedOrder?.id}
        onSubmit={async ({ rating, review }) => {
          const userId = localStorage.getItem("userId");
          const orderProductId = reviewProduct?.id;
          if (!userId || !orderProductId)
            throw new Error("Thiếu thông tin đánh giá");
          await submitProductReview({ orderProductId, userId, rating, review });
        }}
      />
    </div>
  );
};

export default CustomerOrderPage;
