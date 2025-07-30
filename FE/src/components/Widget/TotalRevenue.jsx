import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";

const TotalRevenue = ({ value = 0, compareValue = 0, compareType = "up" }) => (
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
      <FaMoneyBillWave size={24} color="#43a047" />
      <span style={{ fontSize: 18, color: "#888" }}>Total Revenue</span>
    </div>
    <div style={{ fontSize: 32, fontWeight: "bold", color: "#43a047" }}>
      {value.toLocaleString()}₫
    </div>
    <div
      style={{
        fontSize: 14,
        marginTop: 8,
        color: compareType === "up" ? "#43a047" : "#e53935",
      }}
    >
      {compareType === "up" ? "▲" : "▼"} {Math.abs(compareValue)}% compared to last month
    </div>
  </div>
);

export default TotalRevenue;
