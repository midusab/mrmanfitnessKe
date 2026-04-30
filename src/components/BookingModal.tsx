import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useModal } from '../context/ModalContext';
import { supabase } from '../lib/supabase';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Dumbbell, 
  Timer, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { LoadingSpinner } from './SharedUI';

const InputField = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-blue-600 transition-colors">
      <Icon size={12} className="text-slate-400 group-focus-within:text-blue-500" /> {label}
    </label>
    <div className="relative">
      {children}
    </div>
  </div>
);

export const BookingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { user, profile } = useAuth();
  const { notify } = useNotification();
  const { setIsAuthModalOpen } = useModal();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    plan: '',
    duration: '',
    date: ''
  });
  
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [isCheckingBooking, setIsCheckingBooking] = useState(false);

  const nakuruLocations = ["Milimani", "Naka", "Shabaab", "Lanet", "Kiamunyi", "Freehold", "London", "Bondeni", "Mwariki", "Pipeline", "Section 58"];
  const programTypes = [
    { name: "Compound Lifts", icon: Dumbbell },
    { name: "Strength Training", icon: Activity },
    { name: "Light Cardio", icon: Zap },
    { name: "Dietary Session", icon: Sparkles },
    { name: "Weight Loss", icon: Sparkles },
    { name: "Weight Gain", icon: Zap }
  ];
  const durations = ["4 Weeks (Initiation)", "8 Weeks (Standard)", "12 Weeks (Transformation)", "Ongoing (Elite)"];

  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || profile?.display_name || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user, isOpen]);

  useEffect(() => {
    const checkBooking = async () => {
      if (user && isOpen) {
        setIsCheckingBooking(true);
        try {
          const { data, error } = await supabase
            .from('bookings')
            .select('id')
            .eq('user_id', user.uid)
            .in('status', ['pending', 'confirmed']);
          
          if (error) throw error;
          setHasExistingBooking(data && data.length > 0);
        } catch (error) {
          console.error("Error checking bookings", error);
        } finally {
          setIsCheckingBooking(false);
        }
      }
    };
    checkBooking();
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (new Date(formData.date) < new Date(new Date().setHours(0,0,0,0))) {
      notify("Please select a date in the future.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.uid,
          user_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          plan: formData.plan,
          duration: formData.duration,
          activation_date: new Date(formData.date).toISOString(),
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;

      setStep(2);
      notify("Booking successful! We'll confirm your session soon.", "success");

      setTimeout(() => {
        onClose();
        setStep(1);
        setFormData({ name: '', email: '', phone: '', location: '', plan: '', duration: '', date: '' });
      }, 4000);
    } catch (error: any) {
      console.error('Booking error:', error);
      notify(error.message || "Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white/90 backdrop-blur-3xl rounded-[3rem] w-full max-w-xl relative shadow-[0_32px_80px_-16px_rgba(0,0,0,0.2)] overflow-hidden border border-white/60"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-600/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-full bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.5)]"
            />
          </div>
          
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-emerald-600 transition-all z-10 p-2.5 rounded-full hover:bg-emerald-50 active:scale-90">
            <X size={20} />
          </button>

          <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {isCheckingBooking ? (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner size={48} />
                <p className="mt-4 text-slate-400 font-bold animate-pulse">Verifying Access...</p>
              </div>
            ) : hasExistingBooking ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-4">Active Plan Detected.</h3>
                <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">
                  You already have an active or pending training plan. Please complete your current program before booking another.
                </p>
                <Link 
                  to="/dashboard" 
                  onClick={onClose}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  View Your Dashboard <ChevronRight size={14} />
                </Link>
              </motion.div>
            ) : step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 mb-4 rounded-full border border-blue-100 shadow-sm uppercase tracking-widest">
                    <Sparkles size={10} /> PROTOCOL INITIATION
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 leading-none w-full">
                    Start Your <br/>Training.
                  </h2>
                </motion.div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <InputField label="Your Name" icon={User}>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300" placeholder="John Doe" />
                  </InputField>
                  <InputField label="Email Address" icon={Mail}>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300" placeholder="example@mail.com" />
                  </InputField>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <InputField label="Phone Number" icon={Phone}>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" placeholder="07..." />
                  </InputField>
                  <InputField label="Training Location" icon={MapPin}>
                    <select required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none">
                      <option value="">Select Location</option>
                      {nakuruLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                  </InputField>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <InputField label="Training Program" icon={Dumbbell}>
                    <select required value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })} className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none">
                      <option value="">Select Program</option>
                      {programTypes.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                  </InputField>
                  <InputField label="Session Duration" icon={Timer}>
                    <select required value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none">
                      <option value="">Select Duration</option>
                      {durations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                  </InputField>
                </div>

                <InputField label="Preferred Start Date" icon={Calendar}>
                  <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800" />
                </InputField>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="group w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-[0_15px_30px_-8px_rgba(225,29,72,0.25)] hover:shadow-[0_20px_40px_-12px_rgba(225,29,72,0.35)] hover:bg-rose-700 active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest transition-all disabled:opacity-50">
                    {isSubmitting ? <><LoadingSpinner size={18} /> Processing...</> : <>Confirm Evolution <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-28 h-28 bg-rose-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-12 shadow-[0_25px_50px_-10px_rgba(225,29,72,0.4)] relative">
                  <Sparkles size={48} className="animate-pulse" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-none">Plan Started!</h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto mb-10">Expect confirmation within the hour.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
