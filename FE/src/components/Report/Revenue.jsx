import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Plugin để vẽ chỉ số tăng/giảm
const growthPlugin = {
  id: "growthPlugin",
  afterDatasetsDraw(chart) {
    const { ctx, data, chartArea } = chart;
    if (!chartArea) return;
    const dataset = data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    for (let i = 1; i < dataset.data.length; i++) {
      const prev = dataset.data[i - 1];
      const curr = dataset.data[i];
      if (prev == null || curr == null) continue;
      const percent = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
      const color = percent >= 0 ? "#22c55e" : "#ef4444";
      const sign = percent > 0 ? "+" : "";
      const label = `${sign}${percent.toFixed(1)}%`;
      const point = meta.data[i];
      if (!point) continue;
      ctx.save();
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(label, point.x, point.y - 10);
      ctx.restore();
    }
  },
};

const RevenueChart = ({
  labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  data = [500, 700, 800, 600, 1200, 1100, 900, 950, 1300, 1250, 1000, 1400],
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Revenue ($)",
        data,
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "rgba(34,197,94,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Revenue", font: { size: 20 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", font: { family: "Inter" } },
      },
      x: { ticks: { color: "#64748b", font: { family: "Inter" } } },
    },
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-6 mx-auto"
      style={{ height: 500, width: "100%" }}
    >
      <Line data={chartData} options={options} plugins={[growthPlugin]} />
    </div>
  );
};

export default RevenueChart;
