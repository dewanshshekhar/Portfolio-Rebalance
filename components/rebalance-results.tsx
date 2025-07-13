import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RebalanceResult } from "@/app/page"

interface RebalanceResultsProps {
  results: RebalanceResult[]
}

export function RebalanceResults({ results }: RebalanceResultsProps) {
  const sortedResults = [...results].sort((a, b) => b.dollarsToAdd - a.dollarsToAdd)
  const totalDollars = results.reduce((sum, result) => sum + Math.abs(result.dollarsToAdd), 0)

  return (
    <div className="space-y-3">
      {sortedResults.map((result, index) => (
        <Card
          key={index}
          className="border-l-4"
          style={{
            borderLeftColor: result.dollarsToAdd >= 0 ? "#10B981" : "#EF4444",
          }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">{result.fund}</h4>
              <Badge variant={result.dollarsToAdd >= 0 ? "default" : "destructive"}>
                {result.dollarsToAdd >= 0 ? "Buy" : "Sell"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-medium text-lg">${Math.abs(result.dollarsToAdd).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-gray-600">Allocation</p>
                <p className="font-medium">{((Math.abs(result.dollarsToAdd) / totalDollars) * 100).toFixed(1)}%</p>
              </div>

              <div>
                <p className="text-gray-600">Target</p>
                <p className="font-medium">{(result.targetAllocation * 100).toFixed(1)}%</p>
              </div>

              <div>
                <p className="text-gray-600">Difference</p>
                <p className={`font-medium ${result.difference > 0 ? "text-red-600" : "text-green-600"}`}>
                  {result.difference > 0 ? "+" : ""}
                  {(result.difference * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="pt-4 border-t">
        <div className="flex justify-between font-semibold">
          <span>Total Investment Required:</span>
          <span>${totalDollars.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
