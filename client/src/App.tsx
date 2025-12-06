import { Switch, Route, useLocation, BaseLocationHook } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useMemo } from "react";

// Get base path from Vite (automatically set for GitHub Pages)
const base = import.meta.env.BASE_URL || "/";
const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");

// Custom location hook that strips the base path for routing
function useBaseLocation(): [string, (path: string) => void] {
  const [location, setLocation] = useLocation();
  
  const baseLocation = useMemo(() => {
    if (!normalizedBase) return location;
    // Strip base path from location
    if (location.startsWith(normalizedBase)) {
      return location.slice(normalizedBase.length) || "/";
    }
    return location;
  }, [location]);
  
  const setBaseLocation = (path: string) => {
    const fullPath = normalizedBase ? normalizedBase + (path === "/" ? "" : path) : path;
    setLocation(fullPath);
  };
  
  return [baseLocation, setBaseLocation];
}

function Router() {
  return (
    <Switch hook={useBaseLocation as BaseLocationHook}>
      <Route path="/" component={Home} />
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
