import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import Home from "./pages/Home";
import Phase1Upload from "./pages/Phase1Upload";
import Phase2KI from "./pages/Phase2KI";
import Phase3Quiz from "./pages/Phase3Quiz";
import Phase4Strategien from "./pages/Phase4Strategien";
import Phase5Reflexion from "./pages/Phase5Reflexion";
import LehrerView from "./pages/LehrerView";
import Sessions from "./pages/Sessions";
import PrintView from "./pages/PrintView";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/phase/1" component={Phase1Upload} />
      <Route path="/phase/2" component={Phase2KI} />
      <Route path="/phase/3" component={Phase3Quiz} />
      <Route path="/phase/4" component={Phase4Strategien} />
      <Route path="/phase/5" component={Phase5Reflexion} />
      <Route path="/lehrer" component={LehrerView} />
      <Route path="/sessions" component={Sessions} />
      <Route path="/print" component={PrintView} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
