"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioItem } from "@/app/page"
import type React from "react" // Import React to declare JSX

interface AllocationChartProps {
  portfolio: PortfolioItem[]
}

export function AllocationChart({ portfolio }: AllocationChartProps) {
  const totalBalance = portfolio.reduce((sum, item) => sum + item.balance, 0)

  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

  let cumulativePercentage = 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Allocation Pie */}
          <div>
            <h4 className="font-medium mb-2">Current Allocation</h4>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              {portfolio.map((item, index) => {
                const percentage = (item.balance / totalBalance) * 100
                const left = cumulativePercentage
                cumulativePercentage += percentage

                return (
                  <div
                    key={`current-${index}`}
                    className="absolute h-full"
                    style={{
                      left: `${left}%`,
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* Target Allocation Pie */}
          <div>
            <h4 className="font-medium mb-2">Target Allocation</h4>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              {
                portfolio.reduce(
                  (acc, item, index) => {
                    const percentage = item.target * 100
                    const left = acc.cumulative
                    acc.cumulative += percentage

                    acc.elements.push(
                      <div
                        key={`target-${index}`}
                        className="absolute h-full opacity-70"
                        style={{
                          left: `${left}%`,
                          width: `${percentage}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                      />,
                    )

                    return acc
                  },
                  { elements: [] as React.JSX.Element[], cumulative: 0 },
                ).elements
              }
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {portfolio.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="truncate">{item.fund}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
