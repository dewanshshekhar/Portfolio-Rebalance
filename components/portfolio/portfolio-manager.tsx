"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, FileText, Download } from "lucide-react"
import type { PortfolioItem } from "@/app/page"
import { PortfolioUpload } from "@/components/portfolio/portfolio-upload"
import { ManualEntry } from "@/components/portfolio/manual-entry"
import { PortfolioTable } from "@/components/portfolio/portfolio-table"

interface PortfolioManagerProps {
  portfolio: PortfolioItem[]
  onPortfolioChange: (portfolio: PortfolioItem[]) => void
}

export function PortfolioManager({ portfolio, onPortfolioChange }: PortfolioManagerProps) {
  const [activeTab, setActiveTab] = useState("upload")

  const exportPortfolio = () => {
    if (portfolio.length === 0) return

    const csvContent = [
      "Fund,Balance,Target",
      ...portfolio.map((item) => `${item.fund},${item.balance},${item.target}`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portfolio Management</h2>
          <p className="text-slate-600">Upload or manage your investment portfolio data</p>
        </div>
        {portfolio.length > 0 && (
          <Button onClick={exportPortfolio} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Portfolio Data</CardTitle>
              <CardDescription>Import your portfolio from CSV or enter funds manually</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload CSV
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Manual Entry
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-6">
                  <PortfolioUpload onPortfolioLoad={onPortfolioChange} />
                </TabsContent>

                <TabsContent value="manual" className="mt-6">
                  <ManualEntry portfolio={portfolio} onPortfolioChange={onPortfolioChange} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Format Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Required Columns:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>
                    • <strong>Fund:</strong> Investment name
                  </li>
                  <li>
                    • <strong>Balance:</strong> Current dollar amount
                  </li>
                  <li>
                    • <strong>Target:</strong> Desired allocation (0.0-1.0)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">Example:</h4>
                <div className="bg-slate-50 p-3 rounded-lg text-xs font-mono">
                  Fund,Balance,Target
                  <br />
                  S&P 500,10000,0.6
                  <br />
                  Bonds,4000,0.4
                </div>
              </div>

              <div className="text-xs text-slate-500">
                <p>
                  <strong>Note:</strong> Target allocations must sum to 1.0 (100%)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {portfolio.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Portfolio</CardTitle>
            <CardDescription>
              {portfolio.length} funds • Total: $
              {portfolio.reduce((sum, item) => sum + item.balance, 0).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioTable portfolio={portfolio} onPortfolioChange={onPortfolioChange} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
