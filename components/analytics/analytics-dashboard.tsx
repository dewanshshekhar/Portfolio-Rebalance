"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, PieChart } from "lucide-react"
import type { PortfolioItem, RebalanceResult } from "@/app/page"

interface AnalyticsDashboardProps {
  portfolio: PortfolioItem[]
  rebalanceResults: RebalanceResult[]
}

export function AnalyticsDashboard({ portfolio, rebalanceResults }: AnalyticsDashboardProps) {
  if (portfolio.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portfolio Analytics</h2>
          <p className="text-slate-600">Advanced insights and performance metrics</p>
        </div>

        <Card className="border-dashed border-slate-300">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Data Available</h3>
            <p className="text-slate-600">Add portfolio data to see detailed analytics and insights.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBalance = portfolio.reduce((sum, item) => sum + item.balance, 0)

  const allocationData = portfolio
    .map((item) => ({
      fund: item.fund,
      currentAllocation: (item.balance / totalBalance) * 100,
      targetAllocation: item.target * 100,
      difference: (item.balance / totalBalance - item.target) * 100,
      balance: item.balance,
    }))
    .sort((a, b) => b.difference - a.difference)

  const overweightFunds = allocationData.filter((item) => item.difference > 0.5)
  const underweightFunds = allocationData.filter((item) => item.difference < -0.5)
  const balancedFunds = allocationData.filter((item) => Math.abs(item.difference) <= 0.5)

  const totalRebalanceAmount = rebalanceResults.reduce((sum, result) => sum + Math.abs(result.dollarsToAdd), 0)
  const buyOrders = rebalanceResults.filter((r) => r.dollarsToAdd > 0)
  const sellOrders = rebalanceResults.filter((r) => r.dollarsToAdd < 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Portfolio Analytics</h2>
        <p className="text-slate-600">Comprehensive analysis of your investment portfolio</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Portfolio Value</p>
                <p className="text-xl font-bold">${totalBalance.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Balanced Funds</p>
                <p className="text-xl font-bold">{balancedFunds.length}</p>
              </div>
              <Target className="h-6 w-6 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Overweight</p>
                <p className="text-xl font-bold">{overweightFunds.length}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Underweight</p>
                <p className="text-xl font-bold">{underweightFunds.length}</p>
              </div>
              <TrendingDown className="h-6 w-6 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Allocation Analysis
            </CardTitle>
            <CardDescription>Current vs target allocation breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allocationData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">{item.fund}</span>
                  <span className="text-sm text-slate-600">${item.balance.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-slate-600">
                  <span>Current: {item.currentAllocation.toFixed(1)}%</span>
                  <span>Target: {item.targetAllocation.toFixed(1)}%</span>
                  <span
                    className={`font-medium ${
                      item.difference > 0 ? "text-red-600" : item.difference < 0 ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    {item.difference > 0 ? "+" : ""}
                    {item.difference.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-1">
                  <Progress value={item.currentAllocation} className="h-2" />
                  <Progress value={item.targetAllocation} className="h-1 opacity-50" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rebalancing Summary */}
        {rebalanceResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rebalancing Summary
              </CardTitle>
              <CardDescription>Overview of recommended actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Buy Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">{buyOrders.length}</p>
                  <p className="text-sm text-emerald-600">
                    ${buyOrders.reduce((sum, order) => sum + order.dollarsToAdd, 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-900">Sell Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">{sellOrders.length}</p>
                  <p className="text-sm text-red-600">
                    ${Math.abs(sellOrders.reduce((sum, order) => sum + order.dollarsToAdd, 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-900">Total Activity</span>
                  <span className="text-xl font-bold text-slate-900">${totalRebalanceAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-slate-900">Top Actions</h4>
                {rebalanceResults
                  .sort((a, b) => Math.abs(b.dollarsToAdd) - Math.abs(a.dollarsToAdd))
                  .slice(0, 3)
                  .map((result, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{result.fund}</span>
                      <span className={`font-medium ${result.dollarsToAdd >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {result.dollarsToAdd >= 0 ? "+" : ""}${result.dollarsToAdd.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fund Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Fund Analysis</CardTitle>
          <CardDescription>Complete breakdown of all portfolio positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Fund</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Balance</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Current %</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Target %</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-700">Difference</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {allocationData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{item.fund}</td>
                    <td className="py-3 px-4 text-right">${item.balance.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium">{item.currentAllocation.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right">{item.targetAllocation.toFixed(1)}%</td>
                    <td
                      className={`py-3 px-4 text-right font-medium ${
                        item.difference > 0.5
                          ? "text-red-600"
                          : item.difference < -0.5
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      {item.difference > 0 ? "+" : ""}
                      {item.difference.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          Math.abs(item.difference) <= 0.5
                            ? "bg-green-100 text-green-800"
                            : item.difference > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {Math.abs(item.difference) <= 0.5
                          ? "Balanced"
                          : item.difference > 0
                            ? "Overweight"
                            : "Underweight"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
