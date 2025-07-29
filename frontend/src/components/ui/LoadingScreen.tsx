const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center py-12 h-screen">
    <div className="w-8 h-8 border-4 border-[#008037] border-t-transparent rounded-full animate-spin mb-4"></div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading...</h3>
    <p className="text-gray-500 text-center">
      Authenticating...
    </p>
  </div>
);

export default LoadingScreen;