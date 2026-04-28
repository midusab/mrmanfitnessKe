/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  MapPin, 
  ChevronRight, 
  MoveRight,
  Dumbbell,
  Apple as FruitIcon,
  Sparkles,
  Menu,
  X,
  Star,
  Quote,
  Facebook,
  Twitter,
  MessageCircle,
  Share2,
  LineChart as LineChartIcon,
  Activity,
  ArrowUpRight,
  User,
  Calendar,
  BookOpen,
  Play,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const progressData = [
  { month: 'Jan', weight: 88, fat: 24, performance: 65 },
  { month: 'Feb', weight: 86.5, fat: 22.5, performance: 70 },
  { month: 'Mar', weight: 84, fat: 21, performance: 78 },
  { month: 'Apr', weight: 83.2, fat: 20.2, performance: 85 },
  { month: 'May', weight: 81.5, fat: 18.5, performance: 92 },
  { month: 'Jun', weight: 80, fat: 17.2, performance: 98 },
];

const DashboardMetric = ({ label, value, trend, unit }: { label: string, value: string, trend: string, unit: string }) => (
  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
    <p className="text-[10px] font-black text-blue-500/80 group-hover:text-blue-500 font-medium mb-2 transition-colors">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-3xl font-black text-slate-800 leading-none tracking-tighter">{value}</span>
      <span className="text-xs font-bold text-slate-400 mb-1 group-hover:text-slate-500 transition-colors">{unit}</span>
    </div>
    <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-emerald-500">
      <ArrowUpRight size={12} /> {trend}
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="liquid-glass-blue p-8 rounded-[2rem] flex flex-col gap-4 group cursor-pointer hover:bg-blue-500/10 transition-all duration-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none"
    tabIndex={0}
  >
    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 group-focus:scale-110 transition-transform shadow-inner shadow-white/50">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-blue-700 transition-colors">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    <a href="#programs" className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-black text-blue-500 group-hover:text-blue-700 transition-colors font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
      Explore program <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </a>
  </motion.div>
);

