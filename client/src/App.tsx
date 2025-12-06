import { Switch, Route, useLocation, BaseLocationHook } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useCallback, useEffect } from "react";

// Get base path from Vite (automatically set for GitHub Pages)
const base = import.meta.env.BASE_URL || "/";
const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");

// Custom location hook that properly handles base path
function useBaseLocation(): [string, (to: string, replace?: boolean) => void] {
  const getLocation = useCallback(() => {
    let path = window.location.pathname;
    
    // Handle 404.html redirect format: /ruchi/?/path
    if (window.location.search.startsWith("?/")) {
      const queryPath = window.location.search.slice(2).replace(/~and~/g, "&");
      path = normalizedBase + "/" + queryPath;
    }
    
    // Strip base path if present
    if (normalizedBase && path.startsWith(normalizedBase)) {
      path = path.slice(normalizedBase.length) || "/";
    }
    
    return path;
  }, []);
  
  const [location, setLocation] = useLocation();
  
  // Update location when pathname changes (for 404.html redirects)
  useEffect(() => {
    const currentPath = getLocation();
    if (currentPath !== location) {
      setLocation(currentPath);
    }
  }, [getLocation, location, setLocation]);
  
  const setBaseLocation = useCallback((to: string, replace?: boolean) => {
    const fullPath = normalizedBase ? normalizedBase + (to === "/" ? "" : to) : to;
    if (replace) {
      window.history.replaceState(null, "", fullPath);
    } else {
      window.history.pushState(null, "", fullPath);
    }
    setLocation(to);
  }, [normalizedBase, setLocation]);
  
  const currentLocation = getLocation();
  
  return [currentLocation, setBaseLocation];
}

function Router() {
  // For now, always render Home to test if the app loads
  // We'll fix routing after confirming the base setup works
  return <Home />;
  
  // Uncomment below once we confirm the app loads
  // return (
  //   <Switch hook={useBaseLocation as BaseLocationHook}>
  //     <Route path="/" component={Home} />
  //     <Route component={NotFound} />
  //   </Switch>
  // );
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
