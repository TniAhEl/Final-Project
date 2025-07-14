import React from "react";
import Revenue from "../components/Report/Revenue";
import TotalOrder from "../components/Widget/TotalOrder";
import TotalRevenue from "../components/Widget/TotalRevenue";
import TotalCustomer from "../components/Widget/TotalCustomer";
import TotalPending from "../components/Widget/TotalPending";
// Có thể import thêm các widget nhỏ nếu có

const DashBoard = () => {
  // Dữ liệu mẫu, sau này có thể lấy từ API
  const totalOrder = 1200;
  const totalRevenue = 350000000;
  const totalCustomer = 800;
  const totalPending = 35;

  return (
    <div style={{ padding: 24, background: "#f4f6f8", minHeight: "100vh" }}>
      <h1>Dashboard Báo Cáo</h1>
      {/* Widget tổng quan */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }}>
          <TotalOrder value={totalOrder} compareValue={12} compareType="up" />
        </div>
        <div style={{ flex: 1 }}>
          <TotalRevenue value={totalRevenue} compareValue={-5} compareType="down" />
        </div>
        <div style={{ flex: 1 }}>
          <TotalCustomer value={totalCustomer} compareValue={8} compareType="up" />
        </div>
        <div style={{ flex: 1 }}>
          <TotalPending value={totalPending} compareValue={-2} compareType="down" />
        </div>
      </div>
      {/* Biểu đồ báo cáo */}
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <Revenue />
        </div>
        
      </div>
    </div>
  );
};

export default DashBoard;
