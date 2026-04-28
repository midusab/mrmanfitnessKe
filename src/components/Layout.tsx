import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useModal } from '../context/ModalContext';
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
  Timer
} from 'lucide-react';

/* --- Shared Modals --- */
const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
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
            <h3 className="text-2xl font-black tracking-tighter text-slate-800">System Login</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">Access your evolution portal</p>
          </div>

          <div className="space-y-4">
            <button 
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
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
              Protected by military-grade encryption.<br/>Authorized access only.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
    setTimeout(() => {
      onClose();
      setStep(1);
    }, 4000);
  };

  const InputField = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-rose-600 transition-colors">
        <Icon size={12} className="text-slate-400 group-focus-within:text-rose-500" /> {label}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  );

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
            className="bg-white/80 backdrop-blur-2xl rounded-[3rem] w-full max-w-2xl relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden border border-white/60"
          >
            {/* Header Aesthetics */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-600/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-full bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.5)]"
              />
            </div>
            
            <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-rose-600 transition-all z-10 p-2.5 rounded-full hover:bg-rose-50 active:scale-90">
              <X size={20} />
            </button>

            <div className="p-8 md:p-16 max-h-[90vh] overflow-y-auto custom-scrollbar">
              {step === 1 ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[9px] font-black text-rose-600 mb-4 rounded-full border border-rose-100 shadow-sm">
                      <Sparkles size={10} /> ESTABLISHING PROTOCOL
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 leading-none">
                      Secure Your <br/>
                      <span className="text-rose-600">Evolution.</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">
                      Complete your biological data entry for clinical assessment.
                    </p>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Full name" icon={User}>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                        placeholder="Full Identity"
                      />
                    </InputField>
                    <InputField label="Email Address" icon={Mail}>
                      <input 
                        required
                        type="email" 
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                        placeholder="active@mrman.fit"
                      />
                    </InputField>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Contact Line" icon={Phone}>
                      <input 
                        required
                        type="tel" 
                        className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800"
                        placeholder="+254..."
                      />
                    </InputField>
                    <InputField label="Deployment Region" icon={MapPin}>
                      <select required className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 appearance-none">
                        <option value="">Select Base</option>
                        {nakuruLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                    </InputField>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="System Protocol" icon={Dumbbell}>
                      <select required className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 appearance-none">
                        <option value="">Select Vector</option>
                        {programTypes.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                    </InputField>
                    <InputField label="Cycle Duration" icon={Timer}>
                      <select required className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 appearance-none">
                        {durations.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                    </InputField>
                  </div>

                  <InputField label="Activation Date" icon={Calendar}>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-white/40 border border-slate-200/60 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800"
                    />
                  </InputField>

                  <div className="pt-8">
                    <button type="submit" className="group w-full bg-rose-600 text-white font-black py-7 rounded-[2rem] shadow-[0_20px_40px_-8px_rgba(225,29,72,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(225,29,72,0.4)] hover:bg-rose-700 transition-all active:scale-[0.98] flex items-center justify-center gap-4 text-xl">
                      Initiate Transformation 
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-[9px] font-black text-slate-400 uppercase mt-6 tracking-[0.3em]">
                      Bio-Verification mandatory on entry
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
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-none">Protocol Initiated.</h3>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto mb-10">
                    Your biological profile is being analyzed. Expect encrypted confirmation within the hour.
                  </p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    Status: <span className="text-rose-500 animate-pulse">Syncing...</span>
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
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Zap },
    { name: 'Programs', path: '/programs', icon: Dumbbell },
    { name: 'Studio', path: '/studio', icon: Sparkles },
    { name: 'Contact', path: '/#contact', icon: MapPin },
  ];

  return (
    <div className="relative min-h-screen selection:bg-blue-100 selection:text-blue-600">
      <div className="fixed inset-0 mesh-gradient-light -z-10 opacity-60" />
      <div className="fixed inset-0 bg-white/60 -z-10" />

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="liquid-glass px-8 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-500/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Zap size={20} fill="white" className="text-white" />
            </div>
            <span className="font-black tracking-tighter text-xl text-slate-900">Mr Man.</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center gap-2 text-sm font-bold tracking-tight transition-all outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-8 rounded-lg px-2 py-1 ${
                  location.pathname === item.path ? 'text-rose-600 bg-rose-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-all outline-none focus-visible:ring-2 focus-visible:ring-rose-600 rounded-lg px-2"
            >
              <User size={18} />
              <span>Sign In</span>
            </button>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="hidden md:block text-sm font-black bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 uppercase tracking-wider"
            >
              Book Session
            </button>
            <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
                  className="text-4xl font-black tracking-tighter text-slate-800 outline-none focus-visible:text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-600 rounded-xl"
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-slate-100" />
              <button 
                onClick={() => { setIsMenuOpen(false); setIsBookingModalOpen(true); }}
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
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-24 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/40">
                <Zap size={28} fill="white" className="text-white" />
              </div>
              <span className="font-black tracking-tighter text-3xl text-white">Mr Man.</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              The pinnacle of performance engineering in Nakuru. We don't just train; we evolve human potential through science and discipline.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Share2].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-blue-500 font-black text-[10px] uppercase">Navigation</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-300">
              {navItems.map(item => (
                <Link key={item.name} to={item.path} className="hover:text-rose-500 transition-all inline-flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-rose-600 rounded-lg px-2 -mx-2">
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
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
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
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Email</p>
                  <p className="text-xs text-slate-400 mt-0.5">protocols@mrman.fit</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">Phone</p>
                  <p className="text-xs text-slate-400 mt-0.5">+254 700 000 000</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
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
            <h4 className="text-rose-500 font-black text-[10px] uppercase">Base Intel</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Join the elite performance network in Nakuru. Get real-time updates on new protocols and studio sessions.</p>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl text-[10px] hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest"
            >
              Start Your Evolution
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6 text-[10px] font-black text-slate-500 uppercase relative z-10">
          <p>© 2026 Mr Man Fitness • All systems optimized</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-blue-500 transition-colors outline-none focus-visible:text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-500 transition-colors outline-none focus-visible:text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm">Terms</Link>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
        {/* Call Icon */}
        <motion.a
          href="tel:+254700000000"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-rose-600/40 hover:bg-rose-700 transition-colors"
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
          className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:bg-emerald-600 transition-colors"
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
