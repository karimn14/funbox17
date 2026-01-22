import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MeetingList from "@/pages/MeetingList";
import MeetingDetail from "@/pages/MeetingDetail";
import ModuleDetail from "@/pages/ModuleDetail";
import Quiz from "@/pages/Quiz";
import History from "@/pages/History";
import Admin from "@/pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      
      {/* New sequential flow routes */}
      <Route path="/module/:id/meetings" component={MeetingList} />
      <Route path="/module/:id/meeting/:meetingId" component={MeetingDetail} />
      
      {/* Legacy routes for backward compatibility */}
      <Route path="/module/:id" component={ModuleDetail} />
      <Route path="/module/:id/quiz" component={Quiz} />
      
      <Route path="/history" component={History} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
