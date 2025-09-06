import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// Define response type from our API
interface ApiResponse {
  price: number;
  error?: string;
}

// Alternative Yahoo Finance API endpoint
const YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart/";

export async function GET(
  req: NextRequest
) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  // Validate the symbol parameter
  if (!symbol || typeof symbol !== "string") {
    return NextResponse.json({ error: "Symbol parameter is required" }, { status: 400 });
  }

  try {
    // Add .NS suffix for Indian stocks (NSE)
    const formattedSymbol = symbol.endsWith(".NS") ? symbol : `${symbol}.NS`;

    // Make request to Yahoo Finance API
    const response = await axios.get(`${YAHOO_FINANCE_API}${formattedSymbol}`);

    // Extract the data from the response
    const data = response.data;

    // Check if we have valid data
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return NextResponse.json({ error: "No data found for symbol" }, { status: 404 });
    }

    const result = data.chart.result[0];
    const price = result.meta.regularMarketPrice;

    if (!price) {
      return NextResponse.json({ error: "Price not available for symbol" }, { status: 404 });
    }

    return NextResponse.json({
      price: price,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Yahoo Finance data:", error);

    // Type guard to check if error is an AxiosError
    if (axios.isAxiosError(error)) {
      return NextResponse.json({
        error:
          error.response?.data?.message ||
          "Failed to fetch data from Yahoo Finance",
      }, { status: error.response?.status || 500 });
    } else {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
  }
}
