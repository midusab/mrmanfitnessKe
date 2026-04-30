import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Zap, X, Facebook, ShieldCheck } from 'lucide-react';
import { LoadingSpinner } from './SharedUI';

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { signIn } = useAuth();
  const { notify } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn();
      notify("Welcome back! Your profile is ready.", "success");
      onClose();
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        const errorMessage = error.message || "Sign in failed. Please try again.";
        notify(errorMessage, "error");
      }
      console.error("Sign in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-sm p-8 md:p-10 relative shadow-2xl overflow-hidden"
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-600/20">
              <Zap size={24} fill="white" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter text-slate-800">Account Login</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Access your fitness portal</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size={20} />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {isLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <button 
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold py-4 rounded-xl hover:bg-[#166fe5] transition-all active:scale-[0.98] shadow-md shadow-blue-600/10 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <Facebook size={20} fill="white" />
              Continue with Facebook
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400">
              Your data is secured.<br/>Authorized access only.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
