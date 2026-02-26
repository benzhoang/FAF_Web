import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Worker/HomePage";
import FindWork from "./pages/Worker/FindWork";
import WorkDetail from "./pages/Worker/WorkDetail";
import Apply from "./pages/Worker/Apply/Apply";
import Success from "./pages/Worker/Apply/Success";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
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
import Talents from "./pages/TaskOwner/Talents";
import TalentDetail from "./pages/TaskOwner/TalentDetail";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import ForgotPage from "./pages/ForgotPage";
import ForgotOTP from "./pages/ForgotOTP";
import ResetPage from "./pages/ResetPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.css";
import JobListPage from "./pages/TaskOwner/PostJob/JobListPage";
import Dashboard from "./pages/Admin/Dashboard";
import UserManage from "./pages/Admin/UserManage";
import Moderation from "./pages/Admin/Moderation";
import Finance from "./pages/Admin/Finance";
import Manager from "./pages/Manager/Request";
import EmployeeManagement from "./pages/Manager/EmployeeManagement";
import RequestDetail from "./pages/Manager/RequestDetail";
import Finances from "./pages/Manager/Finances";

function App() {
  return (
    <Routes>
      {/* Auth pages (no navbar/footer) */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/forgot-password" element={<ForgotPage />} />
      <Route path="/forgot-otp" element={<ForgotOTP />} />
      <Route path="/reset-password" element={<ResetPage />} />

      {/* Public pages (with navbar/footer) */}
      <Route
        path="/"
        element={
          // <ProtectedRoute roles={[""]}>
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <HomePage />
            </main>
            <Footer />
          </div>
          // </ProtectedRoute>
        }
      />
      <Route
        path="/find-work"
        element={
          <ProtectedRoute roles={["worker", "admin"]}>
            <div className="w-full min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow w-full">
                <FindWork />
              </main>
              <Footer />
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/work/:id"
        element={
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <WorkDetail />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/apply"
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
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <WorkerDashboard />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/settings"
        element={
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <Settings />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/wallet"
        element={
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <Wallet />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/deposit-points"
        element={
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <Depositpoint />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/withdraw-points"
        element={
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <Withdrawpoint />
            </main>
            <Footer />
          </div>
        }
      />

      {/* Task Owner Pages (no navbar/footer, has sidebar/own layout) */}
      <Route
        path="/task-owner"
        element={
          <ProtectedRoute roles={["employer", "admin"]}>
            <TaskOwnerPage />
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
      <Route path="/task-owner/post-job" element={<Postjob />} />

      {/* Admin Pages (no navbar/footer, has sidebar/own layout) */}
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
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/job-list" element={<JobListPage />} />
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
    </Routes>
  );
}

export default App;
