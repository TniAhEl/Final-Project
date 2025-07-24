import React from "react";
import Spending from "../components/Report/Spending";

const CustomerDashboard = () => {
  return (
    <div style={{ padding: 24, background: "#f4f6f8", minHeight: "100vh" }}>
      <h1>Dashboard Khách Hàng</h1>

      {/* Biểu đồ báo cáo cho khách hàng */}
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <Spending />
        </div>
      </div>

      {/* Thông tin bổ sung cho khách hàng */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 24,
          width: "100%",
        }}
      >
        {/* Thông tin cá nhân */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <h3 style={{ marginBottom: 16, color: "#333" }}>Thông Tin Cá Nhân</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Họ tên:</span>
              <span style={{ fontWeight: "500" }}>Nguyễn Văn A</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Email:</span>
              <span style={{ fontWeight: "500" }}>nguyenvana@email.com</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Số điện thoại:</span>
              <span style={{ fontWeight: "500" }}>0123456789</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Ngày tham gia:</span>
              <span style={{ fontWeight: "500" }}>15/03/2024</span>
            </div>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            flex: 1,
          }}
        >
          <h3 style={{ marginBottom: 16, color: "#333" }}>Thống Kê Nhanh</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Đơn hàng thành công:</span>
              <span style={{ fontWeight: "500", color: "#52c41a" }}>13</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Đơn hàng đang xử lý:</span>
              <span style={{ fontWeight: "500", color: "#faad14" }}>2</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Sản phẩm yêu thích:</span>
              <span style={{ fontWeight: "500", color: "#1890ff" }}>8</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Đánh giá đã viết:</span>
              <span style={{ fontWeight: "500", color: "#722ed1" }}>5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Đơn hàng gần đây */}
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: 16, color: "#333" }}>Đơn Hàng Gần Đây</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    color: "#666",
                  }}
                >
                  Mã đơn hàng
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    color: "#666",
                  }}
                >
                  Sản phẩm
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    color: "#666",
                  }}
                >
                  Tổng tiền
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    color: "#666",
                  }}
                >
                  Trạng thái
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    textAlign: "left",
                    color: "#666",
                  }}
                >
                  Ngày đặt
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "12px 8px" }}>#ORD001</td>
                <td style={{ padding: "12px 8px" }}>iPhone 15 Pro Max</td>
                <td style={{ padding: "12px 8px" }}>32.500.000đ</td>
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: "#f6ffed",
                      color: "#52c41a",
                      fontSize: "12px",
                    }}
                  >
                    Đã giao
                  </span>
                </td>
                <td style={{ padding: "12px 8px" }}>20/03/2024</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "12px 8px" }}>#ORD002</td>
                <td style={{ padding: "12px 8px" }}>MacBook Air M2</td>
                <td style={{ padding: "12px 8px" }}>28.900.000đ</td>
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: "#fff7e6",
                      color: "#faad14",
                      fontSize: "12px",
                    }}
                  >
                    Đang xử lý
                  </span>
                </td>
                <td style={{ padding: "12px 8px" }}>22/03/2024</td>
              </tr>
              <tr>
                <td style={{ padding: "12px 8px" }}>#ORD003</td>
                <td style={{ padding: "12px 8px" }}>AirPods Pro</td>
                <td style={{ padding: "12px 8px" }}>6.500.000đ</td>
                <td style={{ padding: "12px 8px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: "#fff7e6",
                      color: "#faad14",
                      fontSize: "12px",
                    }}
                  >
                    Đang xử lý
                  </span>
                </td>
                <td style={{ padding: "12px 8px" }}>25/03/2024</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
