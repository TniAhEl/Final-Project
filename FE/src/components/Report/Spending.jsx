import React from "react";
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

const SpendingChart = ({ data = [], loading }) => {
  const labels = data.length
    ? data.map((d) => `Month ${d.month}`)
    : [
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
      ];
  const chartDataArr = data.length
    ? data.map((d) => d.totalSpendMoney || 0)
    : [120, 90, 150, 80, 200, 170, 130, 110, 160, 140, 100, 180];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Spending (₫)",
        data: chartDataArr,
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

  if (loading) {
    return <div className="p-8 text-center">Loading chart...</div>;
  }
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-gray-400">No spending data available.</div>;
  }

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
