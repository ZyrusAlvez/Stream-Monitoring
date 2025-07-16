import { useNavigate } from "react-router-dom"
import BackgroundImage from "../layout/BackgroundImage"

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <BackgroundImage />
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border">
          {/* 404 Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <svg 
                className="w-10 h-10 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.083 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-[#008037] mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          </div>

          {/* Message */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">
                <strong>What you can do:</strong>
              </p>
              <ul className="text-sm text-gray-500 mt-2 space-y-1">
                <li>• Check if the URL is correct</li>
                <li>• Go back to the previous page</li>
                <li>• Visit our homepage</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 bg-[#008037] text-white px-6 py-3 rounded-lg hover:bg-[#006b2f] transition-colors duration-200 font-medium"
            >
              Go Home
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Still having trouble? 
              <a 
                href="#" 
                className="text-[#008037] hover:text-[#006b2f] font-medium ml-1"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound