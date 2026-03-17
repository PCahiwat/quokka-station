import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BedrockProvider from "@/providers/BedrockProvider";
import Home from "@/pages/home";
import AuthCallback from "@/pages/auth-callback";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth/callback" component={AuthCallback} />
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
        <BedrockProvider>
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </BedrockProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
