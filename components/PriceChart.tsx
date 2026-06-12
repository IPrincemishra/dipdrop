'use client'

import { getPriceHistory } from "@/app/action"
import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface PriceDataPoint {
    date: string;
    price: number;
}

export default function PriceChart({ productId }: { productId: string }) {
    const [data, setData] = useState<PriceDataPoint[]>([])
    const [currency, setCurrency] = useState<string>("₹")
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const history = await getPriceHistory(productId)

                if (history && Array.isArray(history) && history.length > 0) {
                    const currencySymbol = history[0]?.currency_code === "USD" ? "$" : "₹";
                    setCurrency(currencySymbol);

                    const chartData = history.map((item: any) => ({
                        date: new Date(item.checked_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                        }),
                        price: parseFloat(item.price)
                    }))

                    setData(chartData)
                }
            } catch (error) {
                console.error("Error loading price history chart:", error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [productId])

    if (loading) {
        return (
            <div className="w-full h-87.5 bg-gray-50/50 border border-gray-200 rounded-xl flex items-center justify-center animate-pulse text-gray-400 font-medium">
                Loading price history data... 📈
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="w-full h-87.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-medium">
                No price history records found yet. 📉
            </div>
        )
    }

    return (
        <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Price History Analytics</h3>
            <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 10, bottom: 5, left: -20 }}
                    >
                        <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${currency}${value.toLocaleString()}`}
                        />

                        <Tooltip
                            contentStyle={{ background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                            formatter={(value: any) => [`${currency}${Number(value).toLocaleString()}`, "Price"]}
                        />

                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#ff5622"
                            strokeWidth={3}
                            dot={{ r: 4, stroke: "#ff5622", strokeWidth: 2, fill: "#fff" }}
                            activeDot={{ r: 6, fill: "#ff5622" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}