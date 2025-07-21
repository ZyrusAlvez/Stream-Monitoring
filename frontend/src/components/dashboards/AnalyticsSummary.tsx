interface Analytics {
  totalLogs: number
  upCount: number
  downCount: number
  errorCount: number
  uptimePercentage: number
  downtimePercentage: number
  successRate: number
}

interface AnalyticsSummaryProps {
  analytics: Analytics
}

const AnalyticsSummary = ({ analytics }: AnalyticsSummaryProps) => {
  return (
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
  )
}

export default AnalyticsSummary