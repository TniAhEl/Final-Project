import React, { useEffect, useState } from "react";
import {
  fetchCustomerOrders,
  getOrderById,
  updateCustomerOrderStatus,
} from "../../../api/orderService";
import { submitProductReview } from "../../../api/orderService";
import { useNavigate } from "react-router-dom";
import CustomerOrderFilter from "./CustomerOrderFilter";
import ReviewPopup from "../../PopUp/Review";

// Cancel Order Popup Component
const CancelOrderPopup = ({ open, onClose, order, onConfirm }) => {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      {/* Popup */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-slate-200"
        style={{ zIndex: 10000 }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 focus:outline-none"
          onClick={onClose}
          title="Close"
        >
          &times;
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Confirm Order Cancellation
          </h3>

          <div className="text-gray-600 mb-6">
            <p>
              Are you sure you want to cancel order{" "}
              <span className="font-semibold">#{order.id}</span>?
            </p>
            <p className="text-sm text-red-500">
              This action cannot be undone.
            </p>
            {order.status === "PENDING" && (
              <p className="text-sm text-green-600 font-medium">
                ✅ This order will be successfully canceled.
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(order);
                onClose();
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusColor = {
  Processing: "text-green-500",
  Deferred: "text-red-500 font-bold",
  Paused: "text-neutral-600",
  CANCELLED: "text-red-500 font-bold",
  PENDING: "text-yellow-600 font-medium",
};

const defaultColumns = [
  { key: "id", label: "Order #", width: "w-20" },
  { key: "type", label: "Type", width: "w-20" },
  { key: "status", label: "Status", width: "w-24" },
  { key: "shippingAddress", label: "Address", width: "w-64" },
  { key: "createAt", label: "Date", width: "w-24" },
  { key: "totalMoney", label: "Total", width: "w-28" },
];

const OrderTable = ({
  orders = [],
  columns = defaultColumns,
  onView = () => {},
  onDelete = () => {},
  onCancel = () => {},
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
            key={(order.id || order.number) + idx}
            className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300 cursor-pointer"
            onClick={() => onView(order)}
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
              <div
                className={`w-32 ${compact ? "p-3" : "p-6"} flex gap-1`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onView(order)}
                  className={`${
                    compact ? "px-2 py-1 text-xs" : "px-3 py-1 text-xs"
                  } rounded bg-blue-600 text-white hover:bg-blue-700 font-medium`}
                  title="View Order"
                >
                  {compact ? "View" : "View"}
                </button>
                {order.status === "PENDING" && (
                  <button
                    onClick={() => onCancel(order)}
                    className={`${
                      compact ? "px-2 py-1 text-xs" : "px-3 py-1 text-xs"
                    } rounded bg-orange-500 text-white hover:bg-orange-600 font-medium`}
                    title="Cancel Order"
                  >
                    {compact ? "C" : "Cancel"}
                  </button>
                )}
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
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [cancelOrderPopup, setCancelOrderPopup] = useState({
    open: false,
    order: null,
  });

  // Handle cancel order
  const handleCancelOrder = async (order) => {
    setCancelOrderPopup({ open: true, order: order });
  };

  const handleConfirmCancelOrder = async (order) => {
    try {
      await updateCustomerOrderStatus(order.id, "CANCELLED");
      // Refresh orders list
      const userId = localStorage.getItem("userId");
      const data = await fetchCustomerOrders(userId, page, size, filter);
      setOrders(data.content || []);
      // Close modal if it's open
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder(null);
      }
      // Close popup
      setCancelOrderPopup({ open: false, order: null });
      alert("This order has been successfully canceled!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while canceling the order!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("User ID not found in localStorage.");
          setLoading(false);
          return;
        }

        // Prepare filter object for API - using the correct format
        const apiFilter = {};
        
        // Add filter fields if they have values
        if (filter.statuses && filter.statuses.length > 0) apiFilter.statuses = filter.statuses;
        if (filter.types && filter.types.length > 0) apiFilter.types = filter.types;
        if (filter.methods && filter.methods.length > 0) apiFilter.methods = filter.methods;
        if (filter.promotionCodes && filter.promotionCodes.length > 0) apiFilter.promotionCodes = filter.promotionCodes;
        if (filter.startDate) apiFilter.startDate = filter.startDate;
        if (filter.endDate) apiFilter.endDate = filter.endDate;
        if (filter.minTotalMoney) apiFilter.minTotalMoney = Number(filter.minTotalMoney);
        if (filter.maxTotalMoney) apiFilter.maxTotalMoney = Number(filter.maxTotalMoney);

        
        const data = await fetchCustomerOrders(userId, page, size, apiFilter);
        
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError("Could not load orders.");
        setOrders([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [filter, page, size]);

  const handleView = (order) => {
    const fetchOrderDetail = async () => {
      try {
        const orderDetail = await getOrderById(order.id);
        setSelectedOrder(orderDetail);
      } catch (error) {
        console.error("Error fetching order detail:", error);
        // Fallback to using order from list if API fails
        setSelectedOrder(order);
      }
    };
    fetchOrderDetail();
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <CustomerOrderFilter filter={filter} onChange={setFilter} />
      
      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">
          <div className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">Error loading orders</div>
          <div className="text-gray-400 text-sm">{error}</div>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State - No orders found */
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <div className="text-gray-500 text-xl font-semibold mb-2">
            No order found
          </div>
          <div className="text-gray-400 text-sm mb-4">
            {getActiveFiltersCount() > 0 
              ? "Try again later"
              : "You have no order. Buy now!"
            }
          </div>
          {getActiveFiltersCount() === 0 && (
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Exlore now!
            </button>
          )}
        </div>
      ) : (
        /* Orders Found - Display Table */
        <>
          <OrderTable
            orders={orders}
            onView={handleView}
            onCancel={handleCancelOrder}
          />
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
            {/* Page numbers */}
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
                {[20, 50].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Modal for order details */}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-700">
                Order Details #{selectedOrder.id || selectedOrder.number}
              </h2>
              {selectedOrder.status === "PENDING" && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm"
                >
                  Cancel Order
                </button>
              )}
            </div>
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
            throw new Error("Missing information to submit review");
          await submitProductReview({ orderProductId, userId, rating, review });
        }}
      />
      {/* Cancel Order Popup */}
      <CancelOrderPopup
        open={cancelOrderPopup.open}
        onClose={() => setCancelOrderPopup({ open: false, order: null })}
        order={cancelOrderPopup.order}
        onConfirm={handleConfirmCancelOrder}
      />
    </div>
  );
};

// Helper function to count active filters
const getActiveFiltersCount = () => {
  // This function should be moved outside the component or defined within it
  // For now, we'll use a simple approach
  return 0; // You can implement this based on your filter state
};

export default CustomerOrderPage;
