"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import TopHoldings from "./TopHoldings";

type SectorData = {
  name: string;
  value: number;
  color: string;
};

const DashboardLayout = () => {
  const assetAllocationData = [
    { name: "Stocks", value: 50, color: "#6366F1" },
    { name: "Bonds", value: 20, color: "#F472B6" },
    { name: "Cash", value: 20, color: "#34D399" },
    { name: "Crypto", value: 10, color: "#FBBF24" },
  ];

  const sectorBreakdownData: SectorData[] = [
    { name: "Financial", value: 25.3, color: "#3B82F6" },
    { name: "Tech", value: 23.0, color: "#EF4444" },
    { name: "Consumer", value: 17.9, color: "#34D399" },
    { name: "Power", value: 10.8, color: "#F59E0B" },
    { name: "Pipe", value: 13.5, color: "#8B5CF6" },
    { name: "Others", value: 9.5, color: "#6B7280" },
  ];

  // Performance by sector data
  const sectorPerformanceData = [
    { sector: "Financial", gainLoss: 16.5, isPositive: true },
    { sector: "Tech", gainLoss: -5.2, isPositive: false },
    { sector: "Consumer", gainLoss: 6.7, isPositive: true },
    { sector: "Power", gainLoss: -12.3, isPositive: false },
    { sector: "Pipe", gainLoss: 18.9, isPositive: true },
    { sector: "Others", gainLoss: -3.4, isPositive: false },
  ];
  const portfolioPerformanceData = [
    { month: "Jan", value: 10000 },
    { month: "Feb", value: 10500 },
    { month: "Mar", value: 10200 },
    { month: "Apr", value: 10800 },
    { month: "May", value: 11200 },
    { month: "Jun", value: 11000 },
    { month: "Jul", value: 11500 },
  ];

  const row1Data = [
    { id: "PORT", title: "Portfolio Value", value: "$25,000", change: 500 },
    { id: "DAILY", title: "Daily Change", value: "$1,200", change: -150 },
    { id: "MONTH", title: "Monthly Return", value: "$3,400", change: 200 },
    { id: "YTD", title: "YTD Return", value: "$8,900", change: 800 },
  ];

  const renderLegend = (data: { name: string; color: string }[]) => (
    <div className="w-[30%]">
      <ul className="flex flex-col gap-2 mt-4">
        {data.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-black font-medium">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="w-full lg:w-[80%]  overflow-y-scroll bg-white text-black grid grid-cols-1 gap-6 pt-24 pb-12 px-4">
      <aside className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {row1Data.map((card, idx) => (
          <section
            key={idx}
            className="relative w-full h-48 bg-white shadow-lg rounded-lg p-4 flex flex-col justify-center items-center"
          >
            {card?.id === "PORT" && (
              <Link href={"/portfolio"}>
                <FaExternalLinkAlt
                  title="View Portfolio"
                  className="absolute right-4 top-4 hover:text-blue-500 cursor-pointer"
                />
              </Link>
            )}
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

      <aside className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="w-full h-96 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-black mb-4">
            Portfolio Performance
          </h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={portfolioPerformanceData}>
              <XAxis dataKey="month" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                strokeWidth={3}
                dot={true}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <TopHoldings />
      </aside>

      <aside className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="relative w-full bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2 text-black">
            Asset Allocation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 justify-between items-center">
            <div className="w-full h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetAllocationData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center sm:justify-start">
              {renderLegend(assetAllocationData)}
            </div>
          </div>
        </section>
        <section className="relative w-full bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2 text-black">
            Sector Breakdown
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 justify-between items-center">
            <div className="w-full h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {sectorBreakdownData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center sm:justify-start">
              {renderLegend(sectorBreakdownData)}
            </div>
          </div>
        </section>
      </aside>
    </section>
  );
};

export default DashboardLayout;
