"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { RebalanceResult } from "@/app/page"

interface RebalanceResultsProps {
  results: RebalanceResult[]
}

export function RebalanceResults({ results }: RebalanceResultsProps) {
  const sortedResults = [...results].sort((a, b) => b.dollarsToAdd - a.dollarsToAdd)
  const totalDollars = results.reduce((sum, result) => sum + Math.abs(result.dollarsToAdd), 0)
  const buyOrders = results.filter((r) => r.dollarsToAdd > 0)
  const sellOrders = results.filter((r) => r.dollarsToAdd < 0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-emerald-900">Buy Orders</span>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{buyOrders.length}</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">Sell Orders</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{sellOrders.length}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-900">Total Activity</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">${totalDollars.toLocaleString()}</p>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-3">
        {sortedResults.map((result, index) => {
          const isPositive = result.dollarsToAdd >= 0
          const percentage = (Math.abs(result.dollarsToAdd) / totalDollars) * 100

          return (
            <Card key={index} className={`border-l-4 ${isPositive ? "border-l-emerald-500" : "border-l-red-500"}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900">{result.fund}</h4>
                    <p className="text-slate-600 text-sm">Target: {(result.targetAllocation * 100).toFixed(1)}%</p>
                  </div>
                  <Badge variant={isPositive ? "default" : "destructive"} className="text-sm">
                    {isPositive ? "BUY" : "SELL"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-slate-600 text-sm">Amount</p>
                    <p className="text-2xl font-bold">${Math.abs(result.dollarsToAdd).toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-slate-600 text-sm">% of Total Investment</p>
                    <p className="text-xl font-semibold">{percentage.toFixed(1)}%</p>
                  </div>

                  <div>
                    <p className="text-slate-600 text-sm">Allocation Difference</p>
                    <p className={`text-xl font-semibold ${result.difference > 0 ? "text-red-600" : "text-green-600"}`}>
                      {result.difference > 0 ? "+" : ""}
                      {(result.difference * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Investment Priority</span>
                    <span>{percentage.toFixed(1)}% of total</span>
                  </div>
                  <Progress value={percentage} className={`h-2 ${isPositive ? "bg-emerald-100" : "bg-red-100"}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-900">Total Investment Required:</span>
          <span className="text-xl font-bold text-slate-900">${totalDollars.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
