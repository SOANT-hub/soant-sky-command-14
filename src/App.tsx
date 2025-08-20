
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import FlightDashboard from "./pages/FlightDashboard";
import ProjectDashboard from "./pages/ProjectDashboard";
import EquipmentDashboard from "./pages/EquipmentDashboard";
import PilotDashboard from "./pages/PilotDashboard";
import TaskDashboard from "./pages/TaskDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <AppLayout>
            <Routes>
              <Route path="/" element={<FlightDashboard />} />
              <Route path="/flights" element={<FlightDashboard />} />
              <Route path="/projects" element={<ProjectDashboard />} />
              <Route path="/equipments" element={<EquipmentDashboard />} />
              <Route path="/pilots" element={<PilotDashboard />} />
              <Route path="/tasks" element={<TaskDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
