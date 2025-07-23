import Header from "../layout/Header"
import BackgroundImage from "../layout/BackgroundImage"
import MenuButton from "../components/ui/MenuButton";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineDesktopComputer, 
  HiOutlineGlobeAlt,
  HiOutlineVideoCamera,
  HiOutlinePlay,
  HiOutlineLink,
  HiOutlineMusicNote,
  HiOutlineVolumeUp
} from 'react-icons/hi';
import { FaRadio } from 'react-icons/fa6';

const Info = () => {
  const navigate = useNavigate()
  const channelSources = [
    {
      name: "Tv.Garden",
      description: "Monitor global TV channels status",
      icon: HiOutlineDesktopComputer,
      path: "/Info/TvGarden",
    },
    {
      name: "IpTv-Org",
      description: "Check IPTV channel availability",
      icon: HiOutlineGlobeAlt,
      path: "/Info/Iptv",
    },
    {
      name: "Radio.Garden",
      description: "Monitor radio stations worldwide",
      icon: FaRadio,
      path: "/Info/RadioGarden",
    },
    {
      name: "YouTube Live",
      description: "Check YouTube live stream status",
      icon: HiOutlineVideoCamera,
      path: "/Info/Youtube",
    },
    {
      name: "YouTube Channel",
      description: "Show YouTube channel's live broadcast",
      icon: HiOutlinePlay,
      path: "/Info/YoutubeChannel",
    },
    {
      name: "M3U8 Stream",
      description: "Check M3U8 stream availability",
      icon: HiOutlineLink,
      path: "/Info/M3u8",
    },
    {
      name: "Kiss92.sg",
      description: "Monitor Singapore radio station",
      icon: HiOutlineMusicNote,
      path: "/Info/Kiss92",
    },
    {
      name: "MeListen.sg",
      description: "Check Singapore radio platform status",
      icon: HiOutlineVolumeUp,
      path: "/Info/MeListen",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Header />
      <BackgroundImage />
      
      {/* Main Content Container */}
      <div className="pt-24 px-6 flex flex-col items-center justify-center space-y-8 pb-12">
        
        {/* Source Selection Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-green-100 max-w-7xl w-full animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Want to Get the Correct Input Format?</h3>
            <p className="text-lg text-gray-600">Click on a specific source below to see examples and requirements</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {channelSources.map((source) => (
              <MenuButton
                key={source.path}
                icon={source.icon}
                description={source.description}
                onClick={() => navigate(source.path)}
                className="h-[200px]"
              >
                {source.name}
              </MenuButton>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Info