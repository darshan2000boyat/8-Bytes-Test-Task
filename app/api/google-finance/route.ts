import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";
import { scrapeStockData } from "./scrapper";


interface StockData {
  symbol: string;
  exchange: string;
  peRatio: string | null;
  latestEarnings: string | null;
}

interface ScrapingResult {
  success: boolean;
  data?: StockData;
  error?: string;
}

export async function GET(
  request: NextRequest
) {
  const { searchParams } = new URL(request.url);
  const unformatedSymbol = searchParams.get("symbol");
  const symbol = unformatedSymbol?.endsWith(".BO")
    ? unformatedSymbol.replace(".BO", "")
    : unformatedSymbol;

  if (!symbol) {
    return NextResponse.json(
      { error: "Stock symbol is required" },
      { status: 400 }
    );
  }

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });

    const exchanges = ["NSE", "BOM"];
    let result: ScrapingResult | null = null;

    for (const exchange of exchanges) {
      console.log(`Trying ${exchange} for symbol: ${symbol}`);
      result = await scrapeStockData(browser, symbol, exchange);

      if (result.success && result.data) {
        break;
      }
    }

    if (!result?.success || !result.data) {
      return NextResponse.json(
        {
          error: "Stock not found in both NSE and BSE exchanges",
          symbol: symbol.toUpperCase(),
          searchedExchanges: exchanges,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error while fetching stock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
