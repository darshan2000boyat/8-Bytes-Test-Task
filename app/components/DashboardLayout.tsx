"use client";

import React, { useState } from "react";
import { Doughnut, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// Top Holdings component
const TopHoldings = () => {
  const [sortAsc, setSortAsc] = useState(true);

  const holdings = [
    { name: "AAPL", value: 5000 },
    { name: "MSFT", value: 4200 },
    { name: "GOOG", value: 3000 },
    { name: "AMZN", value: 2500 },
    { name: "TSLA", value: 6000 },
    { name: "NVDA", value: 2000 },
    { name: "NVDA", value: 2000 },
    { name: "NVDA", value: 2000 },
    { name: "NVDA", value: 2000 },
    { name: "NVDA", value: 2000 },
  ];

  const sortedHoldings = [...holdings].sort((a, b) =>
    sortAsc ? a.value - b.value : b.value - a.value
  );

  return (
    <div className="w-full h-[90%] overflow-y-scroll">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => setSortAsc(!sortAsc)}
      >
        Sort by Value {sortAsc ? "▲" : "▼"}
      </button>
      <ul className="flex flex-col gap-2">
        {sortedHoldings.map((holding, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center p-2 bg-gray-100 rounded"
          >
            <span className="font-medium">{holding.name}</span>
            <span
              className={`font-bold ${
                holding.value >= 4000 ? "text-green-500" : "text-red-500"
              }`}
            >
              ${holding.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashboardLayout = () => {
  const assetAllocationData = {
    labels: ["Stocks", "Bonds", "Cash", "Crypto"],
    datasets: [
      {
        label: "Asset Allocation",
        data: [50, 20, 20, 10],
        backgroundColor: ["#6366F1", "#F472B6", "#34D399", "#FBBF24"],
      },
    ],
  };

  const sectorBreakdownData = {
    labels: ["Tech", "Finance", "Healthcare", "Energy"],
    datasets: [
      {
        label: "Sector Breakdown",
        data: [40, 25, 20, 15],
        backgroundColor: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"],
      },
    ],
  };

  const portfolioPerformanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [10000, 10500, 10200, 10800, 11200, 11000, 11500],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const renderLegend = (labels: string[], colors: string[]) => (
    <ul className="absolute left-[80%] bottom-4 z-50 flex flex-col gap-2 mt-4">
      {labels.map((label, idx) => (
        <li key={idx} className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: colors[idx] }}
          />
          <span className="text-black font-medium">{label}</span>
        </li>
      ))}
    </ul>
  );

  const row1Data = [
    { title: "Portfolio Value", value: "$25,000", change: 500 },
    { title: "Daily Change", value: "$1,200", change: -150 },
    { title: "Monthly Return", value: "$3,400", change: 200 },
    { title: "YTD Return", value: "$8,900", change: 800 },
  ];

  return (
    <section className="w-full lg:w-[80%] min-h-screen overflow-y-scroll bg-white text-black  grid grid-cols-1 gap-6 pt-24 pb-12 px-4">
      {/* Row 1: 4 cards */}
      <aside className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {row1Data.map((card, idx) => (
          <section
            key={idx}
            className="w-full h-48 bg-white shadow-lg rounded-lg p-4 flex flex-col justify-center items-center"
          >
            <h2 className="text-lg font-bold text-gray-400">{card.title}</h2>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
            <p
              className={`mt-1 font-medium ${
                card.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {card.change >= 0 ? "▲" : "▼"} ${Math.abs(card.change)}
            </p>
          </section>
        ))}
      </aside>

      {/* Row 2: 60/40 split */}
      <aside className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 w-full h-96 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-black mb-4">
            Portfolio Performance
          </h2>
          <Line
            data={portfolioPerformanceData}
            width={600}
            height={400}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: false, ticks: { color: "black" } },
                x: { ticks: { color: "black" } },
              },
            }}
          />
        </section>
        <section className="w-full h-96 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold mb-4">Top Holdings</h2>
          <TopHoldings />
        </section>
      </aside>

      {/* Row 3: Donut & Pie Charts */}
      <aside className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="relative w-full h-96 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2 text-black">
            Asset Allocation
          </h2>
          <Doughnut
            data={assetAllocationData}
            options={{ plugins: { legend: { display: false } } }}
            width={400}
            height={400}
          />
          {renderLegend(
            assetAllocationData.labels,
            assetAllocationData.datasets[0].backgroundColor
          )}
        </section>
        <section className="relative w-full h-96 bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2 text-black">Sector Breakdown</h2>
          <Pie
            data={sectorBreakdownData}
            options={{ plugins: { legend: { display: false } } }}
            width={400}
            height={400}
          />
          {renderLegend(
            sectorBreakdownData.labels,
            sectorBreakdownData.datasets[0].backgroundColor
          )}
        </section>
      </aside>
    </section>
  );
};

export default DashboardLayout;
