import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useEffect } from "react";

// Get base path from Vite (automatically set for GitHub Pages)
const base = import.meta.env.BASE_URL || "/";
const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");

function Router() {
  const [location, setLocation] = useLocation();
  
  // Handle 404.html redirect format: /ruchi/?/path
  useEffect(() => {
    if (location.includes("/?/")) {
      const parts = location.split("/?/");
      if (parts.length === 2) {
        const newPath = normalizedBase + "/" + parts[1].replace(/~and~/g, "&");
        setLocation(newPath);
        return;
      }
    }
  }, [location, setLocation, normalizedBase]);
  
  // Get the actual route path by stripping base
  const routePath = normalizedBase && location.startsWith(normalizedBase)
    ? location.slice(normalizedBase.length) || "/"
    : location;
  
  // Match all possible root paths
  const rootPaths = [
    normalizedBase + "/",
    normalizedBase,
    "/"
  ].filter(Boolean);
  
  return (
    <Switch>
      {rootPaths.map(path => (
        <Route key={path} path={path} component={Home} />
      ))}
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
