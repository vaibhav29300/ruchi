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
  // Get current location from window
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
    
    // Ensure path starts with /
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    
    return path;
  }, []);
  
  const [location, setLocation] = useLocation();
  const currentLocation = getLocation();
  
  // Sync location if it doesn't match
  useEffect(() => {
    if (currentLocation !== location) {
      setLocation(currentLocation);
    }
  }, [currentLocation, location, setLocation]);
  
  const setBaseLocation = useCallback((to: string, replace?: boolean) => {
    // Ensure to starts with /
    const normalizedTo = to.startsWith("/") ? to : "/" + to;
    const fullPath = normalizedBase ? normalizedBase + normalizedTo : normalizedTo;
    
    if (replace) {
      window.history.replaceState(null, "", fullPath);
    } else {
      window.history.pushState(null, "", fullPath);
    }
    setLocation(normalizedTo);
  }, [normalizedBase, setLocation]);
  
  return [currentLocation, setBaseLocation];
}

function Router() {
  // Since this is a single-page app, always render Home
  // The custom location hook handles base path for any future routes
  const [location] = useBaseLocation();
  
  // For now, always show Home since we only have one page
  // This avoids routing issues on GitHub Pages
  return <Home />;
  
  // Uncomment below if you add more routes later:
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
