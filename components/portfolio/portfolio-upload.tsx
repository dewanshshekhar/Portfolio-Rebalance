"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle } from "lucide-react"
import type { PortfolioItem } from "@/app/page"

interface PortfolioUploadProps {
  onPortfolioLoad: (portfolio: PortfolioItem[]) => void
}

export function PortfolioUpload({ onPortfolioLoad }: PortfolioUploadProps) {
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
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

  const handleFile = (file: File) => {
    setError("")
    setSuccess("")

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const portfolio = parseCSV(text)
        onPortfolioLoad(portfolio)
        setSuccess(`Successfully loaded ${portfolio.length} funds from ${file.name}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV file")
      }
    }
    reader.readAsText(file)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files[0]
    if (file && file.type === "text/csv") {
      handleFile(file)
    } else {
      setError("Please upload a CSV file")
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const loadSampleData = () => {
    const samplePortfolio: PortfolioItem[] = [
      { fund: "S&P 500 Index", balance: 15000, target: 0.6 },
      { fund: "International Stocks", balance: 5000, target: 0.2 },
      { fund: "Bond Index", balance: 5000, target: 0.2 },
    ]
    onPortfolioLoad(samplePortfolio)
    setSuccess("Sample portfolio loaded successfully")
    setError("")
  }

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragOver ? "border-emerald-400 bg-emerald-50" : "border-slate-300 hover:border-slate-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-slate-500" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-900">Upload Portfolio CSV</h3>
            <p className="text-slate-600">Drag and drop your CSV file here, or click to browse</p>
          </div>

          <Button onClick={() => fileInputRef.current?.click()} className="bg-emerald-600 hover:bg-emerald-700">
            <FileText className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-center">
        <Button variant="outline" onClick={loadSampleData}>
          Load Sample Portfolio
        </Button>
      </div>
    </div>
  )
}
