import Header from "../../layout/Header"
import BackgroundImage from "../../layout/BackgroundImage"

const M3u8Info = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Header />
      <BackgroundImage />
      
      {/* Main Content Container */}
      <div className="pt-24 px-6 flex flex-col justify-center space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
          <h1 className="text-xl font-semibold mb-2">M3U8 Stream Info</h1>
          <p>
            This works with any valid <code>.m3u8</code> link. <br />
            For easier access to a website’s <code>.m3u8</code> stream, consider using the browser extension{" "}
            <a href="https://fetchv.net/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              FetchV
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default M3u8Info