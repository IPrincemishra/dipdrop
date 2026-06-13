import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "Price check endpoint is working. Use PORT to trigger."
    })
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization')
        const cronSecret = process.env.CRON_SECRET!;

        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        )

        const { data: products, error: productError } = await supabase
            .from("products")
            .select("*")

        if (productError) throw productError

        console.log(`Found ${products.length} products to check`);

        const results = {
            total: products.length,
            updated: 0,
            failed: 0,
            priceChanges: 0,
            alertsSent: 0
        }

        for (const product of products) {
            try {
                const productData = await scrapeProduct(product.url)

                if (!productData?.currentPrice) {
                    results.failed++;
                    continue
                }

                const newPrice = parseFloat(productData.currentPrice)
                const oldPrice = parseFloat(product.current_price)

                await supabase.from("products").update({
                    current_price: newPrice,
                    currency: productData.currencyCode || product.currency,
                    name: productData.productName || product.name,
                    image_url: productData.productImageUrl || product.image_url,
                    updated_at: new Date().toISOString()
                })
                    .eq("id", product.id)

                if (oldPrice !== newPrice) {
                    await supabase.from("price_history").insert({
                        product_id: product.id,
                        price: newPrice,
                        currency: productData.currencyCode || product.currency
                    })

                    results.priceChanges++
                }


                results.updated++

            } catch (error) {
                console.error(`Error processing product ${product.id}: ${error}`);
                results.failed++;
            }
        }

        return NextResponse.json({
            success: true,
            message: "Price check completed",
            results
        })
    } catch (error: any) {
        console.error(`Cron job error: ${error}`);
        return NextResponse.json({
            success: false,
            message: error.message,
        }, {
            status: 500
        })
    }
}