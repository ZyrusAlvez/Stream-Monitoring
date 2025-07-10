import { useParams } from "react-router-dom"
import { getLogs } from "../api/scraper"
import { useState, useEffect } from "react"
import type { Folder } from "../api/folders"
import { getFolderById } from "../api/folders"

const Dashboard = () => {
  const { folderId } = useParams<{ folderId?: string }>()
  const [logs, setLogs] = useState<any[]>([])
  const [folderData, setFolderData] = useState<Folder | null>(null)

  useEffect(() => {
    if (!folderId) return

    getFolderById(folderId)
      .then((data) => {
        setFolderData(data)
        getLogs(folderId)
        .then((data) => {
          setLogs(data)
        })

      })
      .catch((error) => {
        console.error(error)
      })
  }, [folderId])  

  return (
    <div className="p-4">
      <h2 className="text-[#008037] text-2xl font-bold mb-4">{folderData?.name}</h2>
      <a className="text-blue-600 text-lg font-medium underline hover:text-blue-800 break-all" href={folderData?.url} target="_blank" rel="noopener noreferrer">
        {folderData?.url?.replace(/^https?:\/\//, "")}
      </a>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-[#008037] text-white">
            <tr>
              <th className="py-2 px-4 border">Timestamp</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((e, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="py-2 px-4 border">{e.timestamp}</td>
                <td className="py-2 px-4 border">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard