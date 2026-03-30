import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import CheckpointWorkspace from "./pages/Worker/CheckpointWorkspace";
import ContractSign from "./pages/Worker/ContractSign";
import ContractDetail from "./pages/Worker/ContractDetail";
import Settings from "./pages/Worker/Settings";
import Wallet from "./pages/Worker/Wallet";
import Depositpoint from "./pages/Worker/Depositpoint";
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
import ManagerManage from "./pages/Admin/ManagerManage";
import SkillManage from "./pages/Admin/SkillManage";
import CategoryManage from "./pages/Admin/CategoryManage";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import WithdrawalManage from "./pages/Admin/WithdrawalManage";
import Forbidden from "./components/Forbidden";
import PublicProfile from "./pages/PublicProfile";
import ToastDemo from "./pages/ToastDemo";
import EmployerContractSign from "./pages/TaskOwner/EmployerContractSign";
import CheckpointReview from "./pages/TaskOwner/CheckpointReview";
import Messaging from "./pages/Messaging/Messaging";
import Notifications from "./pages/Notifications";
import { ChatProvider } from "./contexts/ChatContext";
import ChatWidget from "./components/Chat/ChatWidget";
import TaskOwnerLayout from "./components/TaskOwnerLayout";
import "./App.css";
import Manager from "./pages/Manager/Request";
import EmployeeManagement from "./pages/Manager/EmployeeManagement";
import RequestDetail from "./pages/Manager/RequestDetail";
import Finances from "./pages/Manager/Finances";
import JobManagement from "./pages/Manager/JobManagement";
import Disputes from "./pages/Manager/Disputes";
import DisputeDetail from "./pages/Manager/DisputeDetail";
import ManagerLayout from "./components/ManagerLayout";
import DynamicBackground from "./components/DynamicBackground";

function App() {
  const location = useLocation();
  const hideChatWidgetPaths = ["/forbidden"];
  const shouldHideChatWidget = hideChatWidgetPaths.includes(location.pathname);

  return (
    <ToastProvider>
      <ChatProvider>
        <DynamicBackground />
        <Routes>
        {/* ========== AUTH ROUTES (Public, No Layout) ========== */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* ========== PUBLIC ROUTES (With Navbar/Footer) ========== */}
      <Route path="/" element={<HomePage />} />
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
        path="/workspace/checkpoint/:checkpointId"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <CheckpointWorkspace />
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
          <ProtectedRoute roles={["worker", "admin", "manager", "employer"]}>
            <PublicLayout><Settings /></PublicLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute roles={["worker", "admin", "manager", "employer"]}>
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
        path="/messages"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin", "manager"]}>
            <PublicLayout><Messaging /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin", "manager"]}>
            <PublicLayout><Notifications /></PublicLayout>
          </ProtectedRoute>
        }
      />

      {/* ========== EMPLOYER ROUTES (Custom Layout with Sidebar) ========== */}
      {/* ========== TASK OWNER ROUTES ========== */}
      <Route
        path="/task-owner"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <TaskOwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TaskOwnerPage />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="jobs/:id/edit" element={<EditJob />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="contracts/:id/sign" element={<EmployerContractSign />} />
        <Route path="contracts/:contractId/review" element={<CheckpointReview />} />
        <Route path="profiles" element={<ProfilesPage />} />
        <Route path="talent" element={<Talents />} />
        <Route path="talent/:id" element={<TalentDetail />} />
        <Route path="post-job" element={<Postjob />} />
      </Route>

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
      <Route
        path="/admin/withdrawals"
        element={
          <ProtectedRoute roles={["admin"]}>
            <WithdrawalManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/managers"
        element={
          <ProtectedRoute roles={["admin"]}>
            <ManagerManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <ProtectedRoute roles={["admin"]}>
            <SkillManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute roles={["admin"]}>
            <CategoryManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminNotifications />
          </ProtectedRoute>
        }
      />

      {/* ========== OTHER ROUTES ========== */}
      <Route path="/job-list" element={<JobListPage />} />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin", "manager"]}>
            <PublicLayout><PublicProfile /></PublicLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dispute/:id"
        element={
          <ProtectedRoute roles={["worker", "employer", "admin", "manager"]}>
            <DisputeDetail />
          </ProtectedRoute>
        }
      />

      {/* ========== MANAGER ROUTES ========== */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={["manager"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="request" element={<Manager />} />
        <Route path="request/:id" element={<RequestDetail />} />
        <Route path="management/jobs" element={<JobManagement />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="finances" element={<Finances />} />
        <Route path="disputes" element={<Disputes />} />
      </Route>

      {/* ========== FALLBACK (Must be last) ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    {!shouldHideChatWidget && <ChatWidget />}
    </ChatProvider>
    </ToastProvider>
  );
}

export default App;

