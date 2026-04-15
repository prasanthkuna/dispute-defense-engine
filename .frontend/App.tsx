import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import InboxPage from "./pages/InboxPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import DashboardPage from "./pages/DashboardPage";
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
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
            *, *::before, *::after { box-sizing: border-box; }
            html, body, #root { height: 100%; margin: 0; padding: 0; }
            body { background: #050505; color: #F1F4F9; font-family: 'Inter', sans-serif; }
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { background: #08090C; }
            ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 2px; }
          `}</style>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="ledger" element={<InboxPage />} />
              <Route path="cases/:id" element={<CaseDetailPage />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </RoleContext.Provider>
    </QueryClientProvider>
  );
}
