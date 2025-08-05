import React, { useEffect, useState } from "react";
import { fetchOrders, confirmOrder, updateAdminOrderStatus, getOrderById } from "../../../api/orderService"; 
import { useNavigate } from "react-router-dom";
import AdminOrderFilter from "./AdminOrderFilter";

// Update Order Status Popup Component
const UpdateOrderStatusPopup = ({ open, onClose, order, onConfirm }) => {
  if (!open || !order) return null;

  const getAvailableActions = (status) => {
    switch (status) {
      case "PENDING":
        return [
          { action: "CONFIRM", label: "Confirm this order", color: "bg-green-600 hover:bg-green-700", description: "Confirm this order" },
          { action: "CANCELLED", label: "Cancel this order", color: "bg-red-500 hover:bg-red-600", description: "Cancel this order" }
        ];
      case "CONFIRM":
        return [
          { action: "RECEIVED", label: "Received", color: "bg-blue-600 hover:bg-blue-700", description: "Customer has received the goods" },
          { action: "CANCELLED", label: "Cancel this order", color: "bg-red-500 hover:bg-red-600", description: "Cancel this order" }
        ];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions(order.status);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>
      {/* Popup */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 border border-slate-200"
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
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Update Order Status
          </h3>
          
          <div className="text-gray-600 mb-6">
            <p className="mb-2">
              Order <span className="font-semibold">#{order.id}</span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Current status: <span className="font-medium text-blue-600">{order.status}</span>
            </p>
            
            {availableActions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Select action:</p>
                {availableActions.map((action) => (
                  <button
                    key={action.action}
                    onClick={() => {
                      onConfirm(order, action.action);
                      onClose();
                    }}
                    className={`w-full px-4 py-3 ${action.color} text-white rounded-lg font-medium transition-colors text-left`}
                  >
                    <div className="font-semibold">{action.label}</div>
                    <div className="text-sm opacity-90">{action.description}</div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No available actions for this status.
              </p>
            )}
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusColor = {
  PENDING: "text-yellow-600 font-medium",
  PROCESSING: "text-blue-600 font-medium",
  SHIPPED: "text-purple-600 font-medium",
  DELIVERED: "text-green-600 font-medium",
  CANCELLED: "text-red-600 font-medium",
  RETURNED: "text-gray-600 font-medium",
  CONFIRM: "text-blue-600 font-medium",
  RECEIVED: "text-green-600 font-medium",
};

const typeColor = {
  DELIVERY: "text-blue-600",
  PICKUP: "text-green-600",
  EXPRESS: "text-purple-600",
};

const defaultColumns = [
  { key: "id", label: "Order #", width: "w-16" },
  { key: "name", label: "Customer Name", width: "w-32" },
  { key: "phone", label: "Phone", width: "w-32" },
  { key: "email", label: "Email", width: "w-40" },
  { key: "type", label: "Type", width: "w-20" },
  { key: "method", label: "Method", width: "w-20" },
  { key: "status", label: "Status", width: "w-24" },
  { key: "shippingAddress", label: "Address", width: "w-48" },
  { key: "createAt", label: "Date", width: "w-24" },
  { key: "totalMoney", label: "Total", width: "w-28" },
];

const OrderTable = ({
  orders = [],
  columns = defaultColumns,
  onView = () => {},
  onUpdate = () => {}, // add prop onUpdate
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
                ) : col.key === "name" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order.name || ""}
                  >
                    {order.name || "-"}
                  </span>
                ) : col.key === "email" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order.email || ""}
                  >
                    {order.email || "-"}
                  </span>
                ) : col.key === "phone" ? (
                  <span
                    className={`${compact ? "text-xs" : "text-sm"} truncate`}
                    title={order.phone || ""}
                  >
                    {order.phone || "-"}
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
                  {compact ? "View" : "View"}
                </button>
                <button
                  onClick={() => onUpdate(order)}
                  className={`${
                    compact ? "px-2 py-1 text-xs" : "px-3 py-1 text-xs"
                  } rounded bg-yellow-500 text-white hover:bg-yellow-600 font-medium`}
                  title="Update Order"
                >
                  {compact ? "Update" : "Update"}
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
  const [updateOrder, setUpdateOrder] = useState(null); // add state for update
  const [updateStatusPopup, setUpdateStatusPopup] = useState({ open: false, order: null });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        // Prepare filter object for API
        const apiFilter = {};
        
        // Add filter fields if they have values
        if (filter.statuses && filter.statuses.length > 0) apiFilter.statuses = filter.statuses;
        if (filter.types && filter.types.length > 0) apiFilter.types = filter.types;
        if (filter.promotionCodes && filter.promotionCodes.length > 0) apiFilter.promotionCodes = filter.promotionCodes;
        if (filter.startDate) apiFilter.startDate = filter.startDate;
        if (filter.endDate) apiFilter.endDate = filter.endDate;
        if (filter.minTotalMoney) apiFilter.minTotalMoney = Number(filter.minTotalMoney);
        if (filter.maxTotalMoney) apiFilter.maxTotalMoney = Number(filter.maxTotalMoney);
        if (filter.customerName) apiFilter.customerName = filter.customerName;
        if (filter.customerEmail) apiFilter.customerEmail = filter.customerEmail;
        if (filter.customerPhone) apiFilter.customerPhone = filter.customerPhone;

        
        const data = await fetchOrders(apiFilter, currentPage, pageSize);
        
        setOrders(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    getOrders();
  }, [filter, currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };
  const handleView = async (order) => {
    try {
      // Call API to get order details
      const orderDetail = await getOrderById(order.id);
      setSelectedOrder(orderDetail);
      setUpdateOrder(null);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      // Fallback to using order from list if API fails
      setSelectedOrder(order);
    }
  };
  const handleUpdate = (order) => {
    setUpdateStatusPopup({ open: true, order: order });
  };
  const handleCloseModal = () => {
    setSelectedOrder(null);
    setUpdateOrder(null);
  };
  const handleCloseUpdatePopup = () => {
    setUpdateStatusPopup({ open: false, order: null });
  };
  // Function to handle order status update
  const handleChangeStatus = async (order, status) => {
    try {
      // Show loading notification
      const loadingNotification = document.createElement('div');
      loadingNotification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      loadingNotification.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span class="font-medium">Updating order status...</span>
        </div>
      `;
      document.body.appendChild(loadingNotification);
      
      // Animate in loading notification
      setTimeout(() => {
        loadingNotification.classList.remove('translate-x-full');
      }, 100);
      
      let success = false;
      
      if (status === "CONFIRM") {
        // Use old API for CONFIRM
        const adminId = localStorage.getItem("adminId");
        await confirmOrder({ adminId, orderId: order.id, status });
        success = true;
      } else {
        // Use new API for other statuses
        await updateAdminOrderStatus(order.id, status);
        success = true;
      }
      
      // Remove loading notification
      loadingNotification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(loadingNotification);
      }, 300);
      
      if (success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
        notification.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-medium">Order status updated successfully!</span>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
          notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
          notification.classList.add('translate-x-full');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
        
        // Reload order list
        setLoading(true);
        const data = await fetchOrders({}, currentPage, pageSize);
        setOrders(data.content || []);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      
      // Remove loading notification if it exists
      const existingLoading = document.querySelector('.fixed.top-4.right-4.bg-blue-500');
      if (existingLoading) {
        existingLoading.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(existingLoading)) {
            document.body.removeChild(existingLoading);
          }
        }, 300);
      }
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span class="font-medium">Failed to update order status!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 4 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 4000);
    }
  };

  return (
    <div>
      <AdminOrderFilter filter={filter} onChange={setFilter} />
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] w-full">
          <div className="w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
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
            No orders found
          </div>
          <div className="text-gray-400 text-sm mb-4">
            {Object.keys(filter).length > 0 
              ? "Try adjusting your filters or check back later"
              : "No orders available at the moment"
            }
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-700">
              Total orders: {orders.length}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
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
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
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
                  onClick={() => setCurrentPage(i)}
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
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
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

      {/* Modal product detail */}
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
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Order detail #{selectedOrder.id}
            </h2>
            {/* User Information */}
            <div className="mb-4 p-4 rounded bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2 text-base">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span>{" "}
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
                  <span className="font-medium">Birthday:</span>{" "}
                  {selectedOrder.user?.bday || "---"}
                </div>
                <div>
                  <span className="font-medium">Address:</span>{" "}
                  {selectedOrder.user?.address || "---"}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {selectedOrder.user?.status || "---"}
                </div>
              </div>
            </div>
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <span className="font-medium">Status:</span>{" "}
                {selectedOrder.status}
              </div>
              <div>
                <span className="font-medium">Method:</span>{" "}
                {selectedOrder.method}
              </div>
              <div>
                <span className="font-medium">Created At:</span>{" "}
                {new Date(selectedOrder.createAt).toLocaleString("vi-VN")}
              </div>
              <div>
                <span className="font-medium">Updated At:</span>{" "}
                {new Date(selectedOrder.updateAt).toLocaleString("vi-VN")}
              </div>
              <div>
                <span className="font-medium">Total:</span>{" "}
                {selectedOrder.totalMoney?.toLocaleString("vi-VN") || "---"} VND
              </div>
              <div>
                <span className="font-medium">Type:</span>{" "}
                {selectedOrder.type}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Note:</span>{" "}
                {selectedOrder.note || "---"}
              </div>
            </div>
            {/* Shipping Information */}
            {selectedOrder.transport && (
              <div className="mb-4 p-4 rounded bg-purple-50 border border-purple-100">
                <h3 className="font-semibold text-purple-700 mb-2 text-base">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Shipping Status:</span>{" "}
                    {selectedOrder.transport.ship}
                  </div>
                  <div>
                    <span className="font-medium">Tracking Number:</span>{" "}
                    {selectedOrder.transport.trackingNumber || "---"}
                  </div>
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {selectedOrder.transport.createAt
                      ? new Date(
                          selectedOrder.transport.createAt
                        ).toLocaleString("vi-VN")
                      : "---"}
                  </div>
                  <div>
                    <span className="font-medium">Updated At:</span>{" "}
                    {selectedOrder.transport.updateAt
                      ? new Date(
                          selectedOrder.transport.updateAt
                        ).toLocaleString("vi-VN")
                      : "---"}
                  </div>
                </div>
              </div>
            )}
            {/* Promotion Information */}
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
                          <th className="px-3 py-2 border-b text-left">
                            Name
                          </th>
                          <th className="px-3 py-2 border-b text-left">Code</th>
                          <th className="px-3 py-2 border-b text-left">Type</th>
                          <th className="px-3 py-2 border-b text-left">
                            Value
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Description
                          </th>
                          <th className="px-3 py-2 border-b text-left">
                            Validity
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
                      Total Discount:{" "}
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
            {/* Product List */}
            <div className="mb-4">
              <h3 className="font-semibold text-blue-700 mb-2 text-base">
                Product List
              </h3>
              <div className="flex flex-col gap-4 max-h-60 overflow-y-auto">
                {selectedOrder.orderProducts &&
                selectedOrder.orderProducts.length > 0 ? (
                  selectedOrder.orderProducts.map((prod, idx) => (
                    <div
                      key={`prod-${prod.id}-${idx}`}
                      className="bg-white rounded-xl border border-slate-200 shadow p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => prod.productId && navigate(`/product/${prod.productId}`)}
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
                        <div>
                          <span className="font-medium text-gray-600">
                            Price:
                          </span>{" "}
                          <span className="text-green-700 font-semibold">
                            {prod.price?.toLocaleString("vi-VN")} VND
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Reviewed:
                          </span>{" "}
                          <span className={prod.reviewed ? "text-green-600" : "text-red-600"}>
                            {prod.reviewed ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No products</div>
                )}
              </div>
            </div>
            {/* Additional Information */}
            <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-2 text-base">
                Additional Information
              </h3>
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                <p><span className="font-medium">Payment Method:</span> {selectedOrder.type}</p>
                <p><span className="font-medium">Shipping Method:</span> {selectedOrder.method}</p>
                {selectedOrder.note && (
                  <p><span className="font-medium">Note:</span> {selectedOrder.note}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Update Order Status Popup */}
      <UpdateOrderStatusPopup
        open={updateStatusPopup.open}
        onClose={handleCloseUpdatePopup}
        order={updateStatusPopup.order}
        onConfirm={handleChangeStatus}
      />
    </div>
  );
};

export default AdminOrderPage;
