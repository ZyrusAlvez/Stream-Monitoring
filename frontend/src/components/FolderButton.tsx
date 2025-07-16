import React, { useState } from 'react'
import { FaFolder, FaTrash, FaExclamationTriangle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { deleteFolderById } from '../api/folders'
import { toast } from "sonner";
import { isYouTubeChannelUrl } from '../utils/validator';

type Props = {
  url: string
  name?: string
  folderId: string
  onDelete?: () => void
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>
}

const FolderButton = ({ url, name, folderId, onDelete, setRefreshKey }: Props) => {
  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClick = () => {
    if (!showConfirmation) {
      if (isYouTubeChannelUrl(url)){
        navigate(`/YTchannelDashboard/${folderId}`)
      }else{
        navigate(`/dashboard/${folderId}`)
      }


    }
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setShowConfirmation(true)
  }

  const handleConfirmDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setIsDeleting(true)
    
    try {
      const success = await deleteFolderById(folderId)
      if (success) {
        toast.success(`Folder "${name || url}" deleted successfully`)
        if (onDelete) onDelete()
        setRefreshKey((prev) => prev + 1)
      } else {
        toast.error('Failed to delete folder')
      }
    } catch (error) {
      toast.error('An error occurred while deleting the folder')
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  const handleCancelDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setShowConfirmation(false)
  }

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
          showConfirmation
            ? 'border-red-200 bg-red-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <FaFolder className="w-7 h-7 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg text-gray-800 truncate">
              {name || url}
            </h3>
            <p className="text-sm text-gray-500 truncate">{url}</p>
          </div>
        </div>

        {!showConfirmation ? (
          <button
            onClick={handleDeleteClick}
            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
            title="Delete folder"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-red-600">
              <FaExclamationTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Delete folder?</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  isDeleting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FolderButton