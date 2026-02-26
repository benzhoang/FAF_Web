import { Navigate, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import PublicLayout from "./components/PublicLayout";
import HomePage from "./pages/Worker/HomePage";
import FindWork from "./pages/Worker/FindWork";
import WorkDetail from "./pages/Worker/WorkDetail";
import ApplyToJob from "./pages/Worker/ApplyToJob";
import Apply from "./pages/Worker/Apply/Apply";
import Success from "./pages/Worker/Apply/Success";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import ActiveJob from "./pages/Worker/ActiveJob";
import ContractSign from "./pages/Worker/ContractSign";
import ContractDetail from "./pages/Worker/ContractDetail";
import Settings from "./pages/Worker/Settings";
import Wallet from "./pages/Worker/Wallet";
import Depositpoint from "./pages/Worker/Depositpoint";
import Withdrawpoint from "./pages/Worker/Withdrawpoint";
import TaskOwnerPage from "./pages/TaskOwner/TaskOwnerPage";
import ProfilesPage from "./pages/TaskOwner/ProfilesPage";
import Contracts from "./pages/TaskOwner/Contracts";
import Jobs from "./pages/TaskOwner/Jobs";
import JobDetail from "./pages/TaskOwner/JobDetail";
import Postjob from "./pages/TaskOwner/PostJob/Postjob";
import EditJob from "./pages/TaskOwner/EditJob";
import Talents from "./pages/TaskOwner/Talents";
import TalentDetail from "./pages/TaskOwner/TalentDetail";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./auth/ProtectedRoute";
import JobListPage from "./pages/TaskOwner/PostJob/JobListPage";
import Dashboard from "./pages/Admin/Dashboard";
import UserManage from "./pages/Admin/UserManage";
import Moderation from "./pages/Admin/Moderation";
import Finance from "./pages/Admin/Finance";
import Forbidden from "./components/Forbidden";
import PublicProfile from "./pages/PublicProfile";
import ToastDemo from "./pages/ToastDemo";
import EmployerContractSign from "./pages/TaskOwner/EmployerContractSign";
import CheckpointReview from "./pages/TaskOwner/CheckpointReview";
import Messaging from "./pages/Messaging/Messaging";
import Notifications from "./pages/Notifications";
import { ChatProvider } from "./contexts/ChatContext";
import ChatWidget from "./components/Chat/ChatWidget";
import "./App.css";
import Manager from "./pages/Manager/Request";
import EmployeeManagement from "./pages/Manager/EmployeeManagement";
import RequestDetail from "./pages/Manager/RequestDetail";
import Finances from "./pages/Manager/Finances";

function App() {
  return (
    <ToastProvider>
      <ChatProvider>
      <Routes>
      {/* ========== AUTH ROUTES (Public, No Layout) ========== */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* ========== PUBLIC ROUTES (With Navbar/Footer) ========== */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/work/:id" element={<PublicLayout><WorkDetail /></PublicLayout>} />
      <Route path="/toast-demo" element={<PublicLayout><ToastDemo /></PublicLayout>} />

      {/* ========== WORKER ROUTES (With Navbar/Footer) ========== */}
      <Route
        path="/find-work"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <PublicLayout><FindWork /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/:id"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <Apply />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply/success"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <Success />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <PublicLayout><WorkerDashboard /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-job"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <PublicLayout><ActiveJob /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contract/:id/sign"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin"]}>
            <PublicLayout><ContractSign /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contract/:id/view"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin"]}>
            <PublicLayout><ContractDetail /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <PublicLayout><Settings /></PublicLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <PublicLayout><Wallet /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deposit-points"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <PublicLayout><Depositpoint /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw-points"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <PublicLayout><Withdrawpoint /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin"]}>
            <PublicLayout><Messaging /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin"]}>
            <PublicLayout><Notifications /></PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* ========== EMPLOYER ROUTES (Custom Layout with Sidebar) ========== */}
      <Route
        path="/task-owner"
        element={
          <ProtectedRoute roles={['employer', 'admin']}>
            <TaskOwnerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/contract/:id/sign"
        element={
          <ProtectedRoute roles={['employer', 'admin']}>
            <EmployerContractSign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/contracts/:contractId/review"
        element={
          <ProtectedRoute roles={['employer', 'admin']}>
            <CheckpointReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/jobs"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/jobs/:id"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <JobDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/contracts"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <Contracts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/profiles"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <ProfilesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/talent"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <Talents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/talent/:id"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <TalentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/post-job"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <Postjob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-owner/jobs/:id/edit"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <EditJob />
          </ProtectedRoute>
        }
      />

      {/* ========== ADMIN ROUTES (Custom Layout with Sidebar) ========== */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/moderation"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Moderation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/finance"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Finance />
          </ProtectedRoute>
        }
      />

      {/* ========== OTHER ROUTES ========== */}
      <Route path="/job-list" element={<JobListPage />} />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin"]}>
            <PublicProfile />
          </ProtectedRoute>
        }
      />

      {/* ========== MANAGER ROUTES ========== */}
      <Route
        path="/manager/request"
        element={
          <ProtectedRoute roles={["manager"]}>
            <Manager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/request/:id"
        element={
          <ProtectedRoute roles={["manager"]}>
            <RequestDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/manager/employees"
        element={
          <ProtectedRoute roles={["manager"]}>
            <EmployeeManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/manager/finances"
        element={
          <ProtectedRoute roles={["manager"]}>
            <Finances />
          </ProtectedRoute>
        }
      />

      {/* ========== FALLBACK (Must be last) ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <ChatWidget />
    </ChatProvider>
    </ToastProvider>
  );
}

export default App;
