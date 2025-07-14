import React from "react";
import { FaHourglassHalf } from "react-icons/fa";

const TotalPending = ({ value = 0, compareValue = 0, compareType = "down" }) => (
  <div style={{
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    minWidth: 220,
    textAlign: "left"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <FaHourglassHalf size={24} color="#ff9800" />
      <span style={{ fontSize: 18, color: "#888" }}>Đơn chờ xử lý</span>
    </div>
    <div style={{ fontSize: 32, fontWeight: "bold", color: "#ff9800" }}>{value}</div>
    <div style={{ fontSize: 14, marginTop: 8, color: compareType === "up" ? "#43a047" : "#e53935" }}>
      {compareType === "up" ? "▲" : "▼"} {Math.abs(compareValue)}% so với tuần trước
    </div>
  </div>
);

export default TotalPending;
