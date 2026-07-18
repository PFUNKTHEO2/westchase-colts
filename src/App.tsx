import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/lib/cart";
import Index from "./pages/Index";
import Roster from "./pages/Roster";
import CardPreview from "./pages/CardPreview";
import CreateCard from "./pages/CreateCard";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import SponsorPage from "./pages/SponsorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/roster" element={<Roster />} />
              <Route path="/create-card" element={<CreateCard />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/card-preview/:cardId" element={<CardPreview />} />
              <Route path="/sponsor/:sponsorSlug" element={<SponsorPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
