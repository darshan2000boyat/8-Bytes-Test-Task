import React from "react";
import PortfolioTable from "../components/PortfolioTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Portfolio | Stocks & Investments",
  description:
    "Explore your stock holdings, gain/loss performance, and valuation breakdowns powered by Yahoo Finance and Google Finance APIs.",
  keywords: [
    "portfolio",
    "stock analysis",
    "investment tracker",
    "equity portfolio",
    "financial insights",
  ],
  openGraph: {
    title: "My Investment Portfolio",
    description:
      "Detailed portfolio view with live stock updates, valuations, and performance charts.",
    url: "https://8-bytes-test-task.vercel.app/portfolio",
    siteName: "My Portfolio Dashboard",
    images: [
      {
        url: "https://8-bytes-test-task.vercel.app/og-image-portfolio.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Page Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const Portfolio = () => {
  return <PortfolioTable />;
};

export default Portfolio;
