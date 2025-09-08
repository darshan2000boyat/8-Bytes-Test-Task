"use client"
import { sampleData } from "@/lib/data";
import React, { useMemo, useState } from "react";

interface SectorData {
  name: string;
  value: number;
  color: string;
  holdings: number;
}

const sectorColors: Record<string, string> = {
  Financial: "#3B82F6",
  Technology: "#EF4444",
  Energy: "#F59E0B",
  Consumer: "#10B981",
  Industrial: "#8B5CF6",
  Healthcare: "#EC4899",
  Utilities: "#6366F1",
  Other: "#6B7280",
};

const SectorBreakdownContent = () => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const sectorBreakdown = useMemo((): SectorData[] => {
    const sectorMap: Record<string, { value: number; holdings: number }> = {};

    sampleData.forEach((holding) => {
      const sector = holding.sector;
      if (!sectorMap[sector]) {
        sectorMap[sector] = { value: 0, holdings: 0 };
      }
      sectorMap[sector].value += holding.presentValue;
      sectorMap[sector].holdings += 1;
    });

    const totalValue = sampleData.reduce(
      (sum, holding) => sum + holding.presentValue,
      0
    );

    return Object.entries(sectorMap).map(([name, data]) => ({
      name,
      value: parseFloat(((data.value / totalValue) * 100).toFixed(2)),
      color: sectorColors[name] || sectorColors["Other"],
      holdings: data.holdings,
    }));
  }, []);

  const sectorHoldings = useMemo(() => {
    if (!selectedSector) return [];
    return sampleData.filter((holding) => holding.sector === selectedSector);
  }, [selectedSector]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-blue-50 text-black p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Portfolio Sector Breakdown
          </h1>
          <p className="text-gray-600 mb-6">
            Analysis of your investments across different sectors
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800">Total Value</h3>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(
                  sampleData.reduce(
                    (sum, holding) => sum + holding.presentValue,
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-sm font-medium text-green-800">
                Number of Holdings
              </h3>
              <p className="text-2xl font-bold text-green-900">
                {sampleData.length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-sm font-medium text-purple-800">Sectors</h3>
              <p className="text-2xl font-bold text-purple-900">
                {sectorBreakdown.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Sector Allocation
              </h2>

              <div className="relative flex items-center justify-center mb-6">
                <div className="relative w-56 h-56">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                  {sectorBreakdown.map((sector, i, array) => {
                    const offset = array
                      .slice(0, i)
                      .reduce((sum, s) => sum + (s.value / 100) * 360, 0);
                    return (
                      <div
                        key={sector.name}
                        className="absolute inset-0"
                        style={{
                          clipPath: `conic-gradient(from ${offset}deg, ${
                            sector.color
                          } 0 ${sector.value * 3.6}deg, transparent ${
                            sector.value * 3.6
                          }deg)`,
                        }}
                      ></div>
                    );
                  })}
                  <div className="absolute inset-8 bg-white rounded-full"></div>
                </div>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">
                    {sectorBreakdown.length}
                  </span>
                  <span className="text-sm text-gray-500">Sectors</span>
                </div>
              </div>

              <div className="space-y-3">
                {sectorBreakdown.map((sector) => (
                  <div
                    key={sector.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSector === sector.name
                        ? "bg-blue-100"
                        : "bg-white hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      setSelectedSector(
                        selectedSector === sector.name ? null : sector.name
                      )
                    }
                  >
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: sector.color }}
                      ></div>
                      <span className="font-medium">{sector.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{sector.value}%</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({sector.holdings} holdings)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedSector
                  ? `${selectedSector} Holdings`
                  : "Select a Sector"}
              </h2>

              {selectedSector ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Holding
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gain/Loss
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sectorHoldings.map((holding) => (
                        <tr key={holding.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {holding.particulars}
                              </span>
                              <span className="text-sm text-gray-500">
                                {holding.exchange}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {formatCurrency(holding.presentValue)}
                          </td>
                          <td
                            className={`px-4 py-4 whitespace-nowrap font-medium ${
                              holding.gainLoss >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {holding.gainLoss >= 0 ? "▲" : "▼"}{" "}
                            {formatCurrency(Math.abs(holding.gainLoss))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-4 py-4 font-medium">Total</td>
                        <td className="px-4 py-4 font-medium">
                          {formatCurrency(
                            sectorHoldings.reduce(
                              (sum, holding) => sum + holding.presentValue,
                              0
                            )
                          )}
                        </td>
                        <td
                          className={`px-4 py-4 font-medium ${
                            sectorHoldings.reduce(
                              (sum, holding) => sum + holding.gainLoss,
                              0
                            ) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {sectorHoldings.reduce(
                            (sum, holding) => sum + holding.gainLoss,
                            0
                          ) >= 0
                            ? "▲"
                            : "▼"}{" "}
                          {formatCurrency(
                            Math.abs(
                              sectorHoldings.reduce(
                                (sum, holding) => sum + holding.gainLoss,
                                0
                              )
                            )
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>Select a sector to view its holdings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Performance by Sector
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorBreakdown.map((sector) => {
              const sectorData = sampleData.filter(
                (h) => h.sector === sector.name
              );
              const totalGainLoss = sectorData.reduce(
                (sum, h) => sum + h.gainLoss,
                0
              );
              const totalInvestment = sectorData.reduce(
                (sum, h) => sum + h.investment,
                0
              );
              const gainLossPct =
                totalInvestment > 0
                  ? (totalGainLoss / totalInvestment) * 100
                  : 0;

              return (
                <div
                  key={sector.name}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center mb-3">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: sector.color }}
                    ></div>
                    <h3 className="font-medium">{sector.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allocation:</span>
                      <span className="font-medium">{sector.value}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Holdings:</span>
                      <span className="font-medium">{sector.holdings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          sectorData.reduce((sum, h) => sum + h.presentValue, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Performance:</span>
                      <span
                        className={`font-medium ${
                          gainLossPct >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {gainLossPct >= 0 ? "▲" : "▼"}{" "}
                        {Math.abs(gainLossPct).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorBreakdownContent;
