import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MinhaConta from "./pages/MinhaConta";
import Historico from "./pages/Historico";
import Deposito from "./pages/Deposito";
import Saque from "./pages/Saque";
import NotFound from "./pages/NotFound";
import './styles/themes.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/deposito" element={<Deposito />} />
          <Route path="/saque" element={<Saque />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
