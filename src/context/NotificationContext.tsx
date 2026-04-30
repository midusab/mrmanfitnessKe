import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

import ShinyText from '../components/bits/ShinyText';

type NotificationType = 'success' | 'error' | 'info' | 'protocol';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000); // Slightly longer duration for premium feel
  }, []);

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {notifications.map((n, index) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 30,
                delay: 0.05 
              }}
              className="pointer-events-auto"
            >
              <div className="liquid-glass p-0.5 border-white/50 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden group">
                <div className="bg-white/30 backdrop-blur-3xl px-5 py-3 flex items-center gap-4 border border-white/60 rounded-[1.4rem] relative overflow-hidden">
                  {/* Decorative Gradient Background */}
                  <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${
                    n.type === 'success' ? 'bg-emerald-500' :
                    n.type === 'error' ? 'bg-rose-500' :
                    n.type === 'protocol' ? 'bg-slate-900' :
                    'bg-blue-500'
                  }`} />
                  
                  <div className={`relative z-10 p-2 rounded-xl shrink-0 shadow-lg ${
                    n.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                    n.type === 'error' ? 'bg-rose-500 text-white shadow-rose-500/20' :
                    n.type === 'protocol' ? 'bg-slate-900 text-white shadow-slate-900/20' :
                    'bg-blue-600 text-white shadow-blue-600/20'
                  }`}>
                    {n.type === 'success' && <CheckCircle size={16} />}
                    {n.type === 'error' && <AlertCircle size={16} />}
                    {n.type === 'protocol' && <Sparkles size={16} />}
                    {n.type === 'info' && <Info size={16} />}
                  </div>
                  
                  <div className="relative z-10 flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                      {n.type === 'protocol' ? (
                        <ShinyText text={n.message} speed={3} className="!text-slate-800" />
                      ) : (
                        n.message
                      )}
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                      {n.type === 'protocol' ? 'Broadcast' : 'Alert'}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => remove(n.id)}
                    className="relative z-10 p-2 hover:bg-black/5 rounded-xl transition-all text-slate-400 hover:text-slate-600 active:scale-90"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Progress bar */}
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className={`h-1 relative z-20 ${
                    n.type === 'success' ? 'bg-emerald-500' :
                    n.type === 'error' ? 'bg-rose-500' :
                    n.type === 'protocol' ? 'bg-rose-600' :
                    'bg-blue-600'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
