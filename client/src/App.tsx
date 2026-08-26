import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ChecklistGenerator from "./pages/ChecklistGenerator";
import DocumentExplainer from "./pages/DocumentExplainer";
import DeadlineReminders from "./pages/DeadlineReminders";

/**
 * Design Philosophy: Minimalistisches Vertrauens-Design
 * - Behördenblau (#1E40AF) für Vertrauen und Professionalität
 * - Playfair Display für Überschriften (Autorität)
 * - Inter für Body-Text (Lesbarkeit)
 * - Asymmetrisches 3-Spalten-Layout mit Sidebar
 * - Schnelle, subtile Animationen (150-200ms)
 */

function Router() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <WouterRouter base={basePath}>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/checklist-generator"} component={ChecklistGenerator} />
      <Route path={"/document-explainer"} component={DocumentExplainer} />
      <Route path={"/deadline-reminders"} component={DeadlineReminders} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
