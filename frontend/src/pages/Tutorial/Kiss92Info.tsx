import Header from "../../layout/Header"
import BackgroundImage from "../../layout/BackgroundImage"

const Kiss92Info = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Header />
      <BackgroundImage />
      
      {/* Main Content Container */}
      <div className="pt-24 px-6 flex flex-col justify-center space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
          <h1 className="text-xl font-semibold mb-2">Kiss92 Stream Info</h1>
          <p>
            This doesn't require any input, as the website provides only one streaming source. <br />
            All we need to do is configure it according to our requirements.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Kiss92Info