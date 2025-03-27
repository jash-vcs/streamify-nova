
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import Index from "./pages/Index";
import Details from "./pages/Details";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/details/:mediaType/:id" element={<Index />} />
          <Route path="/watch/:mediaType/:id" element={<Watch />} />
          <Route path="/watch/:mediaType/:id/:seasonNumber/:episodeNumber" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/tv-shows" element={<Index />} />
          <Route path="/movies" element={<Index />} />
          <Route path="/latest" element={<Index />} />
          <Route path="/my-list" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
