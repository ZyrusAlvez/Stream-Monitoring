import { useParams } from "react-router-dom"
import BackgroundImage from "../layout/BackgroundImage"
import { getLogs } from "../api/scraper"
import { useState, useEffect } from "react"
import type { Folder } from "../api/folders"
import { getFolderById } from "../api/folders"
import type { Log } from "../api/scraper"

// Import separated components
import ConfigurationSection from "../components/dashboards/ConfigurationSection"
import AnalyticsSummary from "../components/dashboards/AnalyticsSummary"
import ExportButtons from "../components/dashboards/ExportButtons"
import Table from "../components/dashboards/Table"
import ChartsSection from "../components/dashboards/ChartsSection"

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
  const [nextCallTime, setNextCallTime] = useState<string | null>(null)
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

  useEffect(() => {
    if (!folderId || !folderData) return;
    setNextCallTime(folderData.next_call_time || null);
  }, [folderId, folderData]);
  
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <BackgroundImage />
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col">
          <h2 className="text-[#008037] text-2xl font-bold mb-2">{folderData?.name}</h2>
          <a
            className="text-blue-600 text-lg font-medium underline hover:text-blue-800 break-all mb-6 block"
            href={folderData?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {folderData?.url?.replace(/^https?:\/\//, "")}
          </a>
        </div>

        {/* Export Buttons */}
        <ExportButtons 
          folderData={folderData}
          logs={logs}
          analytics={analytics}
          nextCallTime={nextCallTime}
        />
      </div>
      
      {/* Configuration Section */}
      <ConfigurationSection 
        folderData={folderData} 
        nextCallTime={nextCallTime}
      />

      {/* Analytics Summary */}
      <AnalyticsSummary analytics={analytics} />

      {/* Table */}
      <Table logs={logs} />

      {/* Charts Section */}
      <ChartsSection 
        performanceData={analytics.performanceData}
        statusData={analytics.statusData}
      />
    </div>
  )
}

export default Dashboard