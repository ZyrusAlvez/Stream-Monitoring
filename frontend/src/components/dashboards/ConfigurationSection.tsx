import type { Folder } from "../../api/folders"

interface Props {
  folderData: Folder | null
  nextCallTime: string | null
}

const formatInterval = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60

  return [
    h > 0 ? `${h}h` : "",
    m > 0 ? `${m}m` : "",
    s > 0 ? `${s}s` : "",
  ]
    .filter(Boolean)
    .join(" ") || "0s"
}

const formatDate = (time: string | null) => {
  if (!time) return "N/A"
  try {
    return new Date(time).toLocaleString()
  } catch {
    return time
  }
}

const formatCountdown = (nextCall: string | null) => {
  if (!nextCall) return "Loading..."
  const now = new Date()
  const next = new Date(nextCall)
  const diff = (next.getTime() - now.getTime()) / 1000 // seconds

  if (isNaN(diff)) return nextCall
  if (diff < 0) return "Past"
  if (diff < 5) return "Now"
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = Math.floor(diff % 60)
  return [
    h > 0 ? `${h}h` : "",
    m > 0 ? `${m}m` : "",
    s > 0 && h === 0 ? `${s}s` : "", // show seconds only if under 1 hour
  ]
    .filter(Boolean)
    .join(" ")
}

const ConfigurationSection = ({ folderData, nextCallTime }: Props) => {
  if (!folderData) return null

  return (
    <div className="bg-white p-3 rounded border text-sm grid grid-cols-4 gap-3 mb-4">
      <div>
        <div className="text-gray-500">Interval</div>
        <div className="font-semibold">
          {folderData.interval ? formatInterval(folderData.interval) : "N/A"}
        </div>
      </div>
      <div>
        <div className="text-gray-500">Repetitions</div>
        <div className="font-semibold">{folderData.repetition ?? "N/A"}</div>
      </div>
      <div>
        <div className="text-gray-500">Start Time</div>
        <div className="font-semibold">{formatDate(folderData.start_time)}</div>
      </div>
      <div>
        <div className="text-gray-500">Next Check In</div>
        <div className="font-semibold">{formatCountdown(nextCallTime)}</div>
      </div>
    </div>
  )
}

export default ConfigurationSection