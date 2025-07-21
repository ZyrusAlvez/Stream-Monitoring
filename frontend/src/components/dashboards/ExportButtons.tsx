import type { Folder } from "../../api/folders"
import type { Log } from "../../api/scraper"
import type { YoutubeChannelLog } from "../../api/scraper"

type PerformancePoint = {
  timestamp: string
  performanceRate: number
  occurrence: number
  isSuccess: boolean
}

type StatusPoint = {
  timestamp: string
  statusValue: number
  occurrence: number
  status: string
}

interface Analytics {
  totalLogs: number
  upCount: number
  downCount: number
  errorCount: number
  uptimePercentage: number
  downtimePercentage: number
  successRate: number
  performanceData: PerformancePoint[]
  statusData: StatusPoint[]
}

interface ExportButtonsProps {
  folderData: Folder | null
  logs: Log[] | YoutubeChannelLog[]
  analytics: Analytics
  nextCallTime: string | null
}

const ExportButtons = ({ folderData, logs, analytics, nextCallTime }: ExportButtonsProps) => {
  const generateReport = (format: "json" | "csv") => {
    const report = {
      folder: folderData?.name,
      url: folderData?.url,
      configuration: {
        interval: folderData?.interval,
        repetition: folderData?.repetition,
        timeStart: folderData?.start_time,
        nextCall: nextCallTime,
      },
      reportGenerated: new Date().toISOString(),
      summary: {
        totalLogs: analytics.totalLogs,
        upCount: analytics.upCount,
        downCount: analytics.downCount,
        errorCount: analytics.errorCount,
        successCount: analytics.totalLogs - analytics.errorCount,
        uptimePercentage: analytics.uptimePercentage,
        downtimePercentage: analytics.downtimePercentage,
        successRate: analytics.successRate,
      },
      performanceOverTime: analytics.performanceData,
      statusOverTime: analytics.statusData,
      detailedLogs: logs.map((log) => ({
        timestamp: log.timestamp,
        status: log.status,
        hasError: !!log.error,
        error: log.error || null,
      })),
    }

    if (format === "json") {
      const dataStr = JSON.stringify(report, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `${folderData?.name || "dashboard"}_report.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    } else if (format === "csv") {
      const csvHeaders = ["Timestamp", "Status", "Has Error", "Error Message"]
      const csvRows = logs.map((log) => [
        log.timestamp,
        log.status,
        log.error ? "Yes" : "No",
        log.error || "",
      ])

      const csvContent = [csvHeaders, ...csvRows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n")
    
      const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    
      const exportFileDefaultName = `${folderData?.name || "dashboard"}_report.csv`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
    }
  }

  return (
    <div className="mb-6 flex gap-2">
      <button
        onClick={() => generateReport("json")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Export JSON Report
      </button>
      <button
        onClick={() => generateReport("csv")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Export CSV Report
      </button>
    </div>
  )
}

export default ExportButtons