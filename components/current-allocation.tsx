import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PortfolioItem } from "@/app/page"

interface CurrentAllocationProps {
  portfolio: PortfolioItem[]
}

export function CurrentAllocation({ portfolio }: CurrentAllocationProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current vs Target Allocation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allocationData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{item.fund}</span>
              <span className="text-sm text-gray-600">${item.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Current: {item.currentAllocation.toFixed(1)}%</span>
              <span>Target: {item.targetAllocation.toFixed(1)}%</span>
              <span className={item.difference > 0 ? "text-red-600" : "text-green-600"}>
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
        <div className="pt-2 border-t">
          <div className="flex justify-between font-semibold">
            <span>Total Portfolio Value:</span>
            <span>${totalBalance.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
