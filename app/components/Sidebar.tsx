"use client";

import React from "react";

const Sidebar = () => {
  // Dummy data
  const watchlist = [
    { symbol: "AAPL", name: "Apple Inc.", price: 192.32, change: "+1.24%" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 742.18, change: "-0.82%" }
  ];

  const news = [
    {
      title: "Markets rally as tech stocks surge",
      time: "2h ago",
    },
    {
      title: "Tesla shares dip amid supply chain concerns",
      time: "8h ago",
    },
  ];

  return (
    <aside className="hidden lg:fixed top-0 right-0 z-10 h-full w-72 bg-white text-black shadow-lg lg:flex flex-col p-4">
      <nav className="flex-1 pt-20 space-y-4">
        {/* Quick Actions */}
        <div className="card w-full shadow-sm">
          <div className="card-body">
            <h2 className="text-xl font-bold text-center">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <button className="btn btn-primary btn-block">Buy Assets</button>
              <button className="btn btn-outline btn-block">Sell Assets</button>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="card w-full shadow-sm">
          <div className="card-body">
            <h2 className="text-xl font-bold">Watchlist</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {watchlist.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-semibold">{item.symbol}</p>
                    <p className="text-xs text-gray-500">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price}</p>
                    <p
                      className={`text-xs ${
                        item.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.change}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Market News */}
        <div className="card w-full shadow-sm">
          <div className="card-body">
            <h2 className="text-xl font-bold">Market News</h2>
            <ul className="mt-4 space-y-4 text-sm">
              {news.map((article, idx) => (
                <li key={idx} className="border-b pb-2 last:border-0">
                  <p className="font-medium">{article.title}</p>
                  <span className="text-xs text-gray-500">{article.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
