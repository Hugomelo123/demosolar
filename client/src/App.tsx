import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "./layout";
import { ProjectsProvider } from "./components/Providers";

const LandingPage = React.lazy(() => import("@/pages/landing"));
const WorkerPage = React.lazy(() => import("@/pages/worker"));
const Dashboard = React.lazy(() => import("@/pages/dashboard"));
const QuotePage = React.lazy(() => import("@/pages/quote"));
const ProjectDetails = React.lazy(() => import("@/pages/project-details"));
const InstallChecklistPage = React.lazy(() => import("@/pages/install-checklist"));
const AnalyticsPage = React.lazy(() => import("@/pages/analytics"));
const ExecutivePage = React.lazy(() => import("@/pages/executive"));
const TeamPage = React.lazy(() => import("@/pages/team"));
const SettingsPage = React.lazy(() => import("@/pages/settings"));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[320px] animate-in fade-in duration-200">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Suspense fallback={<PageFallback />}>
          <LandingPage />
        </Suspense>
      </Route>
      <Route path="/worker">
        <ProjectsProvider>
          <Suspense fallback={<PageFallback />}>
            <WorkerPage />
          </Suspense>
        </ProjectsProvider>
      </Route>
      <Route>
        <Layout>
          <Suspense fallback={<PageFallback />}>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/executive" component={ExecutivePage} />
              <Route path="/team" component={TeamPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/quote" component={QuotePage} />
              <Route path="/projects/:id" component={ProjectDetails} />
              <Route path="/install/:id" component={InstallChecklistPage} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Layout>
      </Route>
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
