import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Settings from "./pages/Settings";
import Iptv from "./pages/Scraper/IpTv";
import RadioGarden from "./pages/Scraper/RadioGarden";
import TvGarden from "./pages/Scraper/TvGarden";
import M3u8 from "./pages/Scraper/M3u8";
import Youtube from "./pages/Scraper/Youtube";
import YoutubeChannel from "./pages/Scraper/YoutubeChannel";
import MeListen from "./pages/Scraper/MeListen";
import CustomSource from "./pages/Scraper/CustomSource";
import Dashboard from "./pages/Dashboard/Dashboard";
import YoutubeChannelDashboard from "./pages/Dashboard/YoutubeChannelDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { SessionProvider } from "./context/SessionContext";

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
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/info',
    element: <ProtectedRoute><Info /></ProtectedRoute>
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>
  },
  {
    path: '/Iptv',
    element: <ProtectedRoute><Iptv /></ProtectedRoute>
  },
  {
    path: '/TvGarden',
    element: <ProtectedRoute><TvGarden /></ProtectedRoute>
  },
  {
    path: '/RadioGarden',
    element: <ProtectedRoute><RadioGarden /></ProtectedRoute>
  },
  {
    path: '/M3u8',
    element: <ProtectedRoute><M3u8 /></ProtectedRoute>
  },
  {
    path: '/Youtube',
    element: <ProtectedRoute><Youtube /></ProtectedRoute>
  },
  {
    path: '/YoutubeChannel',
    element: <ProtectedRoute><YoutubeChannel /></ProtectedRoute>
  },
  {
    path: '/Melisten',
    element: <ProtectedRoute><MeListen /></ProtectedRoute>
  },
  {
    path: '/kiss92',
    element: <ProtectedRoute><CustomSource title="Kiss92 Web Source" url="https://www.kiss92.sg/shows/" type="kiss92"/></ProtectedRoute>
  },
  {
    path: '/Dashboard/:folderId',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: '/YTchannelDashboard/:folderId',
    element: <ProtectedRoute><YoutubeChannelDashboard /></ProtectedRoute>
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
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  )
}

export default App;