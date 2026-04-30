import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Zap, 
  X, 
  Menu, 
  Facebook, 
  Twitter, 
  Share2, 
  MapPin, 
  Clock, 
  ChevronRight,
  Sparkles,
  User,
  Mail,
  Phone,
  Dumbbell,
  Calendar,
  Activity,
  Timer,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { LoadingSpinner } from './SharedUI';
import { useEffect, lazy, Suspense } from 'react';
import { supabase } from '../lib/supabase';

// Lazy load heavy modals to improve initial load speed
const AuthModal = lazy(() => import('./AuthModal').then(m => ({ default: m.AuthModal })));
const BookingModal = lazy(() => import('./BookingModal').then(m => ({ default: m.BookingModal })));



  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* Header Aesthetics */}
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
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 mb-4 rounded-full border border-blue-100 shadow-sm uppercase tracking-widest">
                      <Sparkles size={10} /> PROTOCOL INITIATION
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 leading-none w-full">
                      Start Your <br/>Training.
                    </h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      Fill in the details below to schedule your personalized fitness program.
                    </p>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Your Name" icon={User}>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                        placeholder="John Doe"
                      />
                    </InputField>
                    <InputField label="Email Address" icon={Mail}>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                        placeholder="example@mail.com"
                      />
                    </InputField>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Phone Number" icon={Phone}>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                        placeholder="07..."
                      />
                    </InputField>
                    <InputField label="Training Location" icon={MapPin}>
                      <select 
                        required 
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none"
                      >
                        <option value="">Select Location</option>
                        {nakuruLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                    </InputField>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Training Program" icon={Dumbbell}>
                      <select 
                        required 
                        value={formData.plan}
                        onChange={e => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none"
                      >
                        <option value="">Select Program</option>
                        {programTypes.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                    </InputField>
                    <InputField label="Session Duration" icon={Timer}>
                      <select 
                        required 
                        value={formData.duration}
                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none"
                      >
                        <option value="">Select Duration</option>
                        {durations.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                    </InputField>
                  </div>

                  <InputField label="Preferred Start Date" icon={Calendar}>
                    <input 
                      required
                      type="date" 
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                    />
                  </InputField>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="group w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-[0_15px_30px_-8px_rgba(225,29,72,0.25)] hover:shadow-[0_20px_40px_-12px_rgba(225,29,72,0.35)] hover:bg-rose-700 active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size={18} />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Evolution
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[9px] font-black text-slate-400 uppercase mt-6 tracking-[0.3em]">
                      We will contact you shortly to confirm.
                    </p>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-28 h-28 bg-rose-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-12 shadow-[0_25px_50px_-10px_rgba(225,29,72,0.4)] relative">
                    <Sparkles size={48} className="animate-pulse" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/20 rounded-b-[2.5rem]" />
                    <div className="absolute inset-0 bg-rose-600 rounded-[2.5rem] animate-ping opacity-10" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-none">Plan Started!</h3>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto mb-10">
                    Your fitness plan is being processed. Expect confirmation within the hour.
                  </p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    Status: <span className="text-rose-500 animate-pulse">Processing...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* --- Global Navbar & Footer --- */

export const Layout = ({ children }: React.PropsWithChildren) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isBookingModalOpen, setIsBookingModalOpen, isAuthModalOpen, setIsAuthModalOpen } = useModal();
  const { user, profile, logOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: Zap },
    { name: 'Programs', path: '/programs', icon: Dumbbell },
    { name: 'Studio', path: '/studio', icon: Sparkles },
    { name: 'Portfolio', path: '/portfolio', icon: Activity },
    { name: 'Contact', path: '/#contact', icon: MapPin },
    ...(profile?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
  ];

  const handleBookingClick = () => {
    if (user) {
      setIsBookingModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
      // We'll use a standard alert if notify isn't easily accessible, 
      // but let's assume the Auth Modal will handle the "why" or just let the user sign in.
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-blue-100 selection:text-blue-600">
      <div className="fixed inset-0 mesh-gradient-light -z-10 opacity-60" />
      <div className="fixed inset-0 bg-white/60 -z-10" />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="liquid-glass px-8 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-500/5">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-100 shadow-md transition-transform group-hover:scale-110">
              <img src="/mrman_brand.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-black tracking-tighter text-xl text-slate-900">Mr Man.</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center gap-2 text-sm font-bold tracking-tight transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-8 rounded-lg px-2 py-1 ${
                  location.pathname === item.path ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {user ? (
               <div className="flex items-center gap-2">
                 <button 
                  onClick={() => navigate(profile?.role === 'admin' ? '/admin' : '/dashboard')}
                  className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-full px-4 py-1.5 hover:bg-white transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm shrink-0">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=0D9488&color=fff`} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 hidden lg:block">{profile?.display_name || user.displayName || user.email?.split('@')[0]}</span>
                </button>
                <button 
                  onClick={logOut}
                  title="Protocol Exit"
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                </button>
               </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg px-2"
              >
                <User size={18} />
                <span>Sign In</span>
              </button>
            )}
            <button 
              onClick={handleBookingClick}
              className="hidden md:block text-sm font-black bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 uppercase tracking-wider"
            >
              Book Session
            </button>
            <button className="md:hidden text-slate-800 hover:text-emerald-600 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 pt-24 p-6 z-40 bg-white/95 backdrop-blur-2xl md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800 outline-none focus-visible:text-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl py-2 active:bg-slate-50 transition-all"
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-slate-100" />
              <button 
                onClick={() => { setIsMenuOpen(false); handleBookingClick(); }}
                className="bg-rose-600 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl shadow-rose-600/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 uppercase tracking-widest"
              >
                Book Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>{children}</main>

      {/* Footer */}
      <footer className="w-full mt-20 pt-32 pb-20 bg-slate-900 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-24 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                <img src="/mrman_brand.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black tracking-tighter text-3xl text-white">Mr Man.</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              The pinnacle of performance engineering in Nakuru. We don't just train; we evolve human potential through science and discipline.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Share2].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-emerald-500 font-black text-[10px] uppercase">Navigation</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-300">
              {navItems.map(item => (
                <Link key={item.name} to={item.path} className="hover:text-emerald-500 transition-all inline-flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg px-2 -mx-2">
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6" id="contact">
            <h4 className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">Contact base</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Location</p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    Milimani Ridge, Elite Center<br/>Nakuru City, Kenya
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Email</p>
                  <p className="text-xs text-slate-400 mt-0.5">hello@mrman.fit</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Phone</p>
                  <p className="text-xs text-slate-400 mt-0.5">+254 700 000 000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Operation Hours</p>
                  <p className="text-xs text-slate-400 mt-0.5">05:00 am — 09:00 pm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-emerald-500 font-black text-[10px] uppercase">Base Info</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Join the elite fitness network in Nakuru. Get real-time updates on new plans and studio sessions.</p>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest"
            >
              Start Your Evolution
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6 text-[10px] font-black text-slate-500 uppercase relative z-10">
          <p>© 2026 Mr Man Fitness • All systems optimized</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-emerald-500 transition-colors outline-none focus-visible:text-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-sm">Privacy</Link>
            <Link to="/terms" className="hover:text-emerald-500 transition-colors outline-none focus-visible:text-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-sm">Terms</Link>
          </div>
        </div>
      </footer>

      <Suspense fallback={null}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
      </Suspense>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
        {/* Call Icon */}
        <motion.a
          href="tel:+254700000000"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <Phone size={24} fill="white" />
        </motion.a>

        {/* WhatsApp Icon */}
        <motion.a
          href="https://wa.me/254700000000"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:bg-emerald-600 transition-colors cursor-pointer"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="28" 
            height="28" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </motion.a>
      </div>
    </div>
  );
};
