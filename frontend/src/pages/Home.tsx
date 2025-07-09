import Button from "../components/ui/Button"
import BackgroundImage from "../layout/BackgroundImage"
import Header from "../layout/Header"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <Header />
      <h1 className="text-5xl font-bold my-8">Choose a Channel Source</h1>
      <div className="flex gap-4 my-8">
        <Button onClick={() => navigate("TvGarden")}>tv.garden</Button>
        <Button onClick={() => navigate("Iptv")}>iptv-org</Button>
        <Button onClick={() => navigate("RadioGarden")}>radio.garden</Button>
      </div>
      <BackgroundImage />
    </div>
  )
}

export default Home