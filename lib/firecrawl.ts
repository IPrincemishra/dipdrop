import Firecrawl from "@mendable/firecrawl-js";

interface ScrapedProduct {
    productName: string;
    currentPrice: string;
    currencyCode?: string;
    productImageUrl?: string;
}

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! })

export async function scrapeProduct(url: string) {
    try {
        const result = await firecrawl.scrape(url, {
            formats: [
                {
                    type: 'json',
                    schema: {
                        type: "object",
                        required: ["productName", "currentPrice"],
                        properties: {
                            productName: { type: "string" },
                            currentPrice: { type: "number" },
                            currencyCode: { type: "string" },
                            productImageUrl: { type: "string" }
                        }
                    },
                    prompt: "Extract product name and price..."
                }
            ]
        })

        const extractedData = result.json as ScrapedProduct | null;

        if (!extractedData || !extractedData.productName) {
            throw new Error("No data extracted from URL")
        }

        return extractedData;

    } catch (error) {
        console.error("Scraping failed:", error);
        return null;
    }
}