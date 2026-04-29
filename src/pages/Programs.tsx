import React from 'react';
import { motion } from 'motion/react';
import { useModal } from '../context/ModalContext';
import { 
  Dumbbell, 
  Target, 
  Activity, 
  Apple as FruitIcon, 
  TrendingDown, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Timer, 
  Flame, 
  Scale,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProgramDetailCard = ({ 
  icon: Icon, 
  title, 
  description, 
  benefits, 
  intensity, 
  duration, 
  image,
  delay,
  color
}: { 
  icon: any, 
  title: string, 
  description: string, 
  benefits: string[], 
  intensity: string, 
  duration: string,
  image: string,
  delay: number,
  color: 'blue' | 'rose' | 'emerald',
  key?: any 
}) => {
  const { setIsBookingModalOpen, setIsAuthModalOpen } = useModal();
  const { user } = useAuth();
  
  const handleBooking = () => {
    if (user) {
      setIsBookingModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={`liquid-glass rounded-[3rem] border transition-all duration-500 shadow-xl relative overflow-hidden ${
        color === 'blue' ? 'border-blue-50 group hover:border-blue-200 shadow-blue-900/5' :
        color === 'rose' ? 'border-rose-50 group hover:border-rose-200 shadow-rose-900/5' :
        'border-emerald-50 group hover:border-emerald-200 shadow-emerald-900/5'
      }`}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Visual Section */}
        <div className="lg:w-1/3 h-64 lg:h-auto relative overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 shadow-inner hidden lg:block" />
          <div className={`absolute top-6 left-6 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl ${
            color === 'blue' ? 'text-blue-600' :
            color === 'rose' ? 'text-rose-600' :
            'text-emerald-600'
          }`}>
            <Icon size={24} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 md:p-12 space-y-8 relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
            <Icon size={120} />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-800 leading-none mb-2">{title}</h2>
              <div className="flex gap-4">
                <span className={`text-[10px] font-black uppercase flex items-center gap-1 ${
                  color === 'rose' ? 'text-rose-500' :
                  color === 'blue' ? 'text-blue-500' :
                  'text-emerald-500'
                }`}>
                  <Flame size={12} /> {intensity} Intensity
                </span>
                <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <Timer size={12} /> {duration}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 min-w-[200px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase text-slate-400">Technical Load</span>
                <span className={`text-[9px] font-black ${
                  color === 'blue' ? 'text-blue-600' :
                  color === 'rose' ? 'text-rose-600' :
                  'text-emerald-600'
                }`}>85%</span>
              </div>
              <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full w-[85%] ${
                  color === 'blue' ? 'bg-blue-600' :
                  color === 'rose' ? 'bg-rose-600' :
                  'bg-emerald-600'
                }`} />
              </div>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
            {description}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span className="text-sm font-bold text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <button 
              onClick={handleBooking}
              className={`font-black px-10 py-4 rounded-2xl text-xs transition-all shadow-xl flex items-center justify-center gap-2 group/btn uppercase tracking-widest text-white ${
                color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/10' :
                color === 'rose' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/10' :
                'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/10'
              }`}
            >
              Book Session <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProgramsPage() {
  const { setIsBookingModalOpen, setIsAuthModalOpen } = useModal();
  const { user } = useAuth();

  const handleBookingClick = () => {
    if (user) {
      setIsBookingModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  const programs = [
    {
      icon: Dumbbell,
      title: "Compound Lifts",
      intensity: "High",
      duration: "60 mins",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
      description: "Master the foundational movements that build absolute strength. We focus on the Big Three (Squat, Bench, Deadlift) and their variations through technical precision and neurological adaptation.",
      benefits: ["Maximal Strength Gain", "Bone Density Improvement", "Hormonal Optimization", "Structural Integrity"],
      delay: 0.1,
      color: 'rose' as const
    },
    {
      icon: Target,
      title: "Strength Training",
      intensity: "Moderate-High",
      duration: "75 mins",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
      description: "A comprehensive training plan designed for muscle growth and power production. We use structured models to ensure consistent progress without hitting plateaus.",
      benefits: ["Muscle Mass Growth", "Power Output", "Metabolic Flexibility", "Injury Resilience"],
      delay: 0.2,
      color: 'emerald' as const
    },
    {
      icon: Activity,
      title: "Light Cardio",
      intensity: "Low-Moderate",
      duration: "45 mins",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800",
      description: "LISS (Low-Intensity Steady State) conditioning optimized for heart health and active recovery. Designed to build an aerobic base and improve systemic blood flow.",
      benefits: ["Aerobic Capacity", "Recovery Acceleration", "Stamina Development", "Endurance Base"],
      delay: 0.3,
      color: 'blue' as const
    },
    {
      icon: FruitIcon,
      title: "Dietary Session",
      intensity: "Informational",
      duration: "90 mins",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800",
      description: "One-on-one consultation focused on energy levels and nutritional optimization. We design your nutrition to match your training phases and lifestyle demands.",
      benefits: ["Metabolic Efficiency", "Macro-Nutrient Balance", "Cognitive Sharpness", "Peak Performance Fueling"],
      delay: 0.4,
      color: 'emerald' as const
    },
    {
      icon: TrendingDown,
      title: "Weight Loss",
      intensity: "Varies",
      duration: "Ongoing",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
      description: "Scientific adipose reduction through caloric precision and thermogenic optimization. We focus on fat loss while strictly preserving lean muscle mass.",
      benefits: ["Body Fat Reduction", "Insulin Sensitivity", "Energy Consistency", "Systemic De-inflammation"],
      delay: 0.5,
      color: 'blue' as const
    },
    {
      icon: Zap,
      title: "Weight Gain",
      intensity: "High",
      duration: "Ongoing",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800",
      description: "Strategic muscle building for those seeking to maximize their physical frame. We combine high-volume training with specialized fueling plans.",
      benefits: ["Mass Velocity", "Size Expansion", "Absolute Power", "Volume Threshold Increase"],
      delay: 0.6,
      color: 'rose' as const
    }
  ];

  return (
    <div className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-[10px] font-black text-blue-600 mb-6 rounded-full border border-blue-200 uppercase tracking-widest">
           Service Matrix 2026
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.8] mb-8">
          Elite <br/>Training.
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          The Mr Man Fitness methodology: A rigorous selection of physical optimization programs designed for Nakuru's highest achievers.
        </p>
      </motion.div>

      <div className="space-y-12">
        {programs.map((program, index) => (
          <ProgramDetailCard key={index} {...program} />
        ))}
      </div>

      <section className="mt-40 liquid-glass p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden border-rose-100 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600 text-[10px] font-black text-white mb-8 rounded-full">
            <Zap size={12} fill="white" /> Biological Reserve
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none mb-8">Not sure which path to choose?</h2>
          <p className="text-slate-600 font-medium max-w-xl mx-auto mb-12 leading-relaxed">
            Every body is unique. We recommend a full health assessment to determine the most efficient plan for your current fitness level.
          </p>
          <button 
            onClick={handleBookingClick}
            className="bg-rose-600 text-white px-12 py-6 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-rose-600/30 hover:bg-rose-700 active:scale-95 uppercase tracking-widest flex items-center justify-center gap-4 mx-auto"
          >
            Book Session <ChevronRight size={20} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -mr-40 -mt-40" />
      </section>
    </div>
  );
}
