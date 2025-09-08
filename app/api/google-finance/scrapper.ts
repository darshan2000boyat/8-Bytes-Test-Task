import { unstable_cache } from "next/cache";
import { Browser, Page } from "puppeteer";

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

const TTL = 900;

export const scrapeStockData = unstable_cache(
  async (
    browser: Browser,
    symbol: string,
    exchange: string
  ): Promise<ScrapingResult> => {
    let page: Page | null = null;

    try {
      page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      await page.setViewport({ width: 1366, height: 768 });

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (["image", "stylesheet", "font"].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });

      const url = `https://www.google.com/finance/quote/${symbol.toUpperCase()}:${exchange}`;
      console.log(`Scraping URL: ${url}`);

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      await new Promise((res) => setTimeout(res, 3000));

      const pageTitle = await page.title();
      const currentUrl = page.url();

      console.log(`Page title: ${pageTitle}`);
      console.log(`Current URL: ${currentUrl}`);

      if (
        currentUrl === "https://www.google.com/finance/" ||
        (pageTitle.includes("Google Finance") &&
          !pageTitle.includes(symbol.toUpperCase()))
      ) {
        return {
          success: false,
          error: `Stock ${symbol} not found on ${exchange}`,
        };
      }

      const hasError = await page.evaluate(() => {
        const bodyText = document.body.innerText.toLowerCase();
        return (
          bodyText.includes("quote not found") ||
          bodyText.includes("not found") ||
          bodyText.includes("no results") ||
          bodyText.includes("error")
        );
      });

      if (hasError) {
        return {
          success: false,
          error: `Stock ${symbol} not found on ${exchange}`,
        };
      }

      const stockData = await page.evaluate(
        (symbol, exchange) => {
          const data: Partial<StockData> = {
            symbol: symbol.toUpperCase(),
            exchange: exchange,
          };

          try {
            const statsSelectors = [
              ".gyFHrc",
              '[data-test-id="statistics"]',
              'div[class*="gyFHrc"]',
              ".mfs7Fc",
              '[role="table"]',
              "table",
            ];

            let statsSection = null;
            for (const selector of statsSelectors) {
              const section = document.querySelector(selector);
              if (section) {
                statsSection = section;
                break;
              }
            }

            if (!statsSection) {
              const allSections = document.querySelectorAll(
                "div, section, table"
              );
              for (const section of allSections) {
                const text = section.textContent?.toLowerCase() || "";
                if (
                  (text.includes("pe ratio") ||
                    text.includes("earnings") ||
                    text.includes("eps")) &&
                  section.children.length > 0
                ) {
                  statsSection = section;
                  break;
                }
              }
            }

            if (statsSection) {
              const rows = statsSection.querySelectorAll(
                'tr, div, .mfs7Fc, [class*="mfs7Fc"], [role="row"]'
              );

              rows.forEach((row) => {
                const text = row.textContent?.toLowerCase() || "";

                if (
                  (text.includes("pe ratio") ||
                    text.includes("p/e ratio") ||
                    text.includes("price/earnings")) &&
                  !data.peRatio
                ) {
                  const valueSelectors = [
                    ".P6K39c",
                    "span",
                    "div",
                    "td",
                    '[class*="P6K39c"]',
                  ];
                  for (const valSelector of valueSelectors) {
                    const valueElements = row.querySelectorAll(valSelector);
                    for (const valueElement of valueElements) {
                      const valueText = valueElement.textContent?.trim();
                      if (
                        valueText &&
                        valueText !== "—" &&
                        valueText !== "-" &&
                        /^[\d,.]+$/.test(valueText) &&
                        parseFloat(valueText.replace(/,/g, "")) > 0
                      ) {
                        data.peRatio = valueText;
                        break;
                      }
                    }
                    if (data.peRatio) break;
                  }
                }

                if (
                  (text.includes("earnings per share") ||
                    text.includes("eps") ||
                    text.includes("quarterly earnings") ||
                    text.includes("annual earnings") ||
                    text.includes("diluted eps") ||
                    text.includes("basic eps")) &&
                  !data.latestEarnings
                ) {
                  const valueSelectors = [
                    ".P6K39c",
                    "span",
                    "div",
                    "td",
                    '[class*="P6K39c"]',
                  ];
                  for (const valSelector of valueSelectors) {
                    const valueElements = row.querySelectorAll(valSelector);
                    for (const valueElement of valueElements) {
                      const valueText = valueElement.textContent?.trim();
                      if (
                        valueText &&
                        valueText !== "—" &&
                        valueText !== "-" &&
                        (valueText.includes("₹") || /^[\d,.]+$/.test(valueText))
                      ) {
                        data.latestEarnings = valueText;
                        break;
                      }
                    }
                    if (data.latestEarnings) break;
                  }
                }
              });
            }

            if (!data.peRatio || !data.latestEarnings) {
              const allText = document.body.innerText;
              const lines = allText.split("\n");

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].toLowerCase().trim();

                if (
                  (line.includes("pe ratio") ||
                    line.includes("p/e ratio") ||
                    line.includes("price/earnings")) &&
                  !data.peRatio
                ) {
                  const checkLines = [
                    lines[i],
                    lines[i + 1],
                    lines[i + 2],
                  ].filter(Boolean);
                  for (const checkLine of checkLines) {
                    const valueLine = checkLine.trim();
                    const match = valueLine.match(/[\d,.]+/);
                    if (
                      match &&
                      parseFloat(match[0].replace(/,/g, "")) > 0 &&
                      parseFloat(match[0].replace(/,/g, "")) < 1000
                    ) {
                      data.peRatio = match[0];
                      break;
                    }
                  }
                }

                if (
                  (line.includes("earnings per share") ||
                    line.includes("eps") ||
                    line.includes("quarterly earnings") ||
                    line.includes("diluted eps")) &&
                  !data.latestEarnings
                ) {
                  const checkLines = [
                    lines[i],
                    lines[i + 1],
                    lines[i + 2],
                  ].filter(Boolean);
                  for (const checkLine of checkLines) {
                    const valueLine = checkLine.trim();

                    if (
                      valueLine.includes("₹") ||
                      /^[\d,.]+$/.test(valueLine)
                    ) {
                      data.latestEarnings = valueLine;
                      break;
                    }
                  }
                }
              }
            }

            if (!data.latestEarnings) {
              const earningsPatterns = [
                /earnings.*?₹[\d,.]+/gi,
                /eps.*?₹[\d,.]+/gi,
                /₹[\d,.]+.*?eps/gi,
                /quarterly.*?₹[\d,.]+/gi,
              ];

              const fullText = document.body.innerText;
              for (const pattern of earningsPatterns) {
                const match = fullText.match(pattern);
                if (match && match[0]) {
                  const earningsMatch = match[0].match(/₹[\d,.]+/);
                  if (earningsMatch) {
                    data.latestEarnings = earningsMatch[0];
                    break;
                  }
                }
              }
            }

            if (!data.peRatio || !data.latestEarnings) {
              const tables = document.querySelectorAll(
                'table, [role="table"], .gyFHrc, .mfs7Fc'
              );
              for (const table of tables) {
                const tableText = table.textContent?.toLowerCase() || "";

                if (!data.peRatio && tableText.includes("pe")) {
                  const cells = table.querySelectorAll("td, th, div, span");
                  for (let i = 0; i < cells.length; i++) {
                    const cellText = cells[i].textContent?.toLowerCase().trim();
                    if (
                      cellText &&
                      (cellText.includes("pe") || cellText.includes("p/e"))
                    ) {
                      for (
                        let j = i + 1;
                        j < Math.min(i + 3, cells.length);
                        j++
                      ) {
                        const valueText = cells[j].textContent?.trim();
                        if (valueText && /^[\d,.]+$/.test(valueText)) {
                          data.peRatio = valueText;
                          break;
                        }
                      }
                      if (data.peRatio) break;
                    }
                  }
                }

                if (
                  !data.latestEarnings &&
                  (tableText.includes("eps") || tableText.includes("earnings"))
                ) {
                  const cells = table.querySelectorAll("td, th, div, span");
                  for (let i = 0; i < cells.length; i++) {
                    const cellText = cells[i].textContent?.toLowerCase().trim();
                    if (
                      cellText &&
                      (cellText.includes("eps") ||
                        cellText.includes("earnings"))
                    ) {
                      for (
                        let j = i + 1;
                        j < Math.min(i + 3, cells.length);
                        j++
                      ) {
                        const valueText = cells[j].textContent?.trim();
                        if (
                          valueText &&
                          (valueText.includes("₹") ||
                            /^[\d,.]+$/.test(valueText))
                        ) {
                          data.latestEarnings = valueText;
                          break;
                        }
                      }
                      if (data.latestEarnings) break;
                    }
                  }
                }
              }
            }

            return data;
          } catch (error) {
            console.error("Error extracting data:", error);
            return data;
          }
        },
        symbol,
        exchange
      );

      if (!stockData.peRatio && !stockData.latestEarnings) {
        return {
          success: false,
          error: `No PE ratio or earnings data found for ${symbol} on ${exchange}`,
        };
      }

      return {
        success: true,
        data: stockData as StockData,
      };
    } catch (error) {
      console.error(`Error scraping ${symbol} on ${exchange}:`, error);
      return {
        success: false,
        error: `Failed to scrape data for ${symbol} on ${exchange}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    } finally {
      if (page) {
        await page.close();
      }
    }
  },
  ["google-stock-data"],
  { revalidate: TTL }
);
