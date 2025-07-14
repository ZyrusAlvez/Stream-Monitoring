import { useParams } from "react-router-dom"
import BackgroundImage from "../layout/BackgroundImage"
import { getLogs } from "../api/scraper"
import { useState, useEffect } from "react"
import type { Folder } from "../api/folders"
import { getFolderById } from "../api/folders"
import React from "react"
import type { Log } from "../api/scraper"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

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

const Dashboard = () => {
  const { folderId } = useParams<{ folderId?: string }>()
  const [logs, setLogs] = useState<Log[]>([])
  const [folderData, setFolderData] = useState<Folder | null>(null)
  const [analytics, setAnalytics] = useState<{
    totalLogs: number
    upCount: number
    downCount: number
    errorCount: number
    uptimePercentage: number
    downtimePercentage: number
    successRate: number
    performanceData: PerformancePoint[]
    statusData: StatusPoint[]
  }>({
    totalLogs: 0,
    upCount: 0,
    downCount: 0,
    errorCount: 0,
    uptimePercentage: 0,
    downtimePercentage: 0,
    successRate: 0,
    performanceData: [],
    statusData: [],
  })

  const calculateAnalytics = (logData: Log[]) => {
    const totalLogs = logData.length
    const upCount = logData.filter((log) => log.status === "UP").length
    const downCount = logData.filter((log) => log.status === "DOWN").length
    const errorCount = logData.filter((log) => log.error).length
    
    const uptimePercentage = totalLogs > 0 ? (upCount / totalLogs) * 100 : 0
    const downtimePercentage = totalLogs > 0 ? (downCount / totalLogs) * 100 : 0
    const successRate = totalLogs > 0 ? ((totalLogs - errorCount) / totalLogs) * 100 : 0

    // Calculate performance rate over time with capping at 0
    const performanceData: PerformancePoint[] = []
    let currentRate = 0
    
    logData.forEach((log, index) => {
      const isSuccess = !log.error
      currentRate += isSuccess ? 1 : -1
      // Cap the maximum value at 0
      currentRate = Math.min(currentRate, 0)
      
      performanceData.push({
        timestamp: new Date(log.timestamp).toLocaleTimeString(),
        performanceRate: currentRate,
        occurrence: index + 1,
        isSuccess: isSuccess
      })
    })

    // Calculate status data over time with capping at 0
    const statusData: StatusPoint[] = []
    let currentStatusValue = 0
    
    logData.forEach((log, index) => {
      const isUp = log.status === "UP"
      currentStatusValue += isUp ? 1 : -1
      // Cap the maximum value at 0
      currentStatusValue = Math.min(currentStatusValue, 0)
      
      statusData.push({
        timestamp: new Date(log.timestamp).toLocaleTimeString(),
        statusValue: currentStatusValue,
        occurrence: index + 1,
        status: log.status
      })
    })

    return {
      totalLogs,
      upCount,
      downCount,
      errorCount,
      uptimePercentage: Math.round(uptimePercentage * 100) / 100,
      downtimePercentage: Math.round(downtimePercentage * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      performanceData,
      statusData,
    }
  }

  const generateReport = (format: "json" | "csv") => {
    const report = {
      folder: folderData?.name,
      url: folderData?.url,
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

  useEffect(() => {
    if (!folderId) return

    getFolderById(folderId)
      .then((data) => {
        setFolderData(data)
        getLogs(folderId).then((logData) => {
          const sortedLogs = logData.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          setLogs(sortedLogs)
          setAnalytics(calculateAnalytics(sortedLogs))
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }, [folderId])

  // Custom tooltip for performance chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm">{`Performance Rate: ${data.performanceRate}`}</p>
          <p className="text-sm">{`Occurrence #: ${data.occurrence}`}</p>
          <p className={`text-sm font-medium ${data.isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {data.isSuccess ? 'Success (+1, capped at 0)' : 'Error (-1)'}
          </p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for status chart
  const StatusTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm">{`Status Value: ${data.statusValue}`}</p>
          <p className="text-sm">{`Occurrence #: ${data.occurrence}`}</p>
          <p className={`text-sm font-medium ${data.status === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
            {data.status === 'UP' ? 'UP (+1, capped at 0)' : 'DOWN (-1)'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <BackgroundImage />
      <h2 className="text-[#008037] text-2xl font-bold mb-2">{folderData?.name}</h2>
      <a
        className="text-blue-600 text-lg font-medium underline hover:text-blue-800 break-all mb-6 block"
        href={folderData?.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {folderData?.url?.replace(/^https?:\/\//, "")}
      </a>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Total Logs</h3>
          <p className="text-2xl font-bold text-blue-900">{analytics.totalLogs}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-green-800 mb-1">Uptime Rate</h3>
          <p className="text-2xl font-bold text-green-900">{analytics.uptimePercentage}%</p>
          <p className="text-xs text-green-600 mt-1">{analytics.upCount} UP status</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-red-800 mb-1">Downtime Rate</h3>
          <p className="text-2xl font-bold text-red-900">{analytics.downtimePercentage}%</p>
          <p className="text-xs text-red-600 mt-1">{analytics.downCount} DOWN status</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-purple-800 mb-1">Success Rate</h3>
          <p className="text-2xl font-bold text-purple-900">{analytics.successRate}%</p>
          <p className="text-xs text-purple-600 mt-1">{analytics.totalLogs - analytics.errorCount} no errors</p>
        </div>
      </div>

      {/* Export Buttons */}
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

      {/* Enhanced Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#008037] text-white">
              <tr>
                <th className="py-3 px-4 text-left font-medium">#</th>
                <th className="py-3 px-4 text-left font-medium">Timestamp</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((e, i) => (
                <React.Fragment key={e.log_id}>
                  <tr className={`${e.error ? "bg-red-50" : i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="py-3 px-4 text-sm text-gray-600">{i + 1}</td>
                    <td className="py-3 px-4 text-sm">{new Date(e.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm font-medium">{e.status}</td>
                    <td className="py-3 px-4 text-sm">
                      {e.error ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Error
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Success
                        </span>
                      )}
                    </td>
                  </tr>

                  {e.error && (
                    <tr>
                      <td colSpan={4} className="py-3 px-4 bg-red-100 border-l-4 border-red-500">
                        <div className="text-sm text-red-700">
                          <strong>Error Details:</strong>
                          <div className="mt-1 font-mono text-xs bg-red-50 p-2 rounded">
                            {typeof e.error === "string" ? e.error : JSON.stringify(e.error, null, 2)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Rate Chart */}
        {analytics.performanceData.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Performance Rate Over Time</h3>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Shows degradation from ideal performance (0): +1 for success, -1 for error, capped at 0
                </p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={Math.floor(analytics.performanceData.length / 10)}
                  />
                  <YAxis 
                    label={{ value: 'Performance Rate', angle: -90, position: 'insideLeft' }}
                    domain={['dataMin', 0]}
                    allowDecimals={false}
                    type="number"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="performanceRate" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#1d4ed8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Status Chart */}
        {analytics.statusData.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-800">Status Rate Over Time</h3>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Shows degradation from ideal status (0): +1 for UP, -1 for DOWN, capped at 0
                </p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={Math.floor(analytics.statusData.length / 10)}
                  />
                  <YAxis 
                    label={{ value: 'Status Value', angle: -90, position: 'insideLeft' }}
                    domain={['dataMin', 0]}
                    allowDecimals={false}
                    type="number"
                  />
                  <Tooltip content={<StatusTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="statusValue" 
                    stroke="#059669" 
                    strokeWidth={2}
                    dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: '#047857' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard