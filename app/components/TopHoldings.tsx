import { useState } from "react";

type Holding = {
  name: string;
  value: number;
  change?: number;
  sector?: string;
  weight?: number;
};

type SortField = "name" | "value" | "change" | "weight";

const TopHoldings = () => {
  const [sortField, setSortField] = useState<SortField>("value");
  const [sortAsc, setSortAsc] = useState(false);

  const holdings: Holding[] = [
    {
      name: "HDFC Bank",
      value: 85000,
      change: 14.11,
      sector: "Financial",
      weight: 18.2,
    },
    {
      name: "Bajaj Finance",
      value: 126294,
      change: 30.21,
      sector: "Financial",
      weight: 27.0,
    },
    {
      name: "ICICI Bank",
      value: 102102,
      change: 55.83,
      sector: "Financial",
      weight: 21.8,
    },
    {
      name: "Polycab",
      value: 140000,
      change: 77.43,
      sector: "Pipe",
      weight: 29.9,
    },
    {
      name: "Tata Power",
      value: 78975,
      change: 56.7,
      sector: "Power",
      weight: 16.9,
    },
    {
      name: "Tata Consumer",
      value: 86499,
      change: 13.74,
      sector: "Consumer",
      weight: 18.5,
    },
  ];

  const sortedHoldings = [...holdings].sort((a, b) => {
    if (sortField === "name") {
      return sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    const aValue = a[sortField] || 0;
    const bValue = b[sortField] || 0;

    return sortAsc ? aValue - bValue : bValue - aValue;
  });

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortAsc ? "▲" : "▼";
  };

  return (
    <div className="relative w-full h-96 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Holdings</h2>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{holdings.length} holdings</span>
          <span className="font-medium">
            Total: ₹{totalValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        {(["name", "value", "change", "weight"] as SortField[]).map((field) => (
          <button
            key={field}
            className={`px-3 py-1 text-sm rounded-full ${
              sortField === field
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleSort(field)}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
            {getSortIndicator(field)}
          </button>
        ))}
      </div>

      {/* Holdings List */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(100% - 85px)" }}
      >
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-700">
                Holding
              </th>
              <th className="text-right py-2 px-2 font-medium text-gray-700">
                Value (₹)
              </th>
              <th className="text-right py-2 px-2 font-medium text-gray-700">
                Weight
              </th>
              <th className="text-right py-2 px-2 font-medium text-gray-700">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHoldings.map((holding, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{holding.name}</span>
                    <span className="text-xs text-gray-500">
                      {holding.sector}
                    </span>
                  </div>
                </td>
                <td className="text-right py-3 px-2 font-medium">
                  ₹{holding.value.toLocaleString()}
                </td>
                <td className="text-right py-3 px-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                    {holding.weight}%
                  </span>
                </td>
                <td className="text-right py-3 px-2">
                  <span
                    className={`font-medium ${
                      (holding.change || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(holding.change || 0) >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(holding.change || 0).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopHoldings;
