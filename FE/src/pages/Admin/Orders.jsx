import React, { useState, useEffect } from "react";
import OrderFilter from "../../components/Sidebar/OrderFilter";
import OrderTable from "../../components/Table/Admin/Order";
import OrderDetailModal from "../../components/Modal/OrderDetailModal";
import { MdAdd, MdRefresh, MdSearch } from "react-icons/md";

const AdminOrdersPage = () => {
  // State for orders data
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilters, setCurrentFilters] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for filter options
  const orderTypes = ["DELIVERY", "PICKUP", "EXPRESS"];
  const orderStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ];
  const promotionCodes = ["KM15", "WELCOME10", "FLASH20", "LOYALTY15"];

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Load orders function
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // TODO: Call real API here
      setOrders([]);
      setFilteredOrders([]);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setIsFiltering(true);

    // Store current filters for search integration
    setCurrentFilters(filters);

    // If no filters, show all orders with search term
    if (Object.keys(filters).length === 0) {
      if (searchTerm) {
        const filtered = orders.filter(
          (order) =>
            order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.office.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
      } else {
        setFilteredOrders(orders);
      }
    } else {
      // Apply filters and current search term
      applyFiltersAndSearch(searchTerm);
    }

    setIsFiltering(false);
  };

  // Handle debounce change
  const handleDebounceChange = (isDebouncing) => {
    setIsFiltering(isDebouncing);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // If no filters are applied, just search
    if (Object.keys(currentFilters).length === 0) {
      if (!term) {
        setFilteredOrders(orders);
        return;
      }
      const filtered = orders.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.shippingAddress.toLowerCase().includes(term.toLowerCase()) ||
          order.note?.toLowerCase().includes(term.toLowerCase()) ||
          order.orderProducts?.some((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
          )
      );
      setFilteredOrders(filtered);
    } else {
      // Apply current filters and search
      applyFiltersAndSearch(term);
    }
  };

  // Apply filters and search together
  const applyFiltersAndSearch = (searchTerm = "") => {
    let filtered = [...orders];

    // Apply current filters
    if (currentFilters.types && currentFilters.types.length > 0) {
      filtered = filtered.filter((order) =>
        currentFilters.types.includes(order.type)
      );
    }

    if (currentFilters.statuses && currentFilters.statuses.length > 0) {
      filtered = filtered.filter((order) =>
        currentFilters.statuses.includes(order.status)
      );
    }

    if (
      currentFilters.promotionCodes &&
      currentFilters.promotionCodes.length > 0
    ) {
      filtered = filtered.filter(
        (order) =>
          order.orderPromotions &&
          currentFilters.promotionCodes.includes(order.orderPromotions.code)
      );
    }

    if (currentFilters.startDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.createAt) >= new Date(currentFilters.startDate)
      );
    }
    if (currentFilters.endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.createAt) <= new Date(currentFilters.endDate)
      );
    }

    if (
      currentFilters.minTotalMoney !== undefined ||
      currentFilters.maxTotalMoney !== undefined
    ) {
      filtered = filtered.filter((order) => {
        const total = order.totalMoney;
        const min =
          currentFilters.minTotalMoney !== undefined
            ? currentFilters.minTotalMoney
            : 0;
        const max =
          currentFilters.maxTotalMoney !== undefined
            ? currentFilters.maxTotalMoney
            : Number.MAX_SAFE_INTEGER;
        return total >= min && total <= max;
      });
    }

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchTerm) ||
          order.shippingAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderProducts?.some((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  };

  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle delete order
  const handleDeleteOrder = (order) => {
    console.log("Delete order:", order);
    // Implement delete order functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdRefresh
                className={`text-lg ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <MdAdd className="text-lg" />
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <OrderFilter
        types={orderTypes}
        statuses={orderStatuses}
        promotionCodes={promotionCodes}
        minTotalMoney={0}
        maxTotalMoney={100000000}
        onFilterChange={handleFilterChange}
        onDebounceChange={handleDebounceChange}
      />

      {/* Orders Table */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg text-gray-600">Loading orders...</span>
            </div>
          </div>
        ) : (
          <OrderTable
            orders={filteredOrders}
            onView={handleViewOrder}
            onDelete={handleDeleteOrder}
            showActions={true}
            compact={true}
          />
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default AdminOrdersPage;
