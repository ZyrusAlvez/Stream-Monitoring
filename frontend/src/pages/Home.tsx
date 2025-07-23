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
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const channelSources: ChannelSource[] = [
    {
      name: "Tv.Garden",
      description: "Monitor global TV channels status",
      icon: HiOutlineDesktopComputer,
      path: "TvGarden",
    },
    {
      name: "IpTv-Org",
      description: "Check IPTV channel availability",
      icon: HiOutlineGlobeAlt,
      path: "Iptv",
    },
    {
      name: "Radio.Garden",
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
      name: "MeListen.sg",
      description: "Check Singapore radio platform status",
      icon: HiOutlineVolumeUp,
      path: "MeListen",
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Header />
      <BackgroundImage />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-4 w-[80%]">
            Automated Health Check System for Streaming Platforms
            </h1>
          </div>
        </div>
        
        {/* Channel Sources Grid */}
        <div className="w-full max-w-7xl mb-8">
          <h2 className="text-lg text-gray-600 text-center mb-4">
            Select Channel Source to Monitor
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
                >
                  {source.name}
                </MenuButton>
              </div>
            ))}
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default Home;