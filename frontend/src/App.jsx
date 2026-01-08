// eslint-disable-next-line no-unused-vars
import React, { Suspense, lazy, useEffect } from 'react';
import { applyTheme, getPreferredTheme } from './utils/theme';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './PrivateRoute';
import MaintenanceWrapper from './components/MaintenanceWrapper';

const Layout = lazy(() => import('./pages/Layout'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const StudentReg = lazy(() => import('./pages/StudentReg'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SupportUs = lazy(() => import('./components/SupportUs'));
const AlumniReg = lazy(() => import('./pages/AlumniReg'));
const Features = lazy(() => import('./components/Features'));
const AdminPanel = lazy(() => import('./components/AdminPanel/AdminPanel'));

function App() {
  const authUserId = localStorage.getItem('userId'); // Retrieve the userId from localStorage

  useEffect(() => {
    import('./pages/Home');
    import('./pages/Login');
    // Apply theme based on saved preferences
    const role = localStorage.getItem('userRole') || 'student';
    const current = getPreferredTheme(role);
    applyTheme(current);

    // If user prefers system theme, react to changes
    try {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        const mode = getPreferredTheme(role);
        if (mode === 'system') applyTheme('system');
      };
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    } catch {
      // no-op
    }
  }, []);

  return (
    <div className="font-outfit overflow-hidden">
      <ToastContainer />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white bg-slate-950">Loading...</div>}>
        <MaintenanceWrapper>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/features" element={<Features />} />
              <Route path="/roleselection" element={<RoleSelection />} />
              <Route path="/student-register" element={<StudentReg />} />
              <Route path="/alumni-register" element={<AlumniReg />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Admin Panel - Separate route without Layout */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            {/* Dashboard - Separate route without Layout */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/supportus" element={<SupportUs />} />
          </Routes>
        </MaintenanceWrapper>
      </Suspense>
    </div>
  );
}

export default App;
