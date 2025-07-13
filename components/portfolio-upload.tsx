"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText } from "lucide-react"
import type { PortfolioItem } from "@/app/page"

interface PortfolioUploadProps {
  onPortfolioLoad: (portfolio: PortfolioItem[]) => void
}

export function PortfolioUpload({ onPortfolioLoad }: PortfolioUploadProps) {
  const [error, setError] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string): PortfolioItem[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) throw new Error("CSV must have at least a header and one data row")

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const fundIndex = header.findIndex((h) => h === "fund")
    const balanceIndex = header.findIndex((h) => h === "balance")
    const targetIndex = header.findIndex((h) => h === "target")

    if (fundIndex === -1 || balanceIndex === -1 || targetIndex === -1) {
      throw new Error("CSV must contain Fund, Balance, and Target columns")
    }

    const portfolio: PortfolioItem[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.length < 3) continue

      const fund = values[fundIndex]
      const balance = Number.parseFloat(values[balanceIndex])
      const target = Number.parseFloat(values[targetIndex])

      if (isNaN(balance) || isNaN(target)) {
        throw new Error(`Invalid numeric values in row ${i + 1}`)
      }

      portfolio.push({ fund, balance, target })
    }

    return portfolio
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError("")

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const portfolio = parseCSV(text)
        onPortfolioLoad(portfolio)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV file")
      }
    }
    reader.readAsText(file)
  }

  const loadSampleData = () => {
    const samplePortfolio: PortfolioItem[] = [
      { fund: "InvestmentA", balance: 250, target: 0.5 },
      { fund: "InvestmentB", balance: 100, target: 0.2 },
      { fund: "InvestmentC", balance: 200, target: 0.3 },
    ]
    onPortfolioLoad(samplePortfolio)
    setFileName("sample_portfolio.csv")
    setError("")
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600 mb-4">Upload a CSV file with Fund, Balance, and Target columns</p>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
      </div>

      {fileName && <p className="text-sm text-green-600">Loaded: {fileName}</p>}

      <div className="text-center">
        <Button variant="outline" onClick={loadSampleData}>
          Load Sample Data
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>CSV Format:</strong>
        </p>
        <p>Fund,Balance,Target</p>
        <p>Stock Fund,1000,0.6</p>
        <p>Bond Fund,400,0.4</p>
      </div>
    </div>
  )
}
