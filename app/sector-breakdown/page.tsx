import { Metadata } from "next";
import SectorBreakdownContent from "../components/SectorBreakdownContent";

export const metadata: Metadata = {
  title: "Sector Breakdown | Portfolio Diversification",
  description:
    "Analyze sector allocation of your investments. See how your portfolio is diversified across industries and sectors.",
  keywords: [
    "sector analysis",
    "portfolio breakdown",
    "investment diversification",
    "sector allocation",
    "financial sectors",
  ],
  openGraph: {
    title: "Sector Breakdown",
    description:
      "Visualize your portfolio allocation across sectors like Technology, Finance, Healthcare, and more.",
    url: "https://8-bytes-test-task.vercel.app/sector-breakdown",
    siteName: "My Portfolio Dashboard",
    images: [
      {
        url: "https://8-bytes-test-task.vercel.app/og-image-sectors.png",
        width: 1200,
        height: 630,
        alt: "Sector Breakdown Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const SectorBreakdown = () => {
  return (<SectorBreakdownContent />)
};

export default SectorBreakdown;
