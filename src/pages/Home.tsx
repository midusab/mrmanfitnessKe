import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  MapPin, 
  ChevronRight, 
  MoveRight,
  Mail,
  Phone,
  Dumbbell,
  Apple as FruitIcon,
  Sparkles,
  ShieldCheck,
  Brain,
  Activity,
  User,
  Play,
  ChevronDown,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  DashboardMetric, 
  FeatureCard, 
  TestimonialCard, 
  TransformationCard, 
  BlogCard 
} from '../components/SharedUI';


const pricingTiers = [
  {
    name: "Foundation",
    price: "8,500",
    description: "Ideal for metabolic reset and core engineering.",
    features: ["Biometric Assessment", "3x Group Sessions/Week", "Nutrition Roadmap", "Progress App Access"],
    cta: "Book Session",
    highlight: false
  },
  {
    name: "Vanguard",
    price: "15,000",
    description: "The peak performance tier for high-intensity growth.",
    features: ["Advanced Labs", "Unlimited Access", "Personal Nutritionist", "Priority Support", "Neural Profiling"],
    cta: "Book Session",
    highlight: true
  },
  {
    name: "Titan",
    price: "25,000",
    description: "Fully bespoke engineering for executive performance.",
    features: ["Daily Biometrics", "1-on-1 Clinical Focus", "Personal Chef Sync", "Concierge Recovery", "Bespoke Protocols"],
    cta: "Book Session",
    highlight: false
  }
];

const PricingCard = ({ tier, delay }: { tier: typeof pricingTiers[0], delay: number, key?: any }) => {
  const { setIsBookingModalOpen } = useModal();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={`p-10 rounded-3xl border ${tier.highlight ? 'bg-rose-600 text-white border-rose-500 shadow-2xl shadow-rose-600/30 ring-4 ring-rose-500/10' : 'bg-white text-slate-800 border-slate-100 shadow-xl shadow-rose-900/5'} flex flex-col h-full relative overflow-hidden`}
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
      <p className={`text-sm font-medium mb-8 leading-relaxed ${tier.highlight ? 'text-rose-50/80' : 'text-slate-600'}`}>{tier.description}</p>
      <div className="space-y-4 mb-10 flex-1">
        {tier.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-white/10 text-white' : 'bg-rose-50 text-rose-600'}`}>
              <Sparkles size={10} />
            </div>
            <span className="text-xs font-bold tracking-tight">{feature}</span>
          </div>
        ))}
      </div>
      <button 
        onClick={() => setIsBookingModalOpen(true)}
        className={`w-full py-5 rounded-2xl font-black text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 outline-none ${tier.highlight ? 'bg-white text-rose-600 hover:bg-rose-50 focus-visible:ring-white' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20 focus-visible:ring-rose-600'}`}
      >
        {tier.cta}
      </button>
    </motion.div>
  );
};

export default function HomePage() {
  const containerRef = useRef(null);
  const { setIsBookingModalOpen } = useModal();
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

  const [blogPosts] = useState([
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
  ]);

  const [realTestimonials, setRealTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(testimonialsRef, orderBy('created_at', 'desc'), limit(6));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (data && data.length > 0) {
          setRealTestimonials(data);
        }
      } catch (e) {
        console.error("Testimonials fetch error:", e);
        handleFirestoreError(e, OperationType.LIST, 'testimonials');
      }
    };
    fetchTestimonials();
  }, []);

  const activeTestimonials = realTestimonials.length > 0 ? realTestimonials : testimonials;

  return (
    <div ref={containerRef}>
      {/* Hero Background */}
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

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        {/* Hero Section */}
        <section className="relative mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[10px] font-black uppercase text-blue-600 mb-8 border border-blue-100 shadow-sm">
              <Sparkles size={14} /> Mr Man Fitness • Nakuru Elite
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 text-slate-900">
              Redefine Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-blue-600 to-emerald-500">
                Boundary.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-12 leading-relaxed font-medium">
              A scientific approach to peak human condition by Mr Man Fitness. Based in Nakuru, designed for those who demand excellence in every fiber of their being.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(225, 29, 72, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-rose-600 text-white px-12 py-6 rounded-2xl font-black flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(225,29,72,0.3)] hover:bg-rose-700 focus-visible:ring-4 focus-visible:ring-rose-400 outline-none"
              >
                Book Session <ChevronRight size={22} />
              </motion.button>
              <Link 
                to="/studio"
                className="liquid-glass border-slate-200 text-slate-800 px-10 py-5 rounded-2xl font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 flex items-center justify-center hover:bg-white"
              >
                View Studio
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="hidden xl:block absolute top-0 right-0 w-80 group cursor-default"
          >
            <div className="liquid-glass p-8 rounded-[3rem] flex flex-col gap-8 shadow-2xl shadow-emerald-900/5 group-hover:rotate-0 transition-transform duration-700">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <TrendingUp size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-500">Metabolism</p>
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
                    className="flex-1 bg-gradient-to-t from-emerald-600/20 to-emerald-500 rounded-lg"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"The altitude training in Nakuru combined with this tech is visionary."</p>
              <div className="flex items-center gap-3">
                <img src="https://picsum.photos/seed/elite/100" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                <p className="text-[10px] font-black text-slate-800">Dr. Kenneth R. <span className="text-emerald-500 opacity-50">— Surgeon</span></p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Quick Programs Access */}
        <section className="mb-40" id="programs">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[9px] font-black text-blue-600 mb-6 rounded-full border border-blue-100">
                <Dumbbell size={12} /> Service Matrix
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-8">
                Elite Programs.
              </h2>
              <p className="text-slate-600 font-medium">Precision physical engineering protocols specialized for human optimization.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Dumbbell} title="Compound Lifts" description="Master the foundational movements. Specialized coaching on squats, deadlifts, and presses." delay={0.1} color="rose" />
            <FeatureCard icon={Target} title="Strength Training" description="Progressive resistance protocols designed to increase absolute force output." delay={0.2} color="blue" />
            <FeatureCard icon={Activity} title="Light Cardio" description="Low-intensity steady-state conditioning (LISS) to optimize aerobic base." delay={0.3} color="emerald" />
          </div>
        </section>

        {/* Gallery Bento Grid */}
        <section className="mb-40" id="studio">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">The Studio.</h2>
              <p className="text-slate-600 font-medium">A sanctuary of focus and high-performance equipment in the heart of Milimani, Nakuru.</p>
            </div>
            <Link to="/studio" className="text-xs font-black text-blue-600 bg-blue-50 px-8 py-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 uppercase tracking-widest text-center">Enter Studio</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            <motion.div whileHover={{ scale: 0.98 }} className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="rounded-[2.5rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="rounded-[2.5rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="col-span-2 rounded-[2.5rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        </section>


        {/* Transformation Section */}
        <section className="mb-40" id="transformation">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-800 leading-[0.9]">Transformations.</h2>
            <p className="max-w-xs text-slate-600 font-medium text-sm text-right">Real results, engineered for Nakuru's highest achievers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {transformations.map((t, i) => (
              <TransformationCard key={i} {...t} delay={0.1 + (i * 0.1)} />
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-40" id="testimonials">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6">
              Voice of the Elite.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {activeTestimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} delay={0.1 + (i * 0.1)} />
            ))}
          </div>
        </section>

        {/* Pricing Tiers Section */}
        <div className="mb-40" id="pricing">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6">
              Invest in Your Health
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <PricingCard key={i} tier={tier} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Mindset: Internal Locus of Control */}
        <section className="mb-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[10px] font-black text-blue-600 rounded-full border border-blue-100 uppercase tracking-widest">
                The Architect Mindset
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Master Your <br/>
                <span className="text-blue-600">Internal Locus.</span>
              </h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
                At Mr Man Fitness, we believe performance is 20% mechanics and 80% agency. True evolution starts when you realize you aren't just reacting to your environment—you are engineering it.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Brain, title: "Mental Sovereignty", desc: "Shift from 'I have to' to 'I choose to'. Own every rep and every recovery protocol.", color: "blue" },
                  { icon: Zap, title: "Decisive Action", desc: "Shorten the gap between intent and execution. Eliminate 'drift' from your daily routine.", color: "rose" },
                  { icon: ShieldCheck, title: "Absolute Ownership", desc: "No excuses. No external blame. Your results are a direct output of your internal state.", color: "emerald" }
                ].map((pillar, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 ${
                      pillar.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-600/20' : 
                      pillar.color === 'rose' ? 'bg-rose-600 text-white shadow-rose-600/20' : 
                      'bg-emerald-600 text-white shadow-emerald-600/20'
                    }`}>
                      <pillar.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-1">{pillar.title}</h4>
                      <p className="text-sm text-slate-500 font-medium max-w-sm">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[4rem] bg-slate-900 overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" 
                  alt="Focused Athlete" 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 p-8 liquid-glass-blue border-white/20 rounded-[2.5rem]">
                  <p className="text-white text-2xl font-black italic tracking-tight mb-4">
                    "Control the variable that matters most: Yourself."
                  </p>
                  <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">— Protocol Alpha-01</p>
                </div>
              </div>
              
              {/* Decorative Floating Stats */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-6 bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Agency Index</p>
                    <p className="text-xl font-bold text-slate-800">98.4%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-40" id="contact">
          <div className="liquid-glass p-8 md:p-20 rounded-[3rem] overflow-hidden relative border-slate-100/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 blur-[100px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[100px] rounded-full -ml-48 -mb-48" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-[9px] font-black text-rose-600 mb-6 rounded-full border border-rose-100">
                  ESTABLISH CONNECTION
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-none">Reach Out.</h2>
                <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 max-w-md">
                  Whether you're ready to initiate your transformation or have technical inquiries, our elite support team is online.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Protocol</p>
                      <p className="text-xl font-bold text-slate-800">protocols@mrman.fit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Line</p>
                      <p className="text-xl font-bold text-slate-800">+254 700 000 000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base coordinates</p>
                      <p className="text-xl font-bold text-slate-800">Milimani, Nakuru City</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-rose-900/5 border border-slate-50">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Identity</label>
                      <input type="text" placeholder="Your Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-bold text-slate-800" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Comm Link</label>
                      <input type="email" placeholder="Email Address" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-bold text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Intel Query</label>
                    <textarea rows={4} placeholder="Protocol inquiry..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-bold text-slate-800 resize-none"></textarea>
                  </div>
                  <button className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 uppercase tracking-widest text-xs">
                    Transmit Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
