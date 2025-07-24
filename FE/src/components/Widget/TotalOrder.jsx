import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const TotalOrder = ({ value = 0, compareValue = 0, compareType = "up" }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 8,
      padding: 24,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      minWidth: 220,
      textAlign: "left",
    }}
  >
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
    >
      <FaShoppingCart size={24} color="#1976d2" />
      <span style={{ fontSize: 18, color: "#888" }}>Tổng số đơn</span>
    </div>
    <div style={{ fontSize: 32, fontWeight: "bold", color: "#1976d2" }}>
      {value}
    </div>
    <div
      style={{
        fontSize: 14,
        marginTop: 8,
        color: compareType === "up" ? "#43a047" : "#e53935",
      }}
    >
      {compareType === "up" ? "▲" : "▼"} {Math.abs(compareValue)}% so với tuần
      trước
    </div>
  </div>
);

export default TotalOrder;
