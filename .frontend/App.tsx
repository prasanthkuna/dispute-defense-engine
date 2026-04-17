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
            *, *::before, *::after { box-sizing: border-box; }
            html, body, #root { height: 100%; margin: 0; padding: 0; }
            body { 
              background: var(--background); 
              color: var(--foreground); 
              font-family: var(--font-body);
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { background: var(--secondary); }
            ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
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
