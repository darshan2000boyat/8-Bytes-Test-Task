"use client";
import { sampleData } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type PortfolioHolding = {
  id: number;
  particulars: string;
  purchasePrice: number;
  qty: number;
  investment: number;
  portfolioPct: number;
  exchange: string;
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | string;
  latestEarnings: string;
};

const PortfolioTable = () => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] =
    useState<keyof PortfolioHolding>("particulars");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchYahooData = async (symbol: string) => {
    try {
      const formattedSymbol =
        symbol.endsWith(".NS") || symbol.endsWith(".BO")
          ? symbol
          : `${symbol}.NS`;
      const response = await fetch(
        `/api/yahoo-finance?symbol=${formattedSymbol}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          toast.error(`Yahoo Finance: No data found for ${symbol}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Yahoo Finance data:", error);
      return null;
    }
  };

  const fetchGoogleData = async (symbol: string) => {
    try {
      const response = await fetch(`/api/google-finance?symbol=${symbol}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error(`Google Finance: No data found for ${symbol}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Google Finance data:", error);
      return null;
    }
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedHoldings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedHoldings.length / itemsPerPage);

  const updateMarketData = useCallback(async () => {
    setLoading(true);

    const updatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        try {
          const yahooData = await fetchYahooData(holding.exchange);
          const cmp = yahooData?.price || holding.cmp;

          const googleData = await fetchGoogleData(holding.exchange);
          const peRatio = googleData?.peRatio || holding.peRatio;
          const latestEarnings =
            googleData?.latestEarnings || holding.latestEarnings;

          const presentValue = cmp * holding.qty;
          const gainLoss = presentValue - holding.investment;

          return {
            ...holding,
            cmp,
            presentValue,
            gainLoss,
            peRatio,
            latestEarnings,
          };
        } catch (error) {
          console.error(
            `Error updating data for ${holding.particulars}:`,
            error
          );
          return holding;
        }
      })
    );

    setHoldings(updatedHoldings);
    setLastUpdated(new Date());
    setLoading(false);
  }, [holdings]);

  useEffect(() => {
    const initializeData = async () => {
      setHoldings(sampleData);
      setLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (holdings.length > 0) {
      setInterval(() => {
        updateMarketData();
      }, 60 * 1000);
    }
  }, [sampleData.length, holdings.length]);

  const handleSort = (field: keyof PortfolioHolding) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totals = {
    investment: holdings.reduce((sum, h) => sum + h.investment, 0),
    presentValue: holdings.reduce((sum, h) => sum + h.presentValue, 0),
    gainLoss: holdings.reduce((sum, h) => sum + h.gainLoss, 0),
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading && holdings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-6 w-full bg-white rounded-lg shadow-md overflow-hidden pt-24">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Portfolio Holdings
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <label
                htmlFor="itemsPerPage"
                className="mr-2 text-sm text-gray-700"
              >
                Show:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 text-black rounded-md px-2 py-1 text-sm"
              >
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              {/* <button
                onClick={updateMarketData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Refresh Data
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "particulars",
                "purchasePrice",
                "qty",
                "investment",
                "portfolioPct",
                "exchange",
                "cmp",
                "presentValue",
                "gainLoss",
                "peRatio",
                "latestEarnings",
              ].map((field) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(field as keyof PortfolioHolding)}
                >
                  {field === "cmp"
                    ? "CMP"
                    : field === "qty"
                    ? "Qty"
                    : field === "portfolioPct"
                    ? "Portfolio (%)"
                    : field === "peRatio"
                    ? "P/E Ratio"
                    : field === "latestEarnings"
                    ? "Latest Earnings"
                    : field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                  {sortField === field && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((holding) => (
              <tr key={holding.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {holding.particulars}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(holding.purchasePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {holding.qty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(holding.investment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {holding.portfolioPct}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {holding.exchange}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(holding.cmp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(holding.presentValue)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    holding.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {holding.gainLoss >= 0 ? "▲" : "▼"}{" "}
                  {formatCurrency(Math.abs(holding.gainLoss))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof holding.peRatio === "number"
                    ? holding.peRatio.toFixed(2)
                    : holding.peRatio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {holding.latestEarnings}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totals.investment)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                100%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(totals.presentValue)}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  totals.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totals.gainLoss >= 0 ? "▲" : "▼"}{" "}
                {formatCurrency(Math.abs(totals.gainLoss))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
        <div className="flex-1 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, sortedHoldings.length)}
              </span>{" "}
              of <span className="font-medium">{sortedHoldings.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PortfolioTable;
