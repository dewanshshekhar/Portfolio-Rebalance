"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  LogOut,
  Upload,
  Calculator,
  BarChart3,
  Settings,
  Bell,
  DollarSign,
  TrendingDown,
} from "lucide-react"
import type { PortfolioItem, RebalanceResult } from "@/app/page"
import { PortfolioManager } from "@/components/portfolio/portfolio-manager"
import { RebalanceCalculator } from "@/components/rebalance/rebalance-calculator"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { SettingsPanel } from "@/components/settings/settings-panel"
import { User } from "lucide-react" // Import User component

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [rebalanceResults, setRebalanceResults] = useState<RebalanceResult[]>([])
  const [activeTab, setActiveTab] = useState("portfolio")

  const totalBalance = portfolio.reduce((sum, item) => sum + item.balance, 0)
  const totalRebalanceAmount = rebalanceResults.reduce((sum, result) => sum + Math.abs(result.dollarsToAdd), 0)

  const overweightFunds = portfolio.filter((item) => {
    const currentAllocation = item.balance / totalBalance
    return currentAllocation > item.target
  }).length

  const underweightFunds = portfolio.filter((item) => {
    const currentAllocation = item.balance / totalBalance
    return currentAllocation < item.target
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SpareVest</h1>
                <p className="text-xs text-slate-500">Portfolio Rebalancing</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-slate-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-slate-500">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Portfolio</p>
                  <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Rebalance Amount</p>
                  <p className="text-2xl font-bold">${totalRebalanceAmount.toLocaleString()}</p>
                </div>
                <Calculator className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Overweight Funds</p>
                  <p className="text-2xl font-bold">{overweightFunds}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Underweight Funds</p>
                  <p className="text-2xl font-bold">{underweightFunds}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="rebalance" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Rebalance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <PortfolioManager portfolio={portfolio} onPortfolioChange={setPortfolio} />
          </TabsContent>

          <TabsContent value="rebalance">
            <RebalanceCalculator portfolio={portfolio} onResultsChange={setRebalanceResults} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard portfolio={portfolio} rebalanceResults={rebalanceResults} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
