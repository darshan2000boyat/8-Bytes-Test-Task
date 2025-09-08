import axios from "axios";
import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const TTL = 900;

interface ApiResponse {
  price: number;
  error?: string;
}

const YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart/";

const fetchYahooFinance = unstable_cache(
  async (symbol: string) => {
    try {
      const response = await axios.get(`${YAHOO_FINANCE_API}${symbol}`);

      const data = response.data;

      return data;
    } catch (error) {}
  },
  ["yahoo-stock-data"],
  { revalidate: TTL }
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol || typeof symbol !== "string") {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  try {
    const formattedSymbol =
      symbol.endsWith(".NS") || symbol.endsWith(".BO")
        ? symbol
        : `${symbol}.NS`;

    const data = await fetchYahooFinance(formattedSymbol);

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return NextResponse.json(
        { error: "No data found for symbol" },
        { status: 404 }
      );
    }

    const result = data.chart.result[0];
    const price = result.meta.regularMarketPrice;

    if (!price) {
      return NextResponse.json(
        { error: "Price not available for symbol" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        price: price,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Yahoo Finance data:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            "Failed to fetch data from Yahoo Finance",
        },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }
  }
}
