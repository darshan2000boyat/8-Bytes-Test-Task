import { NextRequest, NextResponse } from "next/server";
import puppeteer from 'puppeteer';

// Mock data for fallback
const mockData: Record<string, { price: number; peRatio: number; latestEarnings: string }> = {
  "HDFCBANK.BO": { price: 1700.15, peRatio: 18.69, latestEarnings: "Q1 2025" },
  "BAJFINANCE.BO": { price: 8419.6, peRatio: 32.63, latestEarnings: "Q1 2025" },
  "ICICIBANK.BO": { price: 1215.5, peRatio: 17.68, latestEarnings: "Q1 2025" },
  "AFFLE.BO": { price: 1459.6, peRatio: 55.53, latestEarnings: "Q1 2025" },
  "TATAPOWER.BO": { price: 351, peRatio: 29.36, latestEarnings: "Q1 2025" },
  "SBILIFE.BO": { price: 1405.45, peRatio: 0, latestEarnings: "Q1 2025" },
};

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Request queue for throttling
let requestQueue: Array<{ symbol: string; resolve: Function; reject: Function }> = [];
let isProcessing = false;

// Process requests with a delay
const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  
  while (requestQueue.length > 0) {
    const { symbol, resolve, reject } = requestQueue.shift()!;
    
    try {
      const data = await scrapeGoogleFinance(symbol);
      resolve(data);
    } catch (error) {
      reject(error);
    }
    
    // Add delay between requests to avoid being blocked
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds between requests
  }
  
  isProcessing = false;
};

// Scrape Google Finance for stock data
const scrapeGoogleFinance = async (symbol: string) => {
  const cacheKey = `google-${symbol}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  let browser;
  try {
    // Launch Puppeteer with appropriate options
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      headless: true,
      timeout: 15000
    });

    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to Google Finance
    const googleSymbol = symbol.replace('.BO', ':BOM').replace('.NS', ':NSE');
    const url = `https://www.google.com/finance/quote/${googleSymbol}`;
    
    console.log(`Scraping Google Finance for ${symbol} at ${url}`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });
    
    // Wait for the price element to load
    await page.waitForSelector('[jsname="vWLAgc"]', { timeout: 10000 });
    
    // Extract price
    const priceText = await page.$eval('[jsname="vWLAgc"]', el => el.textContent);
    const price = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
    
    if (price === 0) {
      throw new Error('Could not extract price from Google Finance');
    }
    
    // Try to extract P/E ratio
    let peRatio = 0;
    try {
      // Look for the P/E ratio in the key metrics section
      await page.waitForSelector('.gyFHrc', { timeout: 5000 });
      const keyMetrics = await page.$$eval('.gyFHrc', elements => {
        return elements.map(el => el.textContent);
      });
      
      // Find the P/E ratio element
      for (const metric of keyMetrics) {
        if (metric && metric.includes('P/E ratio')) {
          const peMatch = metric.match(/\d+\.\d+/);
          if (peMatch) {
            peRatio = parseFloat(peMatch[0]);
            break;
          }
        }
      }
    } catch (error) {
      console.log('Could not extract P/E ratio from Google Finance:', error.message);
    }
    
    // Try to extract earnings date
    let latestEarnings = "N/A";
    try {
      // Look for earnings date in the key metrics section
      await page.waitForSelector('.gyFHrc', { timeout: 5000 });
      const keyMetrics = await page.$$eval('.gyFHrc', elements => {
        return elements.map(el => el.textContent);
      });
      
      // Find the earnings date element
      for (const metric of keyMetrics) {
        if (metric && (metric.includes('Earnings date') || metric.includes('Latest earnings'))) {
          latestEarnings = metric.replace('Earnings date', '').replace('Latest earnings', '').trim();
          break;
        }
      }
    } catch (error) {
      console.log('Could not extract earnings date from Google Finance:', error.message);
    }

    const result = {
      price,
      peRatio: peRatio || mockData[symbol]?.peRatio || 0,
      latestEarnings: latestEarnings !== "N/A" ? latestEarnings : (mockData[symbol]?.latestEarnings || "N/A")
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Error scraping Google Finance:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export async function GET(request: NextRequest) {
  // Get the search params from the URL
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  // Validate the symbol parameter
  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  // For Indian stocks, use .BO suffix for BSE
  const formattedSymbol = symbol.endsWith(".BO") ? symbol : `${symbol}.BO`;

  // Check if we have mock data for this symbol
  if (mockData[formattedSymbol]) {
    return NextResponse.json(mockData[formattedSymbol]);
  }

  // Queue the request for throttling
  try {
    const result = await new Promise((resolve, reject) => {
      requestQueue.push({ symbol: formattedSymbol, resolve, reject });
      processQueue();
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    
    // Fall back to mock data if available
    if (mockData[formattedSymbol]) {
      return NextResponse.json(mockData[formattedSymbol]);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch data and no mock data available" },
      { status: 500 }
    );
  }
}