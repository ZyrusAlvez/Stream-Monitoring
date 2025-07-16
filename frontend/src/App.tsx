import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Iptv from "./pages/Iptv";
import RadioGarden from "./pages/RadioGarden";
import TvGarden from "./pages/Tvgarden";
import M3u8 from "./pages/M3u8";
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
