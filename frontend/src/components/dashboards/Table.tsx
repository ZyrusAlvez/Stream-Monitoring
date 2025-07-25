import React, { useState } from "react"
import type { Log, CustomSourceLogs } from "../../api/scraper"
import { supabaseUrl } from "../../config"

interface TableProps {
  logs: Log[] | CustomSourceLogs[]
  allowScreenshot?: boolean
}

const Table = ({ logs, allowScreenshot = false }: TableProps) => {
  const SUPABASE_URL = supabaseUrl
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget
    const nextElement = target.nextElementSibling as HTMLElement
    target.style.display = 'none'
    if (nextElement) {
      nextElement.style.display = 'block'
    }
  }

  return (
    <>
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
                <th className="py-3 px-4 text-left font-medium">Execution</th>
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

                  {allowScreenshot && e.status === "DOWN" && (
                    <tr>
                      <td colSpan={4} className="py-3 px-4 bg-gray-100 border-l-4 border-orange-500">
                        <div className="text-sm text-gray-700">
                          <strong>Screenshot:</strong>
                          <div className="mt-2">
                            <img 
                              src={`${SUPABASE_URL}/storage/v1/object/public/screenshots/${e.log_id}.png`}
                              alt={`Screenshot for log ${e.log_id}`}
                              className="max-w-xs h-auto rounded border shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                              onClick={() => handleImageClick(`${SUPABASE_URL}/storage/v1/object/public/screenshots/${e.log_id}.png`)}
                              onError={handleImageError}
                            />
                            <div 
                              className="text-xs text-gray-500 italic"
                              style={{ display: 'none' }}
                            >
                              Screenshot not available
                            </div>
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

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-8"
          onClick={closeModal}
        >
          <div className="relative w-[80%]">
            <img 
              src={selectedImage}
              alt="Enlarged screenshot"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default Table