"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import type { PortfolioItem } from "@/app/page"

interface PortfolioTableProps {
  portfolio: PortfolioItem[]
  onPortfolioChange: (portfolio: PortfolioItem[]) => void
}

export function PortfolioTable({ portfolio, onPortfolioChange }: PortfolioTableProps) {
  const totalBalance = portfolio.reduce((sum, item) => sum + item.balance, 0)

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

  const removeFund = (index: number) => {
    const updatedPortfolio = portfolio.filter((_, i) => i !== index)
    onPortfolioChange(updatedPortfolio)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 font-medium text-slate-700">Fund</th>
            <th className="text-right py-3 px-4 font-medium text-slate-700">Balance</th>
            <th className="text-right py-3 px-4 font-medium text-slate-700">Current %</th>
            <th className="text-right py-3 px-4 font-medium text-slate-700">Target %</th>
            <th className="text-right py-3 px-4 font-medium text-slate-700">Difference</th>
            <th className="text-center py-3 px-4 font-medium text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item, index) => {
            const currentAllocation = (item.balance / totalBalance) * 100
            const difference = currentAllocation - item.target * 100

            return (
              <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <Input
                    value={item.fund}
                    onChange={(e) => updateFund(index, "fund", e.target.value)}
                    className="border-none bg-transparent p-0 font-medium"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <Input
                    type="number"
                    value={item.balance}
                    onChange={(e) => updateFund(index, "balance", e.target.value)}
                    className="border-none bg-transparent p-0 text-right w-24 ml-auto"
                  />
                </td>
                <td className="py-3 px-4 text-right font-medium">{currentAllocation.toFixed(1)}%</td>
                <td className="py-3 px-4 text-right">
                  <Input
                    type="number"
                    value={(item.target * 100).toFixed(1)}
                    onChange={(e) => updateFund(index, "target", e.target.value)}
                    className="border-none bg-transparent p-0 text-right w-16 ml-auto"
                  />
                </td>
                <td
                  className={`py-3 px-4 text-right font-medium ${difference > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {difference > 0 ? "+" : ""}
                  {difference.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFund(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200 font-semibold">
            <td className="py-3 px-4">Total</td>
            <td className="py-3 px-4 text-right">${totalBalance.toLocaleString()}</td>
            <td className="py-3 px-4 text-right">100.0%</td>
            <td className="py-3 px-4 text-right">
              {(portfolio.reduce((sum, item) => sum + item.target, 0) * 100).toFixed(1)}%
            </td>
            <td className="py-3 px-4"></td>
            <td className="py-3 px-4"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
