// eslint-disable-next-line no-unused-vars
import React, { Suspense, lazy, useEffect } from 'react';
import { applyTheme, getPreferredTheme } from './utils/theme';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './PrivateRoute';
import MaintenanceWrapper from './components/MaintenanceWrapper';
import AppErrorBoundary from './components/AppErrorBoundary';

const lazyWithRetry = (factory, cacheKey) =>
  lazy(async () => {
    const retryKey = `lazy-retry:${cacheKey}`;
    try {
      const module = await factory();
      sessionStorage.removeItem(retryKey);
      return module;
    } catch (error) {
      const retried = sessionStorage.getItem(retryKey) === '1';
      const isChunkError =
        error?.name === 'ChunkLoadError' ||
        /Loading chunk|Failed to fetch dynamically imported module/i.test(error?.message || '');

      if (isChunkError && !retried) {
        sessionStorage.setItem(retryKey, '1');
        window.location.reload();
        return new Promise(() => {});
      }

      throw error;
    }
  });

const Layout = lazyWithRetry(() => import('./pages/Layout'), 'layout');
const Home = lazyWithRetry(() => import('./pages/Home'), 'home');
const About = lazyWithRetry(() => import('./pages/About'), 'about');
const Contact = lazyWithRetry(() => import('./pages/Contact'), 'contact');
const RoleSelection = lazyWithRetry(() => import('./pages/RoleSelection'), 'role-selection');
const StudentReg = lazyWithRetry(() => import('./pages/StudentReg'), 'student-register');
const Login = lazyWithRetry(() => import('./pages/Login'), 'login');
const NotFound = lazyWithRetry(() => import('./pages/NotFound'), 'not-found');
const Dashboard = lazyWithRetry(() => import('./pages/Dashboard'), 'dashboard');
const SupportUs = lazyWithRetry(() => import('./components/SupportUs'), 'support-us');
const Features = lazyWithRetry(() => import('./components/Features'), 'features');
const AdminPanel = lazyWithRetry(() => import('./components/AdminPanel/AdminPanel'), 'admin-panel');

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
        <AppErrorBoundary>
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
                <Route path="/alumni-register" element={<NotFound />} />
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
        </AppErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
