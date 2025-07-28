import Header from "../layout/Header"
import BackgroundImage from "../layout/BackgroundImage"
import ChangePassword from "../components/settings/ChangePassword"

const Settings = () => {
  return (
    <div>
      <BackgroundImage />
      <Header />
      <div className="flex flex-col p-4">
        <ChangePassword />
      </div>
    </div>
  )
}

export default Settings