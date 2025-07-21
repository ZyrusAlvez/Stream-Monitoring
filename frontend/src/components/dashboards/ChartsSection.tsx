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

interface ChartsSectionProps {
  performanceData: PerformancePoint[]
  statusData: StatusPoint[]
}

const ChartsSection = ({ performanceData, statusData }: ChartsSectionProps) => {
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
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Rate Chart */}
      {performanceData.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">Performance Rate Over Time</h3>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Shows degradation from ideal performance (0): +1 for success, -1 for error, capped at 0
              </p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={Math.floor(performanceData.length / 10)}
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
      {statusData.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-800">Status Rate Over Time</h3>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Shows degradation from ideal status (0): +1 for UP, -1 for DOWN, capped at 0
              </p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={Math.floor(statusData.length / 10)}
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
  )
}

export default ChartsSection