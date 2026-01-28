import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/Worker/HomePage'
import FindWork from './pages/Worker/FindWork'
import WorkDetail from './pages/Worker/WorkDetail'
import TaskOwnerPage from './pages/TaskOwner/TaskOwnerPage'
import Postjob from './pages/TaskOwner/PostJob/Postjob'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import OTP from './pages/OTP'
import ForgotPage from './pages/ForgotPage'
import ForgotOTP from './pages/ForgotOTP'
import ResetPage from './pages/ResetPage'
import './App.css'

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
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <HomePage />
            </main>
            <Footer />
          </div>
        }
      />
      <Route
        path="/find-work"
        element={
          <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <FindWork />
            </main>
            <Footer />
          </div>
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

      {/* Task Owner Pages (no navbar/footer, has sidebar/own layout) */}
      <Route path="/task-owner" element={<TaskOwnerPage />} />
      <Route path="/task-owner/post-job" element={<Postjob />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
