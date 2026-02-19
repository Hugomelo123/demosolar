import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "./layout";
import Dashboard from "@/pages/dashboard";
import QuotePage from "@/pages/quote";
import ProjectDetails from "@/pages/project-details";
import InstallChecklistPage from "@/pages/install-checklist";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/quote" component={QuotePage} />
        <Route path="/projects/:id" component={ProjectDetails} />
        <Route path="/install/:id" component={InstallChecklistPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
