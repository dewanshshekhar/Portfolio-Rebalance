"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Calculator, Download, PieChart } from "lucide-react"
import { PortfolioUpload } from "@/components/portfolio-upload"
import { AllocationChart } from "@/components/allocation-chart"
import { RebalanceResults } from "@/components/rebalance-results"
import { CurrentAllocation } from "@/components/current-allocation"
import { ManualEntry } from "@/components/manual-entry"
import { LoginForm } from "@/components/auth/login-form"

export interface User {
  id: string
  email: string
  name: string
}

export interface PortfolioItem {
  fund: string
  balance: number
  target: number
}

export interface RebalanceResult {
  fund: string
  dollarsToAdd: number
  allocation: number
  targetAllocation: number
  difference: number
}

export default function SpareVest() {
  const [user, setUser] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [dollarsToAdd, setDollarsToAdd] = useState<string>("")
  const [allowNegative, setAllowNegative] = useState(false)
  const [rebalanceResults, setRebalanceResults] = useState<RebalanceResult[]>([])
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("sparevest_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("sparevest_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("sparevest_user")
  }

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

  const calculateRebalance = () => {
    setError("")

    if (portfolio.length === 0) {
      setError("Please upload or enter portfolio data first")
      return
    }

    const dollars = Number.parseFloat(dollarsToAdd)
    if (isNaN(dollars) || dollars <= 0) {
      setError("Please enter a valid amount of dollars to add")
      return
    }

    const validationError = validatePortfolio(portfolio)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const currentBalance = portfolio.reduce((sum, item) => sum + item.balance, 0)
      const newBalance = currentBalance + dollars

      const results: RebalanceResult[] = portfolio.map((item) => {
        const dollarsToAddForFund = item.target * newBalance - item.balance

        if (!allowNegative && dollarsToAddForFund < 0) {
          throw new Error(
            "Must contribute more money for strictly additive rebalance, or enable negative contributions",
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during calculation")
    }
  }

  const exportResults = () => {
    if (rebalanceResults.length === 0) return

    const csvContent = [
      "Fund,Dollars_to_Add,Allocation_%,Target_Allocation_%,Difference_%",
      ...rebalanceResults.map(
        (result) =>
          `${result.fund},${result.dollarsToAdd.toFixed(2)},${(result.allocation * 100).toFixed(2)},${(result.targetAllocation * 100).toFixed(2)},${(result.difference * 100).toFixed(2)}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "rebalance_results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <PieChart className="h-8 w-8 text-blue-600" />
            Portfolio Rebalancer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Optimize your investment portfolio by calculating the exact amount to invest in each fund to maintain your
            target allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Portfolio Data
                </CardTitle>
                <CardDescription>Upload your portfolio CSV or enter data manually</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <PortfolioUpload onPortfolioLoad={setPortfolio} />
                  </TabsContent>
                  <TabsContent value="manual">
                    <ManualEntry portfolio={portfolio} onPortfolioChange={setPortfolio} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Rebalance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dollars">Total Dollars to Add</Label>
                  <Input
                    id="dollars"
                    type="number"
                    placeholder="1000"
                    value={dollarsToAdd}
                    onChange={(e) => setDollarsToAdd(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="negative" checked={allowNegative} onCheckedChange={setAllowNegative} />
                  <Label htmlFor="negative">Allow negative contributions (selling)</Label>
                </div>

                <Button
                  onClick={calculateRebalance}
                  className="w-full"
                  disabled={portfolio.length === 0 || !dollarsToAdd}
                >
                  Calculate Rebalance
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {portfolio.length > 0 && (
              <>
                <CurrentAllocation portfolio={portfolio} />
                <AllocationChart portfolio={portfolio} />
              </>
            )}

            {rebalanceResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Rebalance Results
                    <Button onClick={exportResults} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RebalanceResults results={rebalanceResults} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