const TestimonialCard = ({ name, quote, role, image, delay }: { name: string, quote: string, role: string, image: string, delay: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="liquid-glass p-8 rounded-[2.5rem] border border-blue-100 flex flex-col gap-6 relative group"
  >
    <div className="absolute top-6 right-8 text-blue-500/10">
      <Quote size={40} />
    </div>
    <div className="flex gap-1 text-blue-500">
      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
    </div>
    <p className="text-slate-600 italic leading-relaxed font-medium">"{quote}"</p>
    
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-4 group/author">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xl transition-transform group-hover/author:scale-110" />
        <div>
          <h4 className="font-bold text-slate-800 text-sm tracking-tight">{name}</h4>
          <p className="text-[10px] font-bold text-blue-500 font-medium">{role}</p>
        </div>
      </div>
      
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 outline-none transition-all">
          <Facebook size={12} />
        </button>
        <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 outline-none transition-all">
          <Twitter size={12} />
        </button>
        <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 outline-none transition-all">
          <MessageCircle size={12} />
        </button>
      </div>
    </div>
  </motion.div>
);

const TransformationCard = ({ name, result, duration, beforeImg, afterImg, delay }: { name: string, result: string, duration: string, beforeImg: string, afterImg: string, delay: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="group relative h-[480px] rounded-3xl overflow-hidden liquid-glass border-blue-100/50 shadow-2xl shadow-blue-900/5"
  >
    {/* Default State: Before Image */}
    <img src={beforeImg} alt={`${name} before`} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:opacity-0" />
    
    {/* Hover State: After Image */}
    <img src={afterImg} alt={`${name} after`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000 scale-110 group-hover:scale-100" />
    
    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/10 to-transparent pointer-events-none" />
    
    <div className="absolute top-8 left-8 flex flex-col gap-2">
      <div className="px-4 py-1.5 liquid-glass-blue border-white/50 rounded-full text-[10px] font-black text-blue-600 font-medium">
        {duration}
      </div>
    </div>

    <div className="absolute top-8 right-8 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
      <button className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center text-blue-300 hover:bg-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none">
        <Facebook size={18} />
      </button>
      <button className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center text-blue-300 hover:bg-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none">
        <Twitter size={18} />
      </button>
      <button className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center text-blue-300 hover:bg-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none">
        <MessageCircle size={18} />
      </button>
    </div>

    <div className="absolute inset-x-8 bottom-8 flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-white font-black text-3xl tracking-tighter leading-none mb-1">{name}</h4>
          <p className="text-blue-300 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-500">Elite Performance</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[9px] font-black mb-1">Final Stats</p>
          <p className="text-2xl font-black text-blue-300 tracking-tight leading-none">{result}</p>
        </div>
      </div>
      
      <div className="h-1 w-0 group-hover:w-full bg-blue-500/50 rounded-full transition-all duration-1000 overflow-hidden">
        <motion.div 
          className="h-full bg-blue-400"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
      
      <p className="text-white/70 text-xs font-medium max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-1000 leading-relaxed italic">
        "Mr Man Fitness completely re-engineered my metabolic threshold. The results speak for themselves through Nakuru's elite protocols."
      </p>
    </div>
  </motion.div>
);

const BlogCard = ({ title, category, date, image, delay }: { title: string, category: string, date: string, image: string, delay: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="group liquid-glass rounded-xl overflow-hidden border-blue-50 hover:bg-blue-50/50 transition-all duration-500"
  >
    <div className="aspect-video overflow-hidden relative">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-blue-600">{category}</span>
      </div>
    </div>
    <div className="p-8">
      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 mb-4">
        <Calendar size={12} /> {date}
      </div>
      <h3 className="text-xl font-black text-slate-800 tracking-tighter mb-4 leading-tight group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <button className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 group-hover:translate-x-2 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg pr-4">
        Read insight <ChevronRight size={14} />
      </button>
    </div>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string, key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:text-blue-600 focus-visible:bg-slate-50/50 px-4 -mx-4 rounded-xl"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-bold tracking-tight transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'}`}>{question}</span>
        <div className={`p-2 rounded-full transition-all ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 px-4">
              <p className="text-slate-600 font-medium leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', time: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
    setTimeout(onClose, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-xl p-10 md:p-12 relative shadow-2xl overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Book Consult.</h2>
                  <p className="text-slate-500 font-medium">Engineer your transformation with Mr Man.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 pl-2">Full name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      placeholder="Input Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 pl-2">Email address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      placeholder="mail@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 pl-2">Phone number</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800"
                    placeholder="+254..."
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 pl-2">Preferred date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 pl-2">Preferred time</label>
                    <input 
                      required
                      type="time" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                  Secure assessment slot
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8">
                  <Sparkles size={40} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-4">Request Logged.</h3>
                <p className="text-slate-500 font-medium">Mr Man will review your biometrics profile shortly. Check your email for confirmation.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const pricingTiers = [
  {
    name: "Foundation",
    price: "8,500",
    description: "Ideal for metabolic reset and core engineering.",
    features: ["Biometric Assessment", "3x Group Sessions/Week", "Nutrition Roadmap", "Progress App Access"],
    cta: "Start Evolution",
    highlight: false
  },
  {
    name: "Vanguard",
    price: "15,000",
    description: "The peak performance tier for high-intensity growth.",
    features: ["Advanced Labs", "Unlimited Access", "Personal Nutritionist", "Priority Support", "Neural Profiling"],
    cta: "Go Elite",
    highlight: true
  },
  {
    name: "Titan",
    price: "25,000",
    description: "Fully bespoke engineering for executive performance.",
    features: ["Daily Biometrics", "1-on-1 Clinical Focus", "Personal Chef Sync", "Concierge Recovery", "Bespoke Protocols"],
    cta: "Reserve Titan Slot",
    highlight: false
  }
];

const PricingCard = ({ tier, delay }: { tier: typeof pricingTiers[0], delay: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className={`p-10 rounded-3xl border ${tier.highlight ? 'bg-blue-600 text-white border-blue-500 shadow-2xl shadow-blue-600/30 ring-4 ring-blue-500/10' : 'bg-white text-slate-800 border-slate-100 shadow-xl shadow-blue-900/5'} flex flex-col h-full relative overflow-hidden`}
  >
    {tier.highlight && (
      <div className="absolute top-0 right-0 p-4">
        <span className="bg-white/10 text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-white/20">Recommended</span>
      </div>
    )}
    <h3 className="text-xl font-black tracking-tighter mb-2">{tier.name}</h3>
    <div className="flex items-end gap-1 mb-6">
      <span className="text-sm font-black opacity-60 mb-2 leading-none">Kes</span>
      <span className="text-5xl font-black tracking-tighter leading-none">{tier.price}</span>
      <span className="text-sm font-bold opacity-60 ml-1">/mo</span>
    </div>
    <p className={`text-sm font-medium mb-8 leading-relaxed ${tier.highlight ? 'text-blue-50/80' : 'text-slate-600'}`}>{tier.description}</p>
    <div className="space-y-4 mb-10 flex-1">
      {tier.features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'}`}>
            <Sparkles size={10} />
          </div>
          <span className="text-xs font-bold tracking-tight">{feature}</span>
        </div>
      ))}
    </div>
    <button className={`w-full py-5 rounded-2xl font-black text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 outline-none ${tier.highlight ? 'bg-white text-blue-600 hover:bg-blue-50 focus-visible:ring-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 focus-visible:ring-blue-600'}`}>
      {tier.cta}
    </button>
  </motion.div>
);

const ContactSection = () => (
  <section className="mb-40" id="contact">
    <div className="liquid-glass-blue border-blue-100/50 rounded-3xl p-8 md:p-16 relative overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-[9px] font-black text-white mb-6 rounded-full">
            <MessageCircle size={12} /> Communication Node
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-8">Initialize Contact.</h2>
          <p className="text-slate-600 font-medium leading-relaxed max-w-sm mb-12">
            Speak directly with Mr Man to discuss your biometric status and transformation roadmap.
          </p>
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-lg shadow-blue-500/5">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 mb-1">Pulse Base</p>
                <p className="font-bold text-slate-800">Milimani Ridge, Nakuru</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-lg shadow-blue-500/5">
                <Share2 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 mb-1">Direct Connect</p>
                <p className="font-bold text-slate-800">ops@mrmanfitness.co</p>
              </div>
            </div>
          </div>
        </div>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-blue-900/5">
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 pl-2">Vitals: Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800 text-sm" placeholder="ID Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 pl-2">Channel: Email</label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800 text-sm" placeholder="mail@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 pl-2">System inquiry</label>
              <textarea required rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-bold text-slate-800 text-sm resize-none" placeholder="Describe your performance goals..."></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 outline-none">
              Submit inquiry
            </button>
          </form>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -mr-40 -mt-40" />
    </div>
  </section>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const containerRef = useRef(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const testimonials = [
    {
      name: "Sharon Njeri",
      role: "Nakuru Tech Hub",
      quote: "The personalized attention is unmatched. Mr Man Fitness isn't just a gym; it's high-performance engineering for the body.",
      image: "https://picsum.photos/seed/person1/100"
    },
    {
      name: "Brian Kiprono",
      role: "Professional Athlete",
      quote: "Training at 1,800m altitude with Mr Man's insights has pushed my endurance to levels I never thought possible.",
      image: "https://picsum.photos/seed/person2/100"
    },
    {
      name: "Elena Wangui",
      role: "Business Executive",
      quote: "Finally, a trainer who understands the balance between a demanding career and peak physical health. The hydration protocols are game changers.",
      image: "https://picsum.photos/seed/person3/100"
    }
  ];

  const transformations = [
    {
      name: "Alex M.",
      result: "-22kg fat loss",
      duration: "12 weeks",
      beforeImg: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=800",
      afterImg: "https://images.unsplash.com/photo-1583454110333-e1fdec3f383e?q=80&w=800"
    },
    {
      name: "Faith W.",
      result: "+8kg muscle gain",
      duration: "16 weeks",
      beforeImg: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
      afterImg: "https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=800"
    },
    {
      name: "John K.",
      result: "Athletic rebuild",
      duration: "24 weeks",
      beforeImg: "https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=800",
      afterImg: "https://images.unsplash.com/photo-1517838276535-240361ef7e8c?q=80&w=800"
    }
  ];

  const blogPosts = [
    {
      title: "Optimizing Hypoxic Training at 1,800m Altitude",
      category: "Science",
      date: "Apr 22, 2026",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800"
    },
    {
      title: "The Neuro-Metabolic Connection: Beyond Muscle",
      category: "Performance",
      date: "Apr 15, 2026",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800"
    },
    {
      title: "Rift Valley Fueling: Local Nutrition for Elite Cycles",
      category: "Nutrition",
      date: "Apr 08, 2026",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800"
    }
  ];

  return (
    <div className="relative min-h-screen selection:bg-blue-100 selection:text-blue-600" ref={containerRef}>
      {/* Background Elements */}
      <div className="fixed inset-0 mesh-gradient-light -z-10 opacity-60" />
      <div className="fixed inset-0 bg-white/60 -z-10" />
      
      {/* Hero Background Carousel - Subtle Overlay with Parallax */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.04 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center mix-blend-multiply transition-transform duration-1000"
            style={{ 
              backgroundImage: `url('${heroImages[currentImageIndex]}')`,
              y: bgY,
              scale 
            }}
          />
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="liquid-glass px-8 py-3 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-500/5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Zap size={20} fill="white" className="text-white" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Programs', 'Transformation', 'Pricing', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={item === 'Home' ? '#' : `#${item.toLowerCase()}`} 
                className="text-[10px] font-black text-slate-500 hover:text-blue-600 focus-visible:text-blue-600 transition-colors font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-8 rounded-lg px-2"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:block text-[10px] font-black text-slate-500 hover:text-blue-600 transition-colors px-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="hidden md:block text-xs font-black bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Book Consult
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
              {['Home', 'Programs', 'Transformation', 'Pricing', 'About', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={item === 'Home' ? '#' : `#${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-4xl font-black tracking-tighter text-slate-800 outline-none focus-visible:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl"
                >
                  {item}
                </a>
              ))}
              <hr className="border-slate-100" />
              <button 
                onClick={() => { setIsMenuOpen(false); setIsBookingModalOpen(true); }}
                className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              >
                Book Consult
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="text-slate-500 font-black text-[10px] py-4 outline-none focus-visible:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
              >
                Sign in to portal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        {/* Hero Section */}
        <div className="relative mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[10px] font-black uppercase text-blue-600 mb-8 border border-blue-100 shadow-sm">
              <Sparkles size={14} /> Mr Man Fitness • Nakuru Elite
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[6.5rem] font-black tracking-tighter leading-[0.85] mb-10 text-slate-900">
              Redefine Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Boundary.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-12 leading-relaxed font-medium">
              A scientific approach to peak human condition by Mr Man Fitness. Based in Nakuru, designed for those who demand excellence in every fiber of their being.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
            <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-blue-600 text-white px-12 py-6 rounded-2xl font-black flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-400 outline-none"
              >
                Start Evolution <MoveRight size={22} />
              </motion.button>
              <motion.a 
                href="#studio"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
                whileTap={{ scale: 0.95 }}
                className="liquid-glass border-slate-200 text-slate-800 px-10 py-5 rounded-2xl font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 flex items-center justify-center"
              >
                View Studio
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="hidden xl:block absolute top-0 right-0 w-80 group cursor-default"
          >
            <div className="liquid-glass p-8 rounded-[3rem] flex flex-col gap-8 shadow-2xl shadow-blue-900/5 group-hover:rotate-0 transition-transform duration-700">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <TrendingUp size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-blue-500">Metabolism</p>
                  <p className="text-3xl font-black tracking-tighter text-slate-800">+142%</p>
                </div>
              </div>
              <div className="h-24 flex items-end gap-1.5">
                {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-lg"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"The altitude training in Nakuru combined with this tech is visionary."</p>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/elite/100" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                <p className="text-[10px] font-black text-slate-800">Dr. Kenneth R. <span className="text-blue-500 opacity-50">— Surgeon</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Grid (Programs Directory) */}
        <div className="mb-40" id="programs">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 mb-6 rounded-full border border-blue-100">
                <Dumbbell size={12} /> Service Matrix
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-8">Elite Programs.</h2>
              <p className="text-slate-600 font-medium">Precision physical engineering protocols specialized for human optimization, from core lifts to metabolic weight management.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Dumbbell}
              title="Compound Lifts"
              description="Master the foundational movements. Specialized coaching on squats, deadlifts, and presses for maximum systematic recruitment."
              delay={0.1}
            />
            <FeatureCard 
              icon={Target}
              title="Strength Training"
              description="Progressive resistance protocols designed to increase absolute force output and structural integrity."
              delay={0.2}
            />
            <FeatureCard 
              icon={Activity}
              title="Light Cardio"
              description="Low-intensity steady-state conditioning (LISS) to optimize aerobic base and metabolic recovery without central fatigue."
              delay={0.3}
            />
            <FeatureCard 
              icon={FruitIcon}
              title="Dietary Session"
              description="One-on-one metabolic profiling and nutritional blueprinting for systemic efficiency and peak fueling."
              delay={0.4}
            />
            <FeatureCard 
              icon={TrendingDown}
              title="Weight Loss"
              description="Scientific adipose reduction protocols merging caloric precision with metabolic preservation strategies."
              delay={0.5}
            />
            <FeatureCard 
              icon={Zap}
              title="Weight Gain"
              description="Hypertrophy and mass velocity engineering for those seeking to expand their physical footprint and power."
              delay={0.6}
            />
          </div>
        </div>

        {/* Gallery Bento Grid (Visual proof of studio) */}
        <section className="mb-40" id="studio">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">The Studio.</h2>
              <p className="text-slate-600 font-medium">A sanctuary of focus and high-performance equipment in the heart of Milimani, Nakuru.</p>
            </div>
            <a href="#studio" className="text-xs font-black text-blue-600 bg-blue-50 px-8 py-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">View all spaces</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent p-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-black text-2xl tracking-tighter">Power Zone</span>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="rounded-[2.5rem] overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="rounded-[2.5rem] overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="col-span-2 rounded-[2.5rem] overflow-hidden relative group"
            >
              <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
              <div className="absolute bottom-6 right-8 liquid-glass px-4 py-2 rounded-xl text-[10px] font-black text-blue-600 border-blue-200">Rift Valley Views</div>
            </motion.div>
          </div>
        </section>

        {/* Client Intelligence Dashboard */}
        <section className="mb-40" id="intelligence">
          <div className="liquid-glass-blue border-blue-100/50 rounded-2xl md:rounded-3xl p-6 md:p-16 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-[9px] font-black text-white mb-6 rounded-full shadow-lg shadow-blue-600/20">
                    <Activity size={12} /> Live Biometrics
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-6">Intelligence Dashboard.</h2>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Access your clinical-grade performance data. Track every micro-progress of your transformation engine through Mr Man's proprietary monitoring.
                  </p>
                </div>
                <div className="flex items-center gap-4 liquid-glass p-4 rounded-3xl border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400">Active client</p>
                    <p className="font-black text-slate-800">DANIEL KIPRONO</p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="liquid-glass border-slate-100 p-8 rounded-[3rem] h-[450px]">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="font-black text-slate-800">Mass Velocity</h4>
                        <p className="text-[10px] font-bold text-slate-400">6 month weight transformation</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="text-[9px] font-black text-slate-500">Weight</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-indigo-300" />
                          <span className="text-[9px] font-black text-slate-500">Fat %</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-full pb-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={progressData}>
                          <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255,255,255,0.8)', 
                              backdropFilter: 'blur(10px)',
                              borderRadius: '16px',
                              border: '1px solid rgba(0,0,0,0.05)',
                              fontSize: '10px',
                              fontWeight: '900'
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#2563eb" 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorWeight)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="fat" 
                            stroke="#818cf8" 
                            strokeWidth={4} 
                            fill="transparent" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <DashboardMetric label="Current Weight" value="80.0" unit="KG" trend="-2.1% TOTAL" />
                    <DashboardMetric label="Body Fat" value="17.2" unit="%" trend="-7.5% TOTAL" />
                    <DashboardMetric label="Muscle Index" value="44.8" unit="KG" trend="+1.2% TOTAL" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="liquid-glass border-slate-100 p-8 rounded-[3rem] text-center">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-600/30">
                      <Zap size={32} fill="white" />
                    </div>
                    <h4 className="font-black text-slate-800 mb-2">Performance peak</h4>
                    <p className="text-[10px] font-bold text-slate-400 mb-8">Overall capability score</p>
                    
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="70" 
                          stroke="currentColor" 
                          strokeWidth="12" 
                          fill="transparent" 
                          strokeDasharray={440} 
                          strokeDashoffset={440 * (1 - 0.92)} 
                          className="text-blue-600 transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-slate-800 leading-none">92</span>
                        <span className="text-[10px] font-black text-blue-500">Rank A+</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium italic">"Elite Tier. Conditioning approaching professional athletic standard."</p>
                  </div>

                  <div className="liquid-glass-blue border-blue-200/50 p-8 rounded-[3rem]">
                    <h4 className="font-black text-slate-800 text-sm mb-6 flex items-center gap-2">
                       <LineChartIcon size={16} className="text-blue-600" /> Monthly growth
                    </h4>
                    <div className="space-y-6">
                      {[
                        { label: "Compound Strength", val: 88 },
                        { label: "O2 Efficiency", val: 74 },
                        { label: "Force Output", val: 92 }
                      ].map(stat => (
                        <div key={stat.label}>
                          <div className="flex justify-between text-[10px] font-black mb-2">
                            <span className="text-slate-500">{stat.label}</span>
                            <span className="text-blue-600">{stat.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${stat.val}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-blue-600 rounded-full" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-400/5 blur-[150px] rounded-full" />
          </div>
        </section>

        {/* Transformation Section */}
        <section className="mb-40" id="transformation">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 mb-4 rounded-full border border-blue-100">
                <Target size={12} /> Results Engineering
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9]">Transformations.</h2>
            </div>
            <p className="max-w-xs text-slate-600 font-medium text-sm leading-relaxed text-right">
              Witness the physical manifestation of discipline. Real results, engineered for Nakuru's high-performance clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {transformations.map((t, i) => (
              <TransformationCard key={i} {...t} delay={0.1 + (i * 0.1)} />
            ))}
          </div>
        </section>


        {/* Testimonials Section */}
        <section className="mb-40">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter text-slate-900 leading-none">The Mr Man Effect.</h2>
            <p className="text-slate-500 font-bold text-[10px] mt-6">Voices of the transformation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} delay={i * 0.1} />
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <section className="mb-40" id="about">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800" 
                  alt="Mr Man Fitness Founder" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                <div className="absolute bottom-10 left-10 text-white">
                  <p className="text-[10px] font-black mb-2">Lead Performance Engineer</p>
                  <h3 className="text-4xl font-black tracking-tighter">Mr Man.</h3>
                </div>
              </div>
              {/* Floating Stat */}
              <div className="absolute -right-8 top-1/4 liquid-glass p-6 rounded-3xl shadow-2xl border-white/50 max-w-[180px] hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <Target size={16} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400">Philosophy</span>
                </div>
                <p className="text-xs font-bold text-slate-800">Engineering human potential through clinical data.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 mb-6 rounded-full border border-blue-100">
                <User size={12} /> The Architecture
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-8">Our Philosophy.</h2>
              <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
                <p>
                  At Mr Man Fitness, we believe the body is the ultimate piece of hardware. Our mission is to "re-engineer" human capability using a clinical approach—relying on high-resolution data, metabolic thresholds, and hypoxic conditioning.
                </p>
                <p>
                  Founded by Mr Man, an elite performance scientist with over a decade of experience in the Rift Valley's high-altitude training grounds, we bring a level of physical engineering that transcends traditional personal training.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-black text-blue-600 text-3xl tracking-tighter mb-1">10y+</h4>
                  <p className="text-[10px] font-black text-slate-400">Clinical research</p>
                </div>
                <div>
                  <h4 className="font-black text-blue-600 text-3xl tracking-tighter mb-1">500+</h4>
                  <p className="text-[10px] font-black text-slate-400">Elite evolutions</p>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-slate-100">
                <h4 className="font-black text-slate-800 tracking-tight mb-8">The Specialist Team.</h4>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: "Dr. Sarah", role: "Bio-Nutrition" },
                    { name: "Coach Mike", role: "Force Output" },
                    { name: "Elena K.", role: "Neural Recovery" }
                  ].map(member => (
                    <div key={member.name} className="flex items-center gap-3 liquid-glass px-4 py-2 rounded-full border-slate-100 hover:bg-blue-50 transition-colors group cursor-pointer shadow-sm hover:shadow-md">
                      <div className="w-8 h-8 rounded-full bg-slate-100 bg-[url('https://i.pravatar.cc/100')] bg-cover border border-white group-hover:border-blue-200 transition-colors" />
                      <div>
                        <p className="text-[10px] font-black text-slate-800 leading-none mb-1 group-hover:text-blue-600 transition-colors">{member.name}</p>
                        <p className="text-[8px] font-bold text-blue-400 group-hover:text-blue-500 uppercase tracking-widest leading-none transition-colors">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Video Testimonials Section */}
        <section className="mb-40">
          <div className="bg-slate-900 rounded-3xl p-12 lg:p-20 relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-[10px] font-black text-blue-400 mb-8 tracking-widest uppercase border border-blue-500/30">
                  <Play size={16} /> Raw impact
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
                  Unfiltered <br/>Evolution.
                </h2>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed max-w-sm">
                  Hear directly from the clients who redefined their physical boundaries under our engineering protocols.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400", name: "David L." },
                  { img: "https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=400", name: "Sarah K." }
                ].map((v, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer border border-white/10 shadow-2xl"
                  >
                    <img src={v.img} alt={v.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center text-white shadow-xl shadow-blue-600/40 group-hover:scale-110 transition-transform">
                        <Play size={32} fill="white" className="ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6">
                      <p className="text-[10px] font-black text-blue-400 mb-1">Story</p>
                      <p className="text-white font-black text-lg">{v.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
          </div>
        </section>

        {/* Blog / Insights Section */}
        <section className="mb-40" id="insights">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-[9px] font-black text-white mb-6 rounded-full">
                <BookOpen size={12} /> Intelligence Base
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9]">Performance Blog.</h2>
            </div>
            <button className="text-xs font-black text-blue-600 bg-blue-50 px-8 py-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Explorer archive</button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <BlogCard key={i} {...post} delay={i * 0.1} />
            ))}
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <section className="mb-40" id="pricing">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-[9px] font-black text-slate-900 mb-6 rounded-full border border-slate-200">
               Value Assessment
            </div>
            <h2 className="text-5xl md:text-[6rem] font-black tracking-tighter text-slate-900 leading-none mb-6">Invest in Your System.</h2>
            <p className="text-slate-600 font-medium max-w-xl mx-auto">Transparent tiers designed to match your commitment level and performance goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <PricingCard key={i} tier={tier} delay={i * 0.1} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-40" id="faq">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-[9px] font-black text-slate-900 mb-6 rounded-full border border-slate-200">
                <ChevronDown size={12} /> Optimization intel
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-8">Frequently questioned.</h2>
              <p className="text-slate-600 font-medium max-w-sm">Everything you need to know about starting your physical evolution program at our Nakuru base.</p>
            </div>
            <div className="liquid-glass border-slate-50 p-8 md:p-12 rounded-3xl shadow-xl shadow-blue-900/5">
              {[
                { 
                  q: "How do I initiate my evolution?", 
                  a: "The process begins with a clinical consultation where we analyze your current biometrics, metabolic threshold, and lifestyle factors in Nakuru." 
                },
                { 
                  q: "Is the studio accessible to beginners?", 
                  a: "Mr Man Fitness specializes in optimizing every level of human capacity. Whether you're starting from zero or hitting high-performance peaks, our engineering is tailored to your status." 
                },
                { 
                  q: "What makes the Milimani base unique?", 
                  a: "Our location at 1,800m altitude provides a natural hypoxic advantage, which we leverage with elite equipment and biometric monitoring unmatched in the Rift Valley." 
                },
                { 
                  q: "Are the programs remote-compatible?", 
                  a: "While our Nakuru pulse-base offers the complete physical experience, we provide remote coaching elite tiers that leverage our biometric tracking apps."
                }
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
        <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </main>

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
              {['Home', 'Programs', 'Transformations', 'Studio'].map(item => (
                <a key={item} href={item === 'Home' ? '#' : `#${item.toLowerCase()}`} className="hover:text-blue-500 transition-all inline-flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg px-2 -mx-2">
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-blue-500 font-black text-[10px] uppercase">Contact base</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                  Milimani Ridge, Elite Center<br/>Nakuru City, Kenya
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={14} className="text-blue-500 shrink-0 mt-1" />
                <p className="text-sm font-medium text-slate-400">
                  05:00 am — 09:00 pm
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-blue-500 font-black text-[10px] uppercase">Intel drop</h4>
            <p className="text-xs text-slate-500 font-medium">Get the latest performance data and studio updates.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-500 transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6 text-[10px] font-black text-slate-500 uppercase relative z-10">
          <p>© 2026 Mr Man Fitness • All systems optimized</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-500 transition-colors outline-none focus-visible:text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors outline-none focus-visible:text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm">Terms</a>
            <a href="#" className="hover:text-blue-500 transition-colors outline-none focus-visible:text-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

