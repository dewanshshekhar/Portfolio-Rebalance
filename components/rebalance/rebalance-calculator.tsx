"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Download, AlertTriangle } from "lucide-react"
import type { PortfolioItem, RebalanceResult } from "@/app/page"
import { RebalanceResults } from "@/components/rebalance/rebalance-results"

interface RebalanceCalculatorProps {
  portfolio: PortfolioItem[]
  onResultsChange: (results: RebalanceResult[]) => void
}

export function RebalanceCalculator({ portfolio, onResultsChange }: RebalanceCalculatorProps) {
  const [dollarsToAdd, setDollarsToAdd] = useState<string>("")
  const [allowNegative, setAllowNegative] = useState(false)
  const [rebalanceResults, setRebalanceResults] = useState<RebalanceResult[]>([])
  const [error, setError] = useState<string>("")
  const [isCalculating, setIsCalculating] = useState(false)

  const validatePortfolio = (data: PortfolioItem[]): string | null => {
    if (data.length === 0) return "Portfolio cannot be empty"

    const targetSum = data.reduce((sum, item) => sum + item.target, 0)
    if (Math.abs(targetSum - 1) > 0.001) {
      return "Target allocations must sum to 100% (1.0)"
    }

    const hasNegativeBalance = data.some((item) => item.balance < 0)
    if (hasNegativeBalance) {
      return "Balances cannot be negative"
    }

    return null
  }

  const calculateRebalance = async () => {
    setError("")
    setIsCalculating(true)

    // Simulate calculation delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      if (portfolio.length === 0) {
        throw new Error("Please add portfolio data first")
      }

      const dollars = Number.parseFloat(dollarsToAdd)
      if (isNaN(dollars) || dollars <= 0) {
        throw new Error("Please enter a valid amount of dollars to add")
      }

      const validationError = validatePortfolio(portfolio)
      if (validationError) {
        throw new Error(validationError)
      }

      const currentBalance = portfolio.reduce((sum, item) => sum + item.balance, 0)
      const newBalance = currentBalance + dollars

      const results: RebalanceResult[] = portfolio.map((item) => {
        const dollarsToAddForFund = item.target * newBalance - item.balance

        if (!allowNegative && dollarsToAddForFund < 0) {
          throw new Error(
            "Some funds require selling to reach target allocation. Enable 'Allow negative contributions' or add more money.",
          )
        }

        return {
          fund: item.fund,
          dollarsToAdd: dollarsToAddForFund,
          allocation: dollarsToAddForFund / dollars,
          targetAllocation: item.target,
          difference: dollarsToAddForFund / dollars - item.target,
        }
      })

      setRebalanceResults(results)
      onResultsChange(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during calculation")
    } finally {
      setIsCalculating(false)
    }
  }

  const exportResults = () => {
    if (rebalanceResults.length === 0) return

    const csvContent = [
      "Fund,Dollars_to_Add,Action,Allocation_%,Target_Allocation_%,Difference_%",
      ...rebalanceResults.map(
        (result) =>
          `${result.fund},${Math.abs(result.dollarsToAdd).toFixed(2)},${result.dollarsToAdd >= 0 ? "Buy" : "Sell"},${(result.allocation * 100).toFixed(2)},${(result.targetAllocation * 100).toFixed(2)},${(result.difference * 100).toFixed(2)}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rebalance_results_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalBalance = portfolio.reduce((sum, item) => sum + item.balance, 0)
  const dollarsValue = Number.parseFloat(dollarsToAdd) || 0
  const newTotalBalance = totalBalance + dollarsValue

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Rebalance Calculator</h2>
        <p className="text-slate-600">Calculate optimal fund allocation to reach your target percentages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Rebalance Settings
              </CardTitle>
              <CardDescription>Configure your rebalancing parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dollars" className="text-slate-700">
                  Total Dollars to Add
                </Label>
                <Input
                  id="dollars"
                  type="number"
                  placeholder="5000"
                  value={dollarsToAdd}
                  onChange={(e) => setDollarsToAdd(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-slate-500">Amount of new money to invest in your portfolio</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="negative" className="text-slate-700 font-medium">
                    Allow Selling
                  </Label>
                  <p className="text-xs text-slate-500">Permit negative contributions (selling overweight funds)</p>
                </div>
                <Switch id="negative" checked={allowNegative} onCheckedChange={setAllowNegative} />
              </div>

              <Button
                onClick={calculateRebalance}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={portfolio.length === 0 || !dollarsToAdd || isCalculating}
              >
                {isCalculating ? "Calculating..." : "Calculate Rebalance"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {portfolio.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Balance:</span>
                  <span className="font-medium">${totalBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Adding:</span>
                  <span className="font-medium text-emerald-600">+${dollarsValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-slate-600">New Balance:</span>
                  <span className="font-semibold">${newTotalBalance.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {rebalanceResults.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Rebalancing Recommendations
                  <Button onClick={exportResults} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </CardTitle>
                <CardDescription>Optimal allocation to reach your target percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <RebalanceResults results={rebalanceResults} />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-slate-300">
              <CardContent className="p-12 text-center">
                <Calculator className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Calculate</h3>
                <p className="text-slate-600">
                  Enter the amount you want to invest and click "Calculate Rebalance" to see your optimal allocation.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
