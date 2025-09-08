import React from "react";
import Sidebar from "./components/Sidebar";
import DashboardLayout from "./components/DashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Portfolio Dashboard | Personal Finance Tracker",
  description:
    "Track your investments, stocks, and financial growth in one place. Get live data from Google Finance and Yahoo Finance.",
  keywords: [
    "portfolio tracker",
    "stock dashboard",
    "personal finance",
    "investment portfolio",
    "financial dashboard",
  ],
  openGraph: {
    title: "My Portfolio Dashboard",
    description:
      "A personal finance dashboard to monitor your investments and stock performance.",
    url: "https://yourdomain.com",
    siteName: "My Portfolio Dashboard",
    images: [
      {
        url: "https://8-bytes-test-task.vercel.app/og-image-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Sidebar />
      <DashboardLayout />
    </>
  );
}
