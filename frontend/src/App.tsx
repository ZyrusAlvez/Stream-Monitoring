import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Iptv from "./pages/IpTv";
import RadioGarden from "./pages/RadioGarden";
import TvGarden from "./pages/TvGarden";
import M3u8 from "./pages/M3u8";
import Youtube from "./pages/Youtube";
import YoutubeChannel from "./pages/YoutubeChannel";
import MeListen from "./pages/MeListen";
import CustomSource from "./pages/CustomSource";
import Dashboard from "./pages/Dashboard";
import YoutubeChannelDashboard from "./pages/YoutubeChannelDashboard"
import NotFound from "./pages/NotFound";

import TvGardenInfo from "./pages/Tutorial/TvGardenInfo";
import IpTvInfo from "./pages/Tutorial/IpTvInfo";
import RadioGardenInfo from "./pages/Tutorial/RadioGarden";
import YoutubeInfo from "./pages/Tutorial/YoutubeInfo";
import YoutubeChannelInfo from "./pages/Tutorial/YoutubeChannel";
import M3u8Info from "./pages/Tutorial/M3u8";
import Kiss92Info from "./pages/Tutorial/Kiss92Info";
import MeListenInfo from "./pages/Tutorial/MeListen";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/info',
    element: <Info />
  },
  {
    path: '/Iptv',
    element: <Iptv />
  },
  {
    path: '/TvGarden',
    element: <TvGarden />
  },
  {
    path: '/RadioGarden',
    element: <RadioGarden />
  },
  {
    path: '/M3u8',
    element: <M3u8 />
  },
  {
    path: '/Youtube',
    element: <Youtube />
  },
  {
    path: '/YoutubeChannel',
    element: <YoutubeChannel />
  },
  {
    path: '/Melisten',
    element: <MeListen />
  },
  {
    path: '/kiss92',
    element: <CustomSource title="Kiss92 Web Source" url="https://www.kiss92.sg/shows/" type="kiss92"/>
  },
  {
    path: '/Dashboard/:folderId',
    element: <Dashboard />
  },
  {
    path: '/YTchannelDashboard/:folderId',
    element: <YoutubeChannelDashboard />
  },
  {
    path: '*',
    element: <NotFound />
  },
  {
    path: '/Info/TvGarden',
    element: <TvGardenInfo />
  },
  {
    path: '/Info/Iptv',
    element: <IpTvInfo />
  },
  {
    path: '/Info/RadioGarden',
    element: <RadioGardenInfo />
  },
  {
    path: '/Info/Youtube',
    element: <YoutubeInfo />
  },
  {
    path: '/Info/YoutubeChannel',
    element: <YoutubeChannelInfo />
  },
  {
    path: '/Info/M3u8',
    element: <M3u8Info />
  },
  {
    path: '/Info/Kiss92',
    element: <Kiss92Info />
  },
  {
    path: '/Info/MeListen',
    element: <MeListenInfo />
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;