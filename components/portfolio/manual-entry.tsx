"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { PortfolioItem } from "@/app/page"

interface ManualEntryProps {
  portfolio: PortfolioItem[]
  onPortfolioChange: (portfolio: PortfolioItem[]) => void
}

export function ManualEntry({ portfolio, onPortfolioChange }: ManualEntryProps) {
  const [newFund, setNewFund] = useState({ fund: "", balance: "", target: "" })

  const addFund = () => {
    if (!newFund.fund || !newFund.balance || !newFund.target) return

    const balance = Number.parseFloat(newFund.balance)
    const target = Number.parseFloat(newFund.target) / 100 // Convert percentage to decimal

    if (isNaN(balance) || isNaN(target)) return

    const updatedPortfolio = [...portfolio, { fund: newFund.fund, balance, target }]

    onPortfolioChange(updatedPortfolio)
    setNewFund({ fund: "", balance: "", target: "" })
  }

  const removeFund = (index: number) => {
    const updatedPortfolio = portfolio.filter((_, i) => i !== index)
    onPortfolioChange(updatedPortfolio)
  }

  const updateFund = (index: number, field: keyof PortfolioItem, value: string) => {
    const updatedPortfolio = [...portfolio]
    if (field === "fund") {
      updatedPortfolio[index][field] = value
    } else {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        updatedPortfolio[index][field] = field === "target" ? numValue / 100 : numValue
      }
    }
    onPortfolioChange(updatedPortfolio)
  }

  const totalTarget = portfolio.reduce((sum, item) => sum + item.target, 0) * 100
  const isTargetValid = Math.abs(totalTarget - 100) < 0.1

  return (
    <div className="space-y-6">
      {portfolio.map((item, index) => (
        <Card key={index} className="border-slate-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label className="text-slate-700">Fund Name</Label>
                <Input
                  value={item.fund}
                  onChange={(e) => updateFund(index, "fund", e.target.value)}
                  placeholder="e.g., S&P 500 Index"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-700">Balance ($)</Label>
                <Input
                  type="number"
                  value={item.balance}
                  onChange={(e) => updateFund(index, "balance", e.target.value)}
                  placeholder="10000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-700">Target (%)</Label>
                <Input
                  type="number"
                  value={(item.target * 100).toFixed(1)}
                  onChange={(e) => updateFund(index, "target", e.target.value)}
                  placeholder="60"
                  className="mt-1"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFund(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed border-slate-300">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label className="text-slate-700">Fund Name</Label>
              <Input
                value={newFund.fund}
                onChange={(e) => setNewFund({ ...newFund, fund: e.target.value })}
                placeholder="Enter fund name"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-700">Balance ($)</Label>
              <Input
                type="number"
                value={newFund.balance}
                onChange={(e) => setNewFund({ ...newFund, balance: e.target.value })}
                placeholder="10000"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-700">Target (%)</Label>
              <Input
                type="number"
                value={newFund.target}
                onChange={(e) => setNewFund({ ...newFund, target: e.target.value })}
                placeholder="60"
                className="mt-1"
              />
            </div>
            <Button
              onClick={addFund}
              disabled={!newFund.fund || !newFund.balance || !newFund.target}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Fund
            </Button>
          </div>
        </CardContent>
      </Card>

      {portfolio.length > 0 && (
        <Alert className={isTargetValid ? "border-emerald-200 bg-emerald-50" : "border-orange-200 bg-orange-50"}>
          <AlertCircle className={`h-4 w-4 ${isTargetValid ? "text-emerald-600" : "text-orange-600"}`} />
          <AlertDescription className={isTargetValid ? "text-emerald-800" : "text-orange-800"}>
            Total Target Allocation: {totalTarget.toFixed(1)}%{!isTargetValid && " (Must equal 100%)"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
