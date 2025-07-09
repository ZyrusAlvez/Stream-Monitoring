import { FaFolder } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

type Props = {
  url: string
  name?: string
  folderId: string
}

const FolderButton = ({ url, name, folderId }: Props) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/dashboard/${folderId}`);
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <FaFolder className="w-6 h-6 text-blue-600" />
      <h3 className="font-bold text-lg truncate">{name || url}</h3>
    </div>
  )
}

export default FolderButton
