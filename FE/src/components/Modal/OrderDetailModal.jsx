import React from "react";
import {
  MdClose,
  MdLocationOn,
  MdNote,
  MdShoppingCart,
  MdAttachMoney,
} from "react-icons/md";

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const statusColor = {
    PENDING: "text-yellow-600 bg-yellow-50",
    PROCESSING: "text-blue-600 bg-blue-50",
    SHIPPED: "text-purple-600 bg-purple-50",
    DELIVERED: "text-green-600 bg-green-50",
    CANCELLED: "text-red-600 bg-red-50",
    RETURNED: "text-gray-600 bg-gray-50",
  };

  const typeColor = {
    DELIVERY: "text-blue-600 bg-blue-50",
    PICKUP: "text-green-600 bg-green-50",
    EXPRESS: "text-purple-600 bg-purple-50",
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotal = () => {
    if (order.totalMoney) return order.totalMoney;
    if (order.orderProducts) {
      return order.orderProducts.reduce(
        (total, product) => total + (product.price || 0),
        0
      );
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-600">Order #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Order Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Order ID:
                    </span>
                    <span className="text-sm text-gray-900 font-mono">
                      #{order.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Type:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        typeColor[order.type] || "text-gray-600 bg-gray-50"
                      }`}
                    >
                      {order.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColor[order.status] || "text-gray-600 bg-gray-50"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Created:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(order.createAt)}
                    </span>
                  </div>
                  {order.updateAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Updated:
                      </span>
                      <span className="text-sm text-gray-900">
                        {formatDate(order.updateAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <MdLocationOn className="text-gray-500" />
                    Shipping Address
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {order.shippingAddress}
                  </p>
                </div>
              )}

              {/* Note */}
              {order.note && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <MdNote className="text-gray-500" />
                    Note
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {order.note}
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Total Items:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.orderProducts ? order.orderProducts.length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Subtotal:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {calculateTotal().toLocaleString("en-US")} VND
                  </span>
                </div>
                {order.orderPromotions && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Promotion:
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      -{order.orderPromotions.discount || 0} VND
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-base font-bold text-blue-600">
                      {calculateTotal().toLocaleString("en-US")} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Products */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-1">
              <MdShoppingCart className="text-gray-500" />
              Order Products (
              {order.orderProducts ? order.orderProducts.length : 0})
            </h3>
            {order.orderProducts && order.orderProducts.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Color
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RAM/ROM
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.orderProducts.map((product, index) => (
                        <tr
                          key={product.id || index}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {product.colorName}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">
                              {product.ram}GB / {product.rom}GB
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {product.price
                                ? product.price.toLocaleString("en-US")
                                : 0}{" "}
                              VND
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MdShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm">No products found in this order.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
