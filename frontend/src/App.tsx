import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Iptv from "./pages/IpTv";
import RadioGarden from "./pages/RadioGarden";
import TvGarden from "./pages/TvGarden";
import M3u8 from "./pages/M3u8";
import Youtube from "./pages/Youtube";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
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
    path: '/Dashboard/:folderId',
    element: <Dashboard />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
