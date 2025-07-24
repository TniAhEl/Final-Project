import React from "react";
// Nếu bạn đã cài: npm install react-chartjs-2 chart.js
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpendingChart = ({
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
  data = [120, 90, 150, 80, 200, 170, 130, 110, 160, 140, 100, 180],
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Spending ($)",
        data,
        backgroundColor: "rgba(37, 99, 235, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Spending", font: { size: 20 } },
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
      className="bg-white rounded-xl shadow p-6 max-w-8xl mx-auto"
      style={{ height: 500, width: "100%" }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SpendingChart;
