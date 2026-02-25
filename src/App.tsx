import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import MomentIntake from "./pages/MomentIntake";
import Analysis from "./pages/Analysis";
import Results from "./pages/Results";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Barbers from "./pages/Barbers";
import BarberDetail from "./pages/BarberDetail";
import Favorites from "./pages/Favorites";
import VirtualTryOn from "./pages/VirtualTryOn";
import Wardrobe from "./pages/Wardrobe";
import WardrobeAdd from "./pages/WardrobeAdd";
import Today from "./pages/Today";
import Outfits from "./pages/Outfits";
import LookAnalysis from "./pages/LookAnalysis";
import LookResult from "./pages/LookResult";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/moment-intake/:type" element={<MomentIntake />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/barbers" element={<Barbers />} />
            <Route path="/barbers/:id" element={<BarberDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/try-on" element={<VirtualTryOn />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/wardrobe/add" element={<WardrobeAdd />} />
            <Route path="/today" element={<Today />} />
            <Route path="/outfits" element={<Outfits />} />
            <Route path="/look-analysis" element={<LookAnalysis />} />
            <Route path="/look-result/:id" element={<LookResult />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;