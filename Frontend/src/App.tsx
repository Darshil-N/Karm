import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Firebase connection test
import "./lib/firebaseTest";

// Public Pages
import Landing from "./pages/Landing";
import SignupHub from "./pages/SignupHub";
import CollegeSignup from "./pages/CollegeSignup";
import UserSignup from "./pages/UserSignup";
import AuthoritySignup from "./pages/AuthoritySignup";
import Login from "./pages/Login";
import PendingVerification from "./pages/PendingVerification";
import PendingApproval from "./pages/PendingApproval";

// Dashboard Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import TPODashboard from "./pages/tpo/TPODashboard";
import Dashboard from "./pages/tpo/Dashboard";
import ManageDrives from "./pages/tpo/ManageDrives";
import Companies from "./pages/tpo/Companies";
import Students from "./pages/tpo/Students";
import Reports from "./pages/tpo/Reports";
import HODDashboard from "./pages/hod/HODDashboard";
import AdminVerify from "./pages/admin/AdminVerify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup-hub" element={<SignupHub />} />
            <Route path="/signup/college" element={<CollegeSignup />} />
            <Route path="/signup/user" element={<UserSignup />} />
            <Route path="/authority-signup" element={<AuthoritySignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pending-verification" element={<PendingVerification />} />
            <Route path="/pending-approval" element={<PendingApproval />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentDashboard />} />
            <Route path="/student/drives" element={<StudentDashboard />} />
            <Route path="/student/ai-resume" element={<StudentDashboard />} />
            <Route path="/student/ai-interview" element={<StudentDashboard />} />
            <Route path="/student/results" element={<StudentDashboard />} />

            {/* TPO Routes */}
            <Route path="/tpo" element={<TPODashboard />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="drives" element={<ManageDrives />} />
              <Route path="companies" element={<Companies />} />
              <Route path="students" element={<Students />} />
              <Route path="reports" element={<Reports />} />
              <Route index element={<Dashboard />} />
            </Route>

            {/* HOD Routes */}
            <Route path="/hod/dashboard" element={<HODDashboard />} />
            <Route path="/hod/students" element={<HODDashboard />} />
            <Route path="/hod/approvals" element={<HODDashboard />} />
            <Route path="/hod/reports" element={<HODDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin/verify" element={<AdminVerify />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
