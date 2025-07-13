"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
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
    const target = Number.parseFloat(newFund.target)

    if (isNaN(balance) || isNaN(target)) return

    const updatedPortfolio = [
      ...portfolio,
      {
        fund: newFund.fund,
        balance,
        target: target / 100, // Convert percentage to decimal
      },
    ]

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

  return (
    <div className="space-y-4">
      {portfolio.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label>Fund Name</Label>
                <Input
                  value={item.fund}
                  onChange={(e) => updateFund(index, "fund", e.target.value)}
                  placeholder="Fund name"
                />
              </div>
              <div>
                <Label>Balance ($)</Label>
                <Input
                  type="number"
                  value={item.balance}
                  onChange={(e) => updateFund(index, "balance", e.target.value)}
                  placeholder="1000"
                />
              </div>
              <div>
                <Label>Target (%)</Label>
                <Input
                  type="number"
                  value={(item.target * 100).toFixed(1)}
                  onChange={(e) => updateFund(index, "target", e.target.value)}
                  placeholder="50"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => removeFund(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Fund Name</Label>
              <Input
                value={newFund.fund}
                onChange={(e) => setNewFund({ ...newFund, fund: e.target.value })}
                placeholder="New fund name"
              />
            </div>
            <div>
              <Label>Balance ($)</Label>
              <Input
                type="number"
                value={newFund.balance}
                onChange={(e) => setNewFund({ ...newFund, balance: e.target.value })}
                placeholder="1000"
              />
            </div>
            <div>
              <Label>Target (%)</Label>
              <Input
                type="number"
                value={newFund.target}
                onChange={(e) => setNewFund({ ...newFund, target: e.target.value })}
                placeholder="50"
              />
            </div>
            <Button onClick={addFund}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {portfolio.length > 0 && (
        <div className={`text-sm ${Math.abs(totalTarget - 100) > 0.1 ? "text-red-600" : "text-green-600"}`}>
          Total Target Allocation: {totalTarget.toFixed(1)}%{Math.abs(totalTarget - 100) > 0.1 && " (Must equal 100%)"}
        </div>
      )}
    </div>
  )
}
