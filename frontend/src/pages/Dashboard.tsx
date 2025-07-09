import { useParams } from "react-router-dom"

const Dashboard = () => {
  const { folderId } = useParams<{ folderId?: string }>();

  return (
    <div>{folderId}</div>
  )
}

export default Dashboard