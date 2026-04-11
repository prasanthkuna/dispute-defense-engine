import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import InboxPage from "./pages/InboxPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import SimulationPage from "./pages/SimulationPage";
import { RoleContext, useRoleState } from "./hooks/useRole";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5000 } },
});

export default function App() {
  const roleState = useRoleState();

  return (
    <QueryClientProvider client={queryClient}>
      <RoleContext.Provider value={roleState}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
            *, *::before, *::after { box-sizing: border-box; }
            html, body, #root { height: 100%; margin: 0; padding: 0; }
            body { background: #0A0C10; color: #E8EAF0; font-family: 'Inter', sans-serif; }
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: #111318; }
            ::-webkit-scrollbar-thumb { background: #2A2D36; border-radius: 3px; }
          `}</style>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<InboxPage />} />
              <Route path="cases/:id" element={<CaseDetailPage />} />
              <Route path="simulation" element={<SimulationPage />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </RoleContext.Provider>
    </QueryClientProvider>
  );
}
