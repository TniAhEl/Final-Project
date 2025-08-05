import React, { useEffect, useState } from "react";
import Revenue from "../components/Report/Revenue";
import TotalOrder from "../components/Widget/TotalOrder";
import TotalRevenue from "../components/Widget/TotalRevenue";
import TotalCustomer from "../components/Widget/TotalCustomer";
import TotalPending from "../components/Widget/TotalPending";
import { getAdminReportByYear, getAdminReportSummary } from "../api/authService";


const DashBoard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setRevenueData([]);
      setRevenueLoading(false);
      return;
    }
    const year = new Date().getFullYear();
    getAdminReportByYear(userId, year, 0, 12)
      .then((res) => {
        setRevenueData(res.data || []);
        setRevenueLoading(false);
      })
      .catch(() => { setRevenueData([]); setRevenueLoading(false); });
  }, []);

  // Get current month and previous month data
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const thisMonth = revenueData.find((d) => d.month === currentMonth) || {};
  const prevMonth = revenueData.find((d) => d.month === currentMonth - 1) || {};

  // Total orders this month
  const totalOrder = thisMonth.totalOrders || 0;
  // Total revenue this month
  const totalRevenue = thisMonth.totalSpendMoney || 0;
  // Total pending orders this month
  const totalPending = thisMonth.totalPendingOrders || 0;

  // Percentage change compared to previous month (if any)
  const calcPercent = (curr, prev) => {
    if (prev === undefined || prev === null || prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
  };
  const orderPercent = prevMonth.totalOrders ? calcPercent(totalOrder, prevMonth.totalOrders) : null;
  const revenuePercent = prevMonth.totalSpendMoney ? calcPercent(totalRevenue, prevMonth.totalSpendMoney) : null;
  const pendingPercent = prevMonth.totalPendingOrders ? calcPercent(totalPending, prevMonth.totalPendingOrders) : null;

  return (
    <div style={{ padding: 24, background: "#f4f6f8", minHeight: "100vh" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <button
            style={{ padding: '8px 20px', background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
            onClick={async () => {
              await getAdminReportSummary();
              window.location.reload();
            }}
          >
            Refresh
          </button>
        </div>
      </div>
      {/* Widget overview */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }}>
          <TotalOrder
            value={totalOrder}
            compareValue={orderPercent}
            compareType={orderPercent == null ? undefined : orderPercent >= 0 ? "up" : "down"}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TotalRevenue
            value={totalRevenue}
            compareValue={revenuePercent}
            compareType={revenuePercent == null ? undefined : revenuePercent >= 0 ? "up" : "down"}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TotalCustomer
            value={0}
            compareValue={0}
            compareType="up"
          />
        </div>
        <div style={{ flex: 1 }}>
          <TotalPending
            value={totalPending}
            compareValue={pendingPercent}
            compareType={pendingPercent == null ? undefined : pendingPercent >= 0 ? "up" : "down"}
          />
        </div>
      </div>
      {/* Report Chart */}
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <Revenue data={revenueData} loading={revenueLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
