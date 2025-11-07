import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

// Public Pages
import Landing from "./pages/Landing";
import SignupHub from "./pages/SignupHub";
import CollegeSignup from "./pages/CollegeSignup";
import UserSignup from "./pages/UserSignup";
import Login from "./pages/Login";
import PendingVerification from "./pages/PendingVerification";
import PendingApproval from "./pages/PendingApproval";

// Dashboard Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import PlacementDrives from "./pages/student/PlacementDrives";
import AIResumeBuilder from "./pages/student/AIResumeBuilder";
import AIMockInterview from "./pages/student/AIMockInterview";
import MyResults from "./pages/student/MyResults";
import TPODashboard from "./pages/tpo/TPODashboard";
import Dashboard from "./pages/tpo/Dashboard";
import ManageDrives from "./pages/tpo/ManageDrives";
import Companies from "./pages/tpo/Companies";
import Students from "./pages/tpo/Students";
import Reports from "./pages/tpo/Reports";
import ManageStudents from "./pages/hod/ManageStudents";
import PendingApprovals from "./pages/hod/PendingApprovals";
import HODReports from "./pages/hod/Reports";
import HODResults from "./pages/hod/Results";
import HODDashboard from "./pages/hod/HODDashboard";
import AdminVerify from "./pages/admin/AdminVerify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
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
            <Route path="/login" element={<Login />} />
            <Route path="/pending-verification" element={<PendingVerification />} />
            <Route path="/pending-approval" element={<PendingApproval />} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboard />}>
              <Route path="profile" element={<Profile />} />
              <Route path="drives" element={<PlacementDrives />} />
              <Route path="ai-resume" element={<AIResumeBuilder />} />
              <Route path="ai-interview" element={<AIMockInterview />} />
              <Route path="results" element={<MyResults />} />
              <Route path="dashboard" element={<div />} />
              <Route index element={<div />} />
            </Route>

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
            <Route path="/hod" element={<HODDashboard />}>
              <Route path="students" element={<ManageStudents />} />
              <Route path="approvals" element={<PendingApprovals />} />
              <Route path="reports" element={<HODReports />} />
              <Route path="results" element={<HODResults />} />
              <Route path="dashboard" element={<div />} />
              <Route index element={<div />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/verify" element={<AdminVerify />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </NotificationProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
