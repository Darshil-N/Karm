import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

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
import CompleteProfile from "./pages/CompleteProfile";
import CheckStatus from "./pages/CheckStatus";
import SystemTest from "./pages/SystemTest";
import WorkflowTest from "./pages/WorkflowTest";
import EmailValidationTest from "./pages/EmailValidationTest";
import SampleDataGenerator from "./pages/SampleDataGenerator";

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
import PendingApprovals from "./pages/hod/PendingApprovals";
import HODReports from "./pages/hod/Reports";
import HODResults from "./pages/hod/Results";
import HODDashboard from "./pages/hod/HODDashboard";
import HODDashboardContent from "./pages/hod/HODDashboardContent";
import AdminVerify from "./pages/admin/AdminVerify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gradient-to-br from-deep-space via-electric-purple to-deep-space bg-animate-gradient">
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
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/check-status" element={<CheckStatus />} />
            <Route path="/system-test" element={<SystemTest />} />
            <Route path="/workflow-test" element={<WorkflowTest />} />
            <Route path="/email-test" element={<EmailValidationTest />} />
            <Route path="/sample-data" element={<SampleDataGenerator />} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboard />}>
              <Route path="profile" element={<Profile />} />
              <Route path="drives" element={<PlacementDrives />} />
              <Route path="ai-resume" element={<AIResumeBuilder />} />
              <Route path="ai-interview" element={<AIMockInterview />} />
              <Route path="results" element={<MyResults />} />
              <Route path="dashboard" element={<div className="p-6"><h2>Dashboard Content</h2></div>} />
              <Route index element={<div className="p-6"><h2>Welcome to Student Portal</h2></div>} />
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
              <Route path="dashboard" element={<HODDashboardContent />} />
              <Route path="approvals" element={<PendingApprovals />} />
              <Route path="reports" element={<HODReports />} />
              <Route path="results" element={<HODResults />} />
              <Route index element={<HODDashboardContent />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/verify" element={<AdminVerify />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
          </div>
      </TooltipProvider>
    </NotificationProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
