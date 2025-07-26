import React, { useState } from "react"
import type { YoutubeChannelLog } from "../../api/scraper"

type ResultItem = {
  title: string
  url: string
}

interface LogsTableProps {
  logs: YoutubeChannelLog[]
  itemsPerPage?: number
}

const TableYT = ({ logs, itemsPerPage = 20 }: LogsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(logs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = logs.slice(startIndex, endIndex)

  const toggleRowExpansion = (logId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedRows(newExpanded)
  }

  const parseResults = (results: any): ResultItem[] => {
    if (!results) return []
    
    try {
      if (typeof results === 'string') {
        return JSON.parse(results)
      }
      if (Array.isArray(results)) {
        return results
      }
      return []
    } catch (error) {
      console.error('Error parsing results:', error)
      return []
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Clear expanded rows when changing pages
    setExpandedRows(new Set())
  }

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
    setExpandedRows(new Set())
  }

  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
    setExpandedRows(new Set())
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) {
          pageNumbers.push('...')
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...')
        }
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Detailed Logs</h3>
        <p className="text-sm text-gray-600 mt-1">
          Showing {startIndex + 1}-{Math.min(endIndex, logs.length)} of {logs.length} entries
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-medium">#</th>
              <th className="py-3 px-4 text-left font-medium">Timestamp</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-left font-medium">Execution</th>
              <th className="py-3 px-4 text-left font-medium">Live Videos Found</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentLogs.map((e, i) => {
              const liveVideos = parseResults(e.results)
              const isExpanded = expandedRows.has(e.log_id)
              
              return (
                <React.Fragment key={e.log_id}>
                  <tr className={`${e.error ? "bg-red-50" : i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="py-3 px-4 text-sm text-gray-600">{startIndex + i + 1}</td>
                    <td className="py-3 px-4 text-sm truncate" title={new Date(e.timestamp).toLocaleString()}>
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        e.status === 'UP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {e.status}
                      </span>
                    </td>
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
                    <td className="py-3 px-4 text-sm">
                      {liveVideos.length > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {liveVideos.length} video{liveVideos.length !== 1 ? 's' : ''}
                            </span>
                            <button
                              onClick={() => toggleRowExpansion(e.log_id)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              {isExpanded ? 'Hide' : 'Show'} Details
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">No live videos</span>
                      )}
                    </td>
                  </tr>

                  {/* Live Videos Expansion */}
                  {isExpanded && liveVideos.length > 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 px-8 bg-blue-50 border-l-4 border-blue-500">
                        <div className="text-sm">
                          <strong className="text-blue-800 text-lg">Live Videos Found:</strong>
                          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {liveVideos.map((video, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-lg border shadow-sm">
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline font-medium block text-base"
                                  title={video.title}
                                >
                                  {video.title}
                                </a>
                                <p className="text-sm text-gray-500 mt-2 break-all">
                                  {video.url}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Error Details */}
                  {e.error && (
                    <tr>
                      <td colSpan={5} className="py-3 px-4 bg-red-100 border-l-4 border-red-500">
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
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {getPageNumbers().map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === '...' ? (
                    <span className="px-3 py-1 text-sm text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => goToPage(pageNum as number)}
                      className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-green-700 text-white border-green-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableYT