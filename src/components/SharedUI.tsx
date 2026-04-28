import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ArrowUpRight, 
  Quote, 
  Star, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* --- Shared Components --- */

export const DashboardMetric = ({ label, value, trend, unit }: { label: string, value: string, trend: string, unit: string }) => (
  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
    <p className="text-[10px] font-black text-emerald-500/80 group-hover:text-emerald-500 font-medium mb-2 transition-colors uppercase tracking-widest">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-3xl font-black text-slate-800 leading-none tracking-tighter">{value}</span>
      <span className="text-xs font-bold text-slate-400 mb-1 group-hover:text-slate-500 transition-colors">{unit}</span>
    </div>
    <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-emerald-500">
      <ArrowUpRight size={12} /> {trend}
    </div>
  </div>
);

export const FeatureCard = ({ icon: Icon, title, description, delay, color = 'rose' }: { icon: any, title: string, description: string, delay: number, color?: 'blue' | 'rose' | 'emerald', key?: any }) => {
  const colorClasses = {
    blue: 'liquid-glass-blue hover:bg-blue-500/10 focus-visible:ring-blue-500 text-blue-600 group-hover:text-blue-700',
    rose: 'liquid-glass-rose hover:bg-rose-500/10 focus-visible:ring-rose-500 text-rose-600 group-hover:text-rose-700',
    emerald: 'liquid-glass-emerald hover:bg-emerald-500/10 focus-visible:ring-emerald-500 text-emerald-600 group-hover:text-emerald-700'
  };

  const currentColors = colorClasses[color];
  const bgBadge = {
    blue: 'bg-blue-500/10',
    rose: 'bg-rose-500/10',
    emerald: 'bg-emerald-500/10'
  }[color];

  const textLink = {
    blue: 'text-blue-500 group-hover:text-blue-700 focus-visible:ring-blue-500',
    rose: 'text-rose-500 group-hover:text-rose-700 focus-visible:ring-rose-500',
    emerald: 'text-emerald-500 group-hover:text-emerald-700 focus-visible:ring-emerald-500'
  }[color];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={`${currentColors.split(' ').slice(0,3).join(' ')} p-8 rounded-[2rem] flex flex-col gap-4 group cursor-pointer transition-all duration-500 focus-visible:ring-2 focus-visible:ring-offset-2 outline-none`}
      tabIndex={0}
    >
      <div className={`w-12 h-12 rounded-2xl ${bgBadge} flex items-center justify-center ${currentColors.split(' ').slice(4,5).join(' ')} group-hover:scale-110 group-focus:scale-110 transition-transform shadow-inner shadow-white/50`}>
        <Icon size={24} />
      </div>
      <h3 className={`text-xl font-bold tracking-tight text-slate-800 ${currentColors.split(' ').slice(5,6).join(' ')} transition-colors`}>{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
      <Link to="/programs" className={`mt-auto pt-4 flex items-center gap-2 text-[10px] font-black ${textLink} transition-colors font-medium outline-none focus-visible:ring-2 rounded-lg`}>
        Explore program <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

export const TestimonialCard = ({ name, quote, role, image, delay }: { name: string, quote: string, role: string, image: string, delay: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="liquid-glass p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col gap-6 relative group"
  >
    <div className="absolute top-6 right-8 text-emerald-500/10">
      <Quote size={40} />
    </div>
    <div className="flex gap-1 text-emerald-500">
      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
    </div>
    <p className="text-slate-600 italic leading-relaxed font-medium">"{quote}"</p>
    
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-4 group/author">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xl transition-transform group-hover/author:scale-110" />
        <div>
          <h4 className="font-bold text-slate-800 text-sm tracking-tight">{name}</h4>
          <p className="text-[10px] font-bold text-emerald-500 font-medium uppercase tracking-widest">{role}</p>
        </div>
      </div>
      
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <button className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none transition-all">
          <Facebook size={12} />
        </button>
        <button className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none transition-all">
          <Twitter size={12} />
        </button>
        <button className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none transition-all">
          <MessageCircle size={12} />
        </button>
      </div>
    </div>
  </motion.div>
);

export const TransformationCard = ({ name, result, duration, beforeImg, afterImg, delay }: { name: string, result: string, duration: string, beforeImg: string, afterImg: string, delay: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="group relative h-[480px] rounded-3xl overflow-hidden liquid-glass border-emerald-100/50 shadow-2xl shadow-emerald-900/5"
  >
    <img src={beforeImg} alt={`${name} before`} className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-1000 group-hover:opacity-0" />
    <img src={afterImg} alt={`${name} after`} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000 scale-110 group-hover:scale-100" />
    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/10 to-transparent pointer-events-none" />
    <div className="absolute top-8 left-8 flex flex-col gap-2">
      <div className="px-4 py-1.5 liquid-glass-emerald border-white/50 rounded-full text-[10px] font-black text-emerald-600 font-medium">
        {duration}
      </div>
    </div>
    <div className="absolute inset-x-8 bottom-8 flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-white font-black text-3xl tracking-tighter leading-none mb-1">{name}</h4>
          <p className="text-emerald-300 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 uppercase tracking-widest">Elite Performance</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[9px] font-black mb-1">Final Stats</p>
          <p className="text-2xl font-black text-emerald-300 tracking-tight leading-none">{result}</p>
        </div>
      </div>
      <div className="h-1 w-0 group-hover:w-full bg-emerald-500/50 rounded-full transition-all duration-1000 overflow-hidden" />
      <p className="text-white/70 text-xs font-medium max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-1000 leading-relaxed italic">
        "Mr Man Fitness completely re-engineered my metabolic threshold. The results speak for themselves through Nakuru's elite protocols."
      </p>
    </div>
  </motion.div>
);

export const BlogCard = ({ title, category, date, image, delay }: { title: string, category: string, date: string, image: string, delay: number }) => (
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

export const LoadingSpinner = ({ size = 24, color = "currentColor" }: { size?: number, color?: string }) => (
  <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="absolute inset-0 rounded-full border-2 border-slate-200"
      style={{ borderTopColor: color }}
    />
    <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
  </div>
);

