import React, { useEffect, useState } from "react";
import Spending from "../components/Report/Spending";
import { getInformation, getCustomerReport, getCustomerReportByYear } from "../api/authService";
import { fetchCustomerOrders } from "../api/orderService";

const CustomerDashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [spendingData, setSpendingData] = useState([]);
  const [spendingLoading, setSpendingLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      setOrdersLoading(false);
      setReportLoading(false);
      setSpendingLoading(false);
      setSpendingData([]);
      return;
    }
    getInformation(userId)
      .then((res) => {
        setUser(res || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Get 5 latest orders
    fetchCustomerOrders(userId, 0, 5)
      .then((res) => {
        setOrders(res.content || []);
        setOrdersLoading(false);
      })
      .catch(() => setOrders([]) || setOrdersLoading(false));
    // Get customer report
    getCustomerReport(userId)
      .then((res) => {
        setReport(res || null);
        setReportLoading(false);
      })
      .catch(() => setReportLoading(false));
    // Get spending data for chart
    const year = new Date().getFullYear();
    getCustomerReportByYear(userId, year, 0, 12)
      .then((res) => {
        setSpendingData(res.data || []);
        setSpendingLoading(false);
      })
      .catch(() => { setSpendingData([]); setSpendingLoading(false); });
  }, []);

  // Generalize full spending data for the year
  const year = new Date().getFullYear();
  const spendingDataFull = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const found = spendingData.find((d) => d.month === month);
    return {
      month,
      totalSpendMoney: found ? found.totalSpendMoney : 0,
    };
  });

  return (
    <div style={{ padding: 24, background: "#f4f6f8", minHeight: "100vh" }}>
      <h1>Dashboard Khách Hàng</h1>

      {/* Chart Spending */}
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <Spending data={spendingDataFull} loading={spendingLoading} />
        </div>
      </div>

      {/* Information */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          width: "100%",
        }}
      >
        {/* Information */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <h3 style={{ marginBottom: 16, color: "#333" }}>Information</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Name:</span>
                <span style={{ fontWeight: "500" }}>{((user.lastName || "") + " " + (user.firstName || "")).trim()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Email:</span>
                <span style={{ fontWeight: "500" }}>{user.email || ""}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>phone:</span>
                <span style={{ fontWeight: "500" }}>{user.phone || ""}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Birthday:</span>
                <span style={{ fontWeight: "500" }}>{user.bday ? new Date(user.bday).toLocaleDateString("vi-VN") : ""}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Address:</span>
                <span style={{ fontWeight: "500" }}>{user.address || ""}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Status:</span>
                <span style={{ fontWeight: "500" }}>{user.status || ""}</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <h3 style={{ marginBottom: 16, color: "#333" }}>Quick Stats</h3>
          {reportLoading ? (
            <div>Loading...</div>
          ) : report ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Total Orders:</span>
                <span style={{ fontWeight: "500", color: "#52c41a" }}>{report.totalOrders}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Pending Orders:</span>
                <span style={{ fontWeight: "500", color: "#faad14" }}>{report.totalPendingOrders}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Confirmed Orders:</span>
                <span style={{ fontWeight: "500", color: "#1890ff" }}>{report.totalConfirmOrders}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Total Products Purchased:</span>
                <span style={{ fontWeight: "500", color: "#722ed1" }}>{report.totalProducts}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Total Spend:</span>
                <span style={{ fontWeight: "500", color: "#d4380d" }}>{report.totalSpendMoney ? report.totalSpendMoney.toLocaleString("vi-VN") + "₫" : 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Total Reviews Written:</span>
                <span style={{ fontWeight: "500", color: "#13c2c2" }}>{report.totalReview}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Month/Year:</span>
                <span style={{ fontWeight: "500" }}>{report.month}/{report.year}</span>
              </div>
            </div>
          ) : (
            <div>No report data available.</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: 16, color: "#333" }}>Recent Orders</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                <th style={{ padding: "12px 8px", textAlign: "left", color: "#666" }}>ID</th>
                <th style={{ padding: "12px 8px", textAlign: "left", color: "#666" }}>Type</th>
                <th style={{ padding: "12px 8px", textAlign: "left", color: "#666" }}>Status</th>
                <th style={{ padding: "12px 8px", textAlign: "left", color: "#666" }}>Total</th>
                <th style={{ padding: "12px 8px", textAlign: "left", color: "#666" }}>Method</th>
                <th style={{ padding: "12px 8px", textAlign: "left", color: "#666" }}>Created At</th>
                <th style={{ padding: "12px 8px", textAlign: "left", color: "#666" }}>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 16 }}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 16 }}>No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 8px" }}>#{order.id}</td>
                    <td style={{ padding: "12px 8px" }}>{order.type}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: order.status === "DELIVERED" ? "#f6ffed" : "#fff7e6",
                        color: order.status === "DELIVERED" ? "#52c41a" : "#faad14",
                        fontSize: "12px",
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>{order.totalMoney ? order.totalMoney.toLocaleString("vi-VN") + "₫" : "-"}</td>
                    <td style={{ padding: "12px 8px" }}>{order.method || "-"}</td>
                    <td style={{ padding: "12px 8px" }}>{order.createAt ? new Date(order.createAt).toLocaleDateString("vi-VN") : "-"}</td>
                    <td style={{ padding: "12px 8px" }}>{order.updateAt ? new Date(order.updateAt).toLocaleDateString("vi-VN") : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
