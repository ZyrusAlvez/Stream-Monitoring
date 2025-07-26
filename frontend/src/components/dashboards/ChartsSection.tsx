import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
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

interface ChartsSectionProps {
  performanceData: PerformancePoint[]
  statusData: StatusPoint[]
}

const ChartsSection = ({ performanceData, statusData }: ChartsSectionProps) => {
  // Process performance data with reset logic
  const processPerformanceData = (data: PerformancePoint[]): PerformancePoint[] => {
    let cumulativeRate = 0
    return data.map((point) => {
      if (point.isSuccess) {
        cumulativeRate = 0 // Reset to 0 on success
      } else {
        cumulativeRate -= 1 // Subtract 1 on error
      }
      return {
        ...point,
        performanceRate: cumulativeRate
      }
    })
  }

  // Process status data with reset logic
  const processStatusData = (data: StatusPoint[]): StatusPoint[] => {
    let cumulativeValue = 0
    return data.map((point) => {
      if (point.status === 'UP') {
        cumulativeValue = 0 // Reset to 0 on UP
      } else {
        cumulativeValue -= 1 // Subtract 1 on DOWN
      }
      return {
        ...point,
        statusValue: cumulativeValue
      }
    })
  }

  // Process the data with reset logic
  const processedPerformanceData = processPerformanceData(performanceData)
  const processedStatusData = processStatusData(statusData)

  // Calculate shared Y-axis domain based on the minimum value across both processed datasets
  const getSharedYDomain = () => {
    const performanceMin = processedPerformanceData.length > 0 ? Math.min(...processedPerformanceData.map(d => d.performanceRate)) : 0
    const statusMin = processedStatusData.length > 0 ? Math.min(...processedStatusData.map(d => d.statusValue)) : 0
    const globalMin = Math.min(performanceMin, statusMin, 0) // Ensure it includes 0
    return [globalMin, 0]
  }
  
  const sharedYDomain = getSharedYDomain()

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
            {data.isSuccess ? 'Success (reset to 0)' : 'Error (-1)'}
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
            {data.status === 'UP' ? 'UP (reset to 0)' : 'DOWN (-1)'}
          </p>
        </div>
      )
    }
    return null
  }

  // Custom dot renderer for performance chart
  const CustomPerformanceDot = (props: any) => {
    const { cx, cy, payload } = props
    const isSuccess = payload.isSuccess // Use the operation type, not the current value
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={isSuccess ? '#16a34a' : '#dc2626'}
        stroke={isSuccess ? '#15803d' : '#b91c1c'}
        strokeWidth={2}
      />
    )
  }

  // Custom active dot for performance chart that maintains correct colors
  const CustomPerformanceActiveDot = (props: any) => {
    const { cx, cy, payload } = props
    const isSuccess = payload.isSuccess // Use the operation type, not the current value
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={isSuccess ? '#16a34a' : '#dc2626'}
        stroke={isSuccess ? '#15803d' : '#b91c1c'}
        strokeWidth={3}
      />
    )
  }

  // Custom dot renderer for status chart
  const CustomStatusDot = (props: any) => {
    const { cx, cy, payload } = props
    const isUp = payload.status === 'UP' // Use the operation type, not the current value
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={isUp ? '#16a34a' : '#dc2626'}
        stroke={isUp ? '#15803d' : '#b91c1c'}
        strokeWidth={2}
      />
    )
  }

  // Custom active dot for status chart that maintains correct colors
  const CustomStatusActiveDot = (props: any) => {
    const { cx, cy, payload } = props
    const isUp = payload.status === 'UP' // Use the operation type, not the current value
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={isUp ? '#16a34a' : '#dc2626'}
        stroke={isUp ? '#15803d' : '#b91c1c'}
        strokeWidth={3}
      />
    )
  }

  // Create gradient definitions
  const PerformanceGradient = () => (
    <defs>
      <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#16a34a" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.3} />
      </linearGradient>
    </defs>
  )

  const StatusGradient = () => (
    <defs>
      <linearGradient id="statusGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#16a34a" stopOpacity={0.1} />
        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.3} />
      </linearGradient>
    </defs>
  )

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Performance Rate Chart */}
      {processedPerformanceData.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">Performance Over Time</h3>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Shows degradation from ideal performance (0): success resets to 0, -1 for error
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Success Operations</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600">Error Operations</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={processedPerformanceData}>
                <PerformanceGradient />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={Math.floor(processedPerformanceData.length / 10)}
                />
                <YAxis 
                  label={{ value: 'Performance Rate', angle: -90, position: 'insideLeft' }}
                  domain={sharedYDomain}
                  allowDecimals={false}
                  type="number"
                />
                <ReferenceLine y={0} stroke="#374151" strokeWidth={2} strokeDasharray="5 5" />
                <Area
                  type="monotone"
                  dataKey="performanceRate"
                  fill="url(#performanceGradient)"
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="performanceRate" 
                  stroke="#6b7280"
                  strokeWidth={3}
                  dot={<CustomPerformanceDot />}
                  activeDot={<CustomPerformanceActiveDot />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Status Chart */}
      {processedStatusData.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">Status Over Time</h3>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Shows degradation from ideal status (0): UP resets to 0, -1 for DOWN
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">UP Operations</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600">DOWN Operations</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={processedStatusData}>
                <StatusGradient />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={Math.floor(processedStatusData.length / 10)}
                />
                <YAxis 
                  label={{ value: 'Status Value', angle: -90, position: 'insideLeft' }}
                  domain={sharedYDomain}
                  allowDecimals={false}
                  type="number"
                />
                <ReferenceLine y={0} stroke="#374151" strokeWidth={2} strokeDasharray="5 5" />
                <Area
                  type="monotone"
                  dataKey="statusValue"
                  fill="url(#statusGradient)"
                  fillOpacity={0.6}
                />
                <Tooltip content={<StatusTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="statusValue" 
                  stroke="#6b7280"
                  strokeWidth={3}
                  dot={<CustomStatusDot />}
                  activeDot={<CustomStatusActiveDot />}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChartsSection