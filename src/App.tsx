import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/Home';
import ProgramsPage from './pages/Programs';
import StudioPage from './pages/Studio';
import { LoadingSpinner } from './components/SharedUI';
import { motion, AnimatePresence } from 'motion/react';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import DashboardPage from './pages/Dashboard';
import PortfolioPage from './pages/Portfolio';
import AdminPage from './pages/Admin';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <ModalProvider>
        <BrowserRouter>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          {isBooting ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <LoadingSpinner size={64} color="#2563eb" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-[10px] font-black text-blue-600">MRM</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">preping ..</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="w-1 h-1 bg-blue-600 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <Layout key="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Layout>
          )}
        </AnimatePresence>
      </BrowserRouter>
    </ModalProvider>
  </NotificationProvider>
</AuthProvider>
);
}
