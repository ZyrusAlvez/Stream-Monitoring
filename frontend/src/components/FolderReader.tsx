import React, { useEffect, useState } from "react";
import { FaSpinner, FaFolder, FaFolderOpen } from "react-icons/fa";
import { getAllFolder } from "../api/folders"
import type { Folder } from "../api/folders"
import FolderButton from "./FolderButton"

type FolderReaderProps = {
  type: string;
  refreshKey?: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>
};

const FolderReader = ({ type, refreshKey, setRefreshKey }: FolderReaderProps) => {
  const [ongoing, setOngoing] = useState<Folder[]>([]);
  const [finished, setFinished] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFolders = async () => {
      setLoading(true);
      const [ongoing, finished] = await Promise.all([
        getAllFolder(type, true),
        getAllFolder(type, false),
      ]);
      setOngoing(ongoing);
      setFinished(finished);
      setLoading(false);
    };

    loadFolders();
  }, [type, refreshKey]);

  if (loading) {
    return (
      <div className="h-full w-full max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Loading folders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Ongoing Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <FaFolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Ongoing</h2>
              <p className="text-sm text-gray-500">{ongoing.length} folder{ongoing.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {ongoing.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaFolder className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No ongoing folders</p>
                <p className="text-sm text-gray-400 mt-1">Folders will appear here when they're in progress</p>
              </div>
            ) : (
              ongoing.map((folder) => (
                <FolderButton 
                  key={folder.folder_id}
                  name={folder.name} 
                  url={folder.url} 
                  folderId={folder.folder_id} 
                  setRefreshKey={setRefreshKey}
                />
              ))
            )}
          </div>
        </div>

        {/* Finished Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <FaFolder className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Finished</h2>
              <p className="text-sm text-gray-500">{finished.length} folder{finished.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {finished.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaFolder className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No finished folders</p>
                <p className="text-sm text-gray-400 mt-1">Completed folders will appear here</p>
              </div>
            ) : (
              finished.map((folder) => (
                <FolderButton 
                  key={folder.folder_id}
                  name={folder.name} 
                  url={folder.url} 
                  folderId={folder.folder_id} 
                  setRefreshKey={setRefreshKey}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderReader;