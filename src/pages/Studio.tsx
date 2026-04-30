import React from 'react';
import { motion } from 'motion/react';
import { useModal } from '../context/ModalContext';
import { 
  Dumbbell, 
  Wind, 
  Zap, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Coffee, 
  Maximize2,
  ChevronRight,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudioZone = ({ title, description, image, features, delay }: { title: string, description: string, image: string, features: string[], delay: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="group relative overflow-hidden rounded-[3rem] liquid-glass border-emerald-50 hover:border-emerald-200 transition-all duration-700 min-h-[600px] flex flex-col"
  >
    <div className="absolute inset-0 z-0">
      <img src={image} alt={title} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
    </div>
    
    <div className="relative z-10 mt-auto p-10 md:p-14">
      <div className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black text-white mb-6 rounded-full shadow-lg ${
        delay === 0.1 ? 'bg-rose-600 shadow-rose-600/30' : 
        delay === 0.2 ? 'bg-blue-600 shadow-blue-600/30' : 
        'bg-emerald-600 shadow-emerald-600/30'
      }`}>
        Zone Precision
      </div>
      <h2 className="text-[var(--text-fluid-h2)] font-black tracking-tighter text-white mb-4 leading-[0.8]">{title}</h2>
      <p className="text-slate-300 font-medium mb-8 max-w-xl leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-3">
        {features.map((feature, i) => {
          const colors = [
            'bg-rose-500/20 border-rose-500/30 text-rose-100',
            'bg-blue-500/20 border-blue-500/30 text-blue-100',
            'bg-emerald-500/20 border-emerald-500/30 text-emerald-100'
          ];
          return (
            <span key={i} className={`px-4 py-2 backdrop-blur-md border rounded-xl text-[10px] font-black uppercase tracking-widest ${colors[i % 3]}`}>
              {feature}
            </span>
          );
        })}
      </div>
    </div>
  </motion.div>
);

export default function StudioPage() {
  const { setIsBookingModalOpen, setIsAuthModalOpen } = useModal();
  const { user } = useAuth();

  const handleBookingClick = () => {
    if (user) {
      setIsBookingModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  const zones = [
    {
      title: "The Iron Sanctum",
      description: "Our dedicated compound lifting arena. Engineered with elite-grade racks and calibrated plates to ensure every gram of resistance is precisely measured.",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200",
      features: ["Custom Racks", "Eleiko Calibration", "Deadlift Platforms"],
      delay: 0.1
    },
    {
      title: "Hypoxic Chamber",
      description: "Simulation of high-altitude environments. Nakuru's natural 1,800m elevation enhanced with oxygen control for maximum metabolic stress and VO2 optimization.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
      features: ["Oxygen Control", "Altitude Tracking", "Cardiac Monitors"],
      delay: 0.2
    },
    {
      title: "Neural Engine Room",
      description: "A specialized zone for high-performance training. Focus on speed, agility, and mind-body coordination training plans.",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1200",
      features: ["Reaction Lights", "Precision Mats", "High-Speed Optics"],
      delay: 0.3
    }
  ];

  return (
    <div className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-[10px] font-black text-blue-600 mb-6 rounded-full border border-blue-200 uppercase tracking-widest">
           <MapPin size={12} /> Location Index 1.0
        </div>
        <h1 className="text-[var(--text-fluid-h1)] font-black tracking-tighter text-slate-900 leading-[0.8] mb-8">
          The <br/>Studio.
        </h1>
        <p className="text-[var(--text-fluid-body)] text-slate-500 font-medium max-w-2xl leading-relaxed">
          Based in Milimani, Nakuru. A private laboratory for human performance, designed for total focus and absolute physical engineering.
        </p>
      </motion.div>

      {/* Grid Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-32">
        {[
          { icon: ShieldCheck, title: "Private Access", desc: "Limited membership for maximum focus.", color: "rose" },
          { icon: Maximize2, title: "Elite Gear", desc: "Sourced from the world's leading brands.", color: "blue" },
          { icon: Coffee, title: "Recovery Lounge", desc: "Post-training metabolic refueling.", color: "emerald" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`liquid-glass border-slate-100 p-8 rounded-3xl group hover:bg-slate-50 transition-colors border-l-4 ${
              item.color === 'rose' ? 'border-l-rose-500' : 
              item.color === 'blue' ? 'border-l-blue-500' : 
              'border-l-emerald-500'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${
              item.color === 'rose' ? 'bg-rose-600 text-white shadow-rose-600/20' : 
              item.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-600/20' : 
              'bg-emerald-600 text-white shadow-emerald-600/20'
            }`}>
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Zones */}
      <div className="space-y-12">
        {zones.map((zone, index) => (
          <StudioZone key={index} {...zone} />
        ))}
      </div>

      {/* Call to action */}
      <section className="mt-40 liquid-glass p-12 md:p-24 rounded-[4rem] text-center relative overflow-hidden border-blue-100 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-[10px] font-black text-white mb-8 rounded-full">
            <Sparkles size={14} fill="white" /> Reservation Required
          </div>
          <h2 className="text-[var(--text-fluid-h2)] font-black tracking-tighter text-slate-900 leading-[0.8] mb-8">Ready to enter <br/>the Sanctum?</h2>
          <p className="text-slate-600 font-medium max-w-xl mx-auto mb-12 leading-relaxed text-lg">
            We value privacy and focus. Studio visits are strictly by appointment to ensure every athlete has the optimal environment for their evolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
              onClick={handleBookingClick}
              className="bg-blue-600 text-white px-12 py-6 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 uppercase tracking-widest"
            >
              Book Session
            </button>
            <div className="inline-flex items-center gap-4 px-8 py-5 text-slate-400 font-bold bg-slate-50 rounded-2xl border border-slate-100">
               <MapPin size={20} className="text-blue-500" /> Milimani, Nakuru
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -mr-40 -mt-40" />
      </section>
    </div>
  );
}
