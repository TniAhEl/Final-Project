import React, { useState } from "react";

const AccordionCard = ({ title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        marginBottom: 16,
        background: "#f5f7fa",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          fontSize: 18,
          color: "#222",
          background: "#f1f5f9",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        {title}
        <span style={{ fontSize: 20 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <table style={{ width: "100%", background: "#fff" }}>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ fontWeight: 500, color: "#222", padding: "10px 16px", width: "40%" }}>
                    {item.key}
                  </td>
                  <td style={{ color: item.link ? "#2563eb" : "#444", padding: "10px 16px" }}>
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} style={{ padding: 12, color: "#888" }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AccordionCard;
