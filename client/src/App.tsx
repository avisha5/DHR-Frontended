import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Vitals from "@/pages/vitals";
import Medications from "@/pages/medications";
import Symptoms from "@/pages/symptoms";
import Records from "@/pages/records";
import Share from "@/pages/share";
import Profile from "@/pages/profile";
import DoctorView from "@/pages/doctor-view";
import AppLayout from "@/components/layout/app-layout";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/share/:token" component={DoctorView} />
      <ProtectedRoute path="/" component={() => (
        <AppLayout>
          <Dashboard />
        </AppLayout>
      )} />
      <ProtectedRoute path="/vitals" component={() => (
        <AppLayout>
          <Vitals />
        </AppLayout>
      )} />
      <ProtectedRoute path="/medications" component={() => (
        <AppLayout>
          <Medications />
        </AppLayout>
      )} />
      <ProtectedRoute path="/symptoms" component={() => (
        <AppLayout>
          <Symptoms />
        </AppLayout>
      )} />
      <ProtectedRoute path="/records" component={() => (
        <AppLayout>
          <Records />
        </AppLayout>
      )} />
      <ProtectedRoute path="/share" component={() => (
        <AppLayout>
          <Share />
        </AppLayout>
      )} />
      <ProtectedRoute path="/profile" component={() => (
        <AppLayout>
          <Profile />
        </AppLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

