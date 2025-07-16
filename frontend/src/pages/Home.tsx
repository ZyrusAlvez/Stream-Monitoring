import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineDesktopComputer, 
  HiOutlineGlobeAlt, 
  HiOutlineVideoCamera, 
  HiOutlineLink, 
  HiOutlineMusicNote,
  HiOutlineVolumeUp,
  HiOutlinePlay,
  HiOutlineStatusOnline
} from 'react-icons/hi';
import { FaRadio } from "react-icons/fa6";
import MenuButton from "../components/ui/MenuButton";
import BackgroundImage from "../layout/BackgroundImage";
import Header from "../layout/Header";

interface ChannelSource {
  name: string;
  description: string;
  icon: any;
  path: string;
  howToUse?: string;
  howItWorks?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const channelSources: ChannelSource[] = [
    {
      name: "tv.garden",
      description: "Monitor global TV channels status",
      icon: HiOutlineDesktopComputer,
      path: "TvGarden",
    },
    {
      name: "iptv-org",
      description: "Check IPTV channel availability",
      icon: HiOutlineGlobeAlt,
      path: "Iptv",
    },
    {
      name: "radio.garden",
      description: "Monitor radio stations worldwide",
      icon: FaRadio,
      path: "RadioGarden",
    },
    {
      name: "YouTube Live",
      description: "Check YouTube live stream status",
      icon: HiOutlineVideoCamera,
      path: "Youtube",
    },
    {
      name: "YouTube Channel",
      description: "Show YouTube channel's live broadcast",
      icon: HiOutlinePlay,
      path: "YoutubeChannel",
    },
    {
      name: "M3U8 Stream",
      description: "Check M3U8 stream availability",
      icon: HiOutlineLink,
      path: "M3u8",
    },
    {
      name: "Kiss92.sg",
      description: "Monitor Singapore radio station",
      icon: HiOutlineMusicNote,
      path: "Kiss92",
    },
    {
      name: "MeListener.sg",
      description: "Check Singapore radio platform status",
      icon: HiOutlineVolumeUp,
      path: "MeListener",
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleHowToUse = (source: ChannelSource) => {
    // Navigate to how-to-use page with source info
    navigate('/how-to-use', { state: { source } });
  };

  const handleHowItWorks = (source: ChannelSource) => {
    // Navigate to how-it-works page with source info
    navigate('/how-it-works', { state: { source } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Header />
      <BackgroundImage />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">
            Automated Health Check System for Streaming Platforms
            </h1>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How it works:</h3>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Step 1</span>
                <span>Choose a channel source below</span>
              </div>
              <div className="hidden lg:block text-green-400">→</div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Step 2</span>
                <span>Enter URL & configure monitoring</span>
              </div>
              <div className="hidden lg:block text-green-400">→</div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">Step 3</span>
                <span>View real-time dashboard & analytics</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Set monitoring intervals, repetitions, and get detailed reports with uptime analytics
            </div>
          </div>
        </div>
        
        {/* Channel Sources Grid */}
        <div className="w-full max-w-7xl mb-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Select Channel Source to Monitor
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {channelSources.map((source, index) => (
              <div
                key={source.name}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <MenuButton
                  onClick={() => handleNavigation(source.path)}
                  icon={source.icon}
                  description={source.description}
                  className="w-full h-full"
                  onHowToUse={() => handleHowToUse(source)}
                  onHowItWorks={() => handleHowItWorks(source)}
                >
                  {source.name}
                </MenuButton>
              </div>
            ))}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-green-100 max-w-5xl w-full mb-8 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <HiOutlineStatusOnline className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Automated Monitoring</h3>
              <p className="text-sm text-gray-600">Set custom intervals and repetitions for continuous monitoring</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <HiOutlineGlobeAlt className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multiple Sources</h3>
              <p className="text-sm text-gray-600">Support for TV, radio, YouTube, and streaming platforms</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <HiOutlinePlay className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Real-time Dashboard</h3>
              <p className="text-sm text-gray-600">Live analytics with uptime percentages and error tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-3 rounded-full mb-3">
                <HiOutlineDesktopComputer className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Export Reports</h3>
              <p className="text-sm text-gray-600">Download detailed CSV/JSON reports with performance data</p>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="text-center max-w-3xl animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>What you can monitor:</strong> URLs will be checked at your specified intervals (default: every hour for 24 repetitions)
            </p>
            <p className="text-xs text-gray-500">
              Get detailed analytics including uptime percentages, error rates, performance charts, and export comprehensive reports
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Need help? Hover over any channel source and click the question mark (?) for usage instructions or the gear icon for technical details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;