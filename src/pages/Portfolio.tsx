import React from 'react';
import { motion } from 'motion/react';
import { useModal } from '../context/ModalContext';
import { TransformationCard, TestimonialCard } from '../components/SharedUI';
import { 
  Zap, 
  Target, 
  Activity, 
  Award, 
  TrendingUp, 
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const transformations = [
  {
    name: "Dennis Maina",
    result: "-15kg / +4kg Muscle",
    duration: "12 Weeks",
    beforeImg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
    afterImg: "https://images.unsplash.com/photo-1583454110551-21f2fa2ae617?q=80&w=800",
    delay: 0.1
  },
  {
    name: "Sarah Wambui",
    result: "Body Recomp / Toned",
    duration: "8 Weeks",
    beforeImg: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800",
    afterImg: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800",
    delay: 0.2
  },
  {
    name: "John Kiarie",
    result: "Peak Performance",
    duration: "16 Weeks",
    beforeImg: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=800",
    afterImg: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800",
    delay: 0.3
  }
];

const testimonials = [
  {
    name: "Michael Mutua",
    role: "CEO, Tech Hub",
    quote: "The personalized approach at Mr Man Fitness is unlike anything else in Nakuru. I've gained more than just muscle; I've gained a new level of focus.",
    image: "https://i.pravatar.cc/150?u=michael",
    delay: 0.1
  },
  {
    name: "Lydia Kemunto",
    role: "Marathon Runner",
    quote: "Every session is engineered for results. The attention to detail in my training plan helped me shave minutes off my personal best.",
    image: "https://i.pravatar.cc/150?u=lydia",
    delay: 0.2
  },
  {
    name: "James Odhiambo",
    role: "Corporate Attorney",
    quote: "Finding time for fitness was impossible until I joined Mr Man. The efficiency of the workouts is exactly what a busy professional needs.",
    image: "https://i.pravatar.cc/150?u=james",
    delay: 0.3
  }
];

export default function PortfolioPage() {
  const { setIsBookingModalOpen } = useModal();

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-[10px] font-black text-emerald-600 mb-6 rounded-full border border-emerald-200 uppercase tracking-widest">
           <Award size={12} /> Success Archive 2026
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.8] mb-8">
          The <br/>Portfolio.
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          Real people. Real results. Witness the physical transformations of our elite athletes and high-performers in Nakuru.
        </p>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
        {[
          { label: "Client Success", value: "500+", icon: Users, color: "blue" },
          { label: "Muscle Gained", value: "1.2k kg", icon: TrendingUp, color: "rose" },
          { label: "Fat Lost", value: "2.5k kg", icon: Activity, color: "emerald" },
          { label: "Focus Hours", value: "10k+", icon: Target, color: "blue" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="liquid-glass p-6 rounded-3xl border-slate-100 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'rose' ? 'bg-rose-50 text-rose-600' :
              'bg-emerald-50 text-emerald-600'
            } group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <h4 className="text-2xl font-black text-slate-800 tracking-tighter">{stat.value}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Transformations Gallery */}
      <section className="mb-40">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 leading-none mb-4">Transformations.</h3>
            <p className="text-slate-500 font-medium">Hover or tap cards to see the 'Before' state.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <Sparkles size={12} /> Verified Results
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((item, index) => (
            <TransformationCard key={index} {...item} />
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="mb-40">
        <div className="text-center mb-20">
          <h3 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">Client Success Stories.</h3>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">The words of those who have redefined their boundaries and committed to absolute excellence.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <TestimonialCard key={index} {...item} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="liquid-glass p-12 md:p-24 rounded-[4rem] text-center relative overflow-hidden border-emerald-50 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-[10px] font-black text-white mb-8 rounded-full">
            <Zap size={14} fill="white" /> Join The Ranks
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none mb-8">Ready to write your <br/>own success story?</h2>
          <p className="text-slate-600 font-medium max-w-xl mx-auto mb-12 leading-relaxed text-lg">
            Every elite transformation starts with a single session. Commit to the plan and witness your own evolution.
          </p>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-rose-600 text-white px-12 py-6 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-rose-600/30 hover:bg-rose-700 active:scale-95 uppercase tracking-widest flex items-center justify-center gap-4 mx-auto"
          >
            Start Your Plan <ChevronRight size={20} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full -mr-40 -mt-40" />
      </section>
    </div>
  );
}
