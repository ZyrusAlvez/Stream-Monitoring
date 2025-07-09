import { useEffect, useState } from "react";
import { fetchFolders } from "../api/folders"
import type { Folder } from "../api/folders"
import FolderButton from "./FolderButton"

type FolderReaderProps = {
  type: string;
  refreshKey?: number;
};

const FolderReader = ({ type, refreshKey }: FolderReaderProps) => {
  const [ongoing, setOngoing] = useState<Folder[]>([]);
  const [finished, setFinished] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFolders = async () => {
      setLoading(true);
      const [ongoing, finished] = await Promise.all([
        fetchFolders(type, true),
        fetchFolders(type, false),
      ]);
      setOngoing(ongoing);
      setFinished(finished);
      setLoading(false);
    };

    loadFolders();
  }, [type, refreshKey]); // <- trigger reload on refreshKey

  return (
    <div className="border-2 border-dashed w-[95%] h-full my-4 flex justify-between rounded-2xl border-gray-400 p-4 overflow-auto space-y-4 bg-gray-50">
      {loading ? (
        <p className="text-sm italic">Loading...</p>
      ) : (
        <>
          <div className="w-1/2">
            <h2 className="font-bold text-lg">Ongoing</h2>
            {ongoing.map((folder) => (
              <div key={folder.folder_id}>
                <FolderButton name={folder.name} url={folder.url} folderId={folder.folder_id} />
              </div>
            ))}
          </div>

          <div className="w-1/2">
            <h2 className="font-bold text-lg">Finished</h2>
            {finished.map((folder) => (
              <div key={folder.folder_id}>
                <FolderButton name={folder.name} url={folder.url} folderId={folder.folder_id} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FolderReader;
