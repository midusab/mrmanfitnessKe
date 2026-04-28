import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

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
    }, 5000);
  }, []);

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, filter: 'blur(10px)' }}
              className="pointer-events-auto"
            >
              <div className="liquid-glass p-1 border-white/40 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden">
                <div className="bg-white/40 backdrop-blur-3xl px-6 py-4 flex items-center gap-4 border border-white/60 rounded-[1.9rem]">
                  <div className={`p-2.5 rounded-2xl shrink-0 ${
                    n.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                    n.type === 'error' ? 'bg-rose-50 text-rose-500' :
                    n.type === 'protocol' ? 'bg-slate-900 text-white' :
                    'bg-blue-50 text-blue-500'
                  }`}>
                    {n.type === 'success' && <CheckCircle size={18} />}
                    {n.type === 'error' && <AlertCircle size={18} />}
                    {n.type === 'protocol' && <Sparkles size={18} />}
                    {n.type === 'info' && <Info size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {n.message}
                    </p>
                  </div>
                  <button 
                    onClick={() => remove(n.id)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Progress bar */}
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className={`h-0.5 mt-[-2px] ${
                    n.type === 'success' ? 'bg-emerald-500' :
                    n.type === 'error' ? 'bg-rose-500' :
                    n.type === 'protocol' ? 'bg-rose-600' :
                    'bg-blue-500'
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
