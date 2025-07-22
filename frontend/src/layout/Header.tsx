import { useState, useEffect } from 'react';
import MediaTrackLogo from "../components/ui/MediaTrackLogo";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <header className={`flex h-[80px] w-full items-center fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100' 
          : 'bg-white/80 backdrop-blur-sm border-b border-green-100'
      }`}>
        <div className="flex items-center justify-between w-full px-6">
          {/* Logo Section */}
          <div className="flex items-center">
            <MediaTrackLogo width={100} className=""/>
            <div className="hidden sm:block ml-4 pl-4 border-l-2 border-gray-300">
              <span className="text-sm text-gray-600">Web Scraping</span>
            </div>
          </div>
        </div>
      </header>         
    </>
  );
};

export default Header;