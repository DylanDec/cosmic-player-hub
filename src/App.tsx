import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioProvider } from "@/context/AudioContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import MiniPlayer from "@/components/MiniPlayer";
import Index from "./pages/Index";
import RecentPage from "./pages/RecentPage";
import SchedulePage from "./pages/SchedulePage";
import ListenPage from "./pages/ListenPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AudioProvider>
        <BrowserRouter>
          <AnimatedBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recent" element={<RecentPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/listen" element={<ListenPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MiniPlayer />
        </BrowserRouter>
      </AudioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
