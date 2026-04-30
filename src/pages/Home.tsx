import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useNotification } from '../context/NotificationContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { collection, query, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';
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
  LineChart as LineChartIcon,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  DashboardMetric, 
  FeatureCard, 
  TestimonialCard, 
  TransformationCard, 
  BlogCard,
  LoadingSpinner
} from '../components/SharedUI';


const pricingTiers = [
  {
    name: "Foundation",
    price: "8,500",
    description: "Ideal for metabolic reset and core engineering.",
    features: ["Health Assessment", "3x Group Sessions/Week", "Nutrition Roadmap", "Progress App Access"],
    cta: "Book Session",
    highlight: false
  },
  {
    name: "Vanguard",
    price: "15,000",
    description: "The peak performance tier for high-intensity growth.",
    features: ["Advanced Labs", "Unlimited Access", "Personal Nutritionist", "Priority Support", "Fitness Profiling"],
    cta: "Book Session",
    highlight: true
  },
  {
    name: "Titan",
    price: "25,000",
    description: "Fully bespoke engineering for executive performance.",
    features: ["Daily Health Stats", "1-on-1 Personal Training", "Personal Chef Sync", "Full Recovery", "Bespoke Training"],
    cta: "Book Session",
    highlight: false
  }
];

const PricingCard = ({ tier, delay }: { tier: typeof pricingTiers[0], delay: number, key?: any }) => {
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
      className={`p-10 rounded-3xl border ${tier.highlight ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xl shadow-emerald-600/30 ring-4 ring-emerald-500/10' : 'bg-white text-slate-800 border-slate-100 shadow-xl shadow-slate-900/5'} flex flex-col h-full relative overflow-hidden`}
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
      <p className={`text-sm font-medium mb-8 leading-relaxed ${tier.highlight ? 'text-emerald-50/80' : 'text-slate-600'}`}>{tier.description}</p>
      <div className="space-y-4 mb-10 flex-1">
        {tier.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-white/10 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
              <Sparkles size={10} />
            </div>
            <span className="text-xs font-bold tracking-tight">{feature}</span>
          </div>
        ))}
      </div>
      <button 
        onClick={handleBooking}
        className={`w-full py-5 rounded-2xl font-black text-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 outline-none ${
          tier.highlight ? 'bg-white text-emerald-600 hover:bg-emerald-50 focus-visible:ring-white' : 
          tier.name === 'Titan' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 focus-visible:ring-blue-600' :
          'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20 focus-visible:ring-rose-600'
        }`}
      >
        {tier.cta}
      </button>
    </motion.div>
  );
};

export default function HomePage() {
  const containerRef = useRef(null);
  const { setIsBookingModalOpen, setIsAuthModalOpen } = useModal();
  const { notify } = useNotification();
  const { user } = useAuth();

  const handleBookingClick = () => {
    if (user) {
      setIsBookingModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    "/mrman_brand.png",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1200"
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
      image: "https://picsum.photos/seed/person1/100?webp=1"
    },
    {
      name: "Brian Kiprono",
      role: "Professional Athlete",
      quote: "Training at 1,800m altitude with Mr Man's insights has pushed my endurance to levels I never thought possible.",
      image: "https://picsum.photos/seed/person2/100?webp=1"
    },
    {
      name: "Elena Wangui",
      role: "Business Executive",
      quote: "Finally, a trainer who understands the balance between a demanding career and peak physical health. The hydration plans are game changers.",
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
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fm=webp"
    },
    {
      title: "The Neuro-Metabolic Connection: Beyond Muscle",
      category: "Performance",
      date: "Apr 15, 2026",
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fm=webp"
    },
    {
      title: "Rift Valley Fueling: Local Nutrition for Elite Cycles",
      category: "Nutrition",
      date: "Apr 08, 2026",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800"
    }
  ]);

  const [realTestimonials, setRealTestimonials] = useState<any[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

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
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  const activeTestimonials = realTestimonials.length > 0 ? realTestimonials : testimonials;

  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      notify("Please fill all communication channels.", "error");
      return;
    }
    
    setIsSubmittingContact(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          ...contactData,
          user_id: user?.uid || null,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error("Supabase submission error:", error);
        throw new Error(error.message || "Failed to transmit to Supabase.");
      }
      
      setContactData({ name: '', email: '', message: '' });
      notify("Your message has been sent successfully!", "success");
    } catch (e: any) {
      console.error("Contact submission error:", e);
      const errorMsg = e.message?.includes('PGRST116') || e.message?.includes('relation "public.inquiries" does not exist')
        ? "Database table 'inquiries' not found. Please check Supabase setup."
        : e.message || "Could not send message. Please try again.";
      notify(errorMsg, "error");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.img 
              src={heroImages[currentImageIndex]}
              alt="Performance Background"
              fetchpriority={currentImageIndex === 0 ? "high" : "low"}
              decoding="async"
              className="w-full h-full object-cover mix-blend-multiply"
              style={{ 
                y: bgY,
                scale 
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-[var(--spacing-fluid-md)]">
        {/* Hero Section */}
        <section className="relative mb-[var(--spacing-fluid-lg)] flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[10px] font-black uppercase text-blue-600 mb-8 border border-blue-100 shadow-sm mx-auto lg:mx-0">
              <Sparkles size={14} /> Mr Man Fitness • Nakuru Elite
            </div>
            
            <h1 className="text-fluid-h1 font-black tracking-tighter leading-[0.8] mb-8 text-slate-900 uppercase">
              Redefine <br/>
              Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-blue-600 to-emerald-500">
                Boundary.
              </span>
            </h1>
            
            <p className="text-fluid-body text-slate-600 max-w-xl mb-12 leading-relaxed font-medium mx-auto lg:mx-0">
              A scientific approach to peak human condition by Mr Man Fitness. Based in Nakuru, designed for those who demand excellence in every fiber of their being.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={handleBookingClick}
                className="bg-blue-600 text-white px-10 md:px-12 py-5 md:py-6 rounded-2xl font-black text-xs md:text-sm transition-all shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 uppercase tracking-[0.2em] flex items-center justify-center gap-4"
              >
                Book Session <ChevronRight size={22} />
              </button>
              <Link 
                to="/studio"
                className="liquid-glass border-slate-200 text-slate-800 px-10 py-5 rounded-2xl font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 flex items-center justify-center hover:bg-white"
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
                <img src="https://picsum.photos/seed/elite/100?webp=1" alt="Client" className="w-10 h-10 rounded-full border-2 border-white shadow-md" loading="lazy" />
                <p className="text-[10px] font-black text-slate-800">Dr. Kenneth R. <span className="text-emerald-500 opacity-50">— Surgeon</span></p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Quick Programs Access */}
        <section className="mb-[var(--spacing-fluid-lg)]" id="programs">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[9px] font-black text-emerald-600 mb-6 rounded-full border border-emerald-100">
                <Dumbbell size={12} /> Service Matrix
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800 leading-[0.9] mb-8">
                Elite Programs.
              </h2>
              <p className="text-slate-600 font-medium">Custom fitness programs specialized for physical optimization.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Dumbbell} title="Compound Lifts" description="Master the foundational movements. Specialized coaching on squats, deadlifts, and presses." delay={0.1} color="emerald" />
            <FeatureCard icon={Target} title="Strength Training" description="Strength training plans designed to increase absolute power output." delay={0.2} color="emerald" />
            <FeatureCard icon={Activity} title="Light Cardio" description="Low-intensity steady-state conditioning (LISS) to optimize aerobic base." delay={0.3} color="emerald" />
          </div>
        </section>

        {/* Gallery Bento Grid */}
        <section className="mb-[var(--spacing-fluid-lg)]" id="studio">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">The Studio.</h2>
              <p className="text-slate-600 font-medium">A sanctuary of focus and high-performance equipment in the heart of Milimani, Nakuru.</p>
            </div>
            <Link to="/studio" className="text-xs font-black text-emerald-600 bg-emerald-50 px-8 py-4 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 uppercase tracking-widest text-center">Enter Studio</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            <motion.div whileHover={{ scale: 0.98 }} className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fm=webp" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="rounded-[2.5rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fm=webp" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="rounded-[2.5rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fm=webp" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="col-span-2 rounded-[2.5rem] overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fm=webp" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Studio" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            </motion.div>
          </div>
        </section>


        {/* Transformation Section */}
        <section className="mb-[var(--spacing-fluid-lg)]" id="transformation">
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
        <section className="mb-[var(--spacing-fluid-lg)]" id="testimonials">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6">
              Voice of the Elite.
            </h2>
          </div>
          {loadingTestimonials ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size={40} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {activeTestimonials.map((t, i) => (
                <TestimonialCard key={i} {...t} delay={0.1 + (i * 0.1)} />
              ))}
            </div>
          )}
        </section>


        {/* Mindset: Internal Locus of Control */}
        <section className="mb-[var(--spacing-fluid-lg)]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[10px] font-black text-emerald-600 mb-6 rounded-full border border-emerald-100 uppercase tracking-widest">
               <ShieldCheck size={12} fill="currentColor" /> The Visionary
            </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Meet the <br/>
                <span className="text-emerald-600">Founder.</span>
              </h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
                At Mr Man Fitness, we believe performance is 20% mechanics and 80% agency. True evolution starts when you realize you aren't just reacting to your environment—you are engineering it.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Brain, title: "Mental Strength", desc: "Shift from 'I have to' to 'I choose to'. Own every rep and every recovery plan.", color: "emerald" },
                  { icon: Zap, title: "Decisive Action", desc: "Shorten the gap between intent and execution. Eliminate 'drift' from your daily routine.", color: "emerald" },
                  { icon: ShieldCheck, title: "Absolute Ownership", desc: "No excuses. No external blame. Your results are a direct output of your internal state.", color: "emerald" }
                ].map((pillar, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 ${
                      pillar.color === 'emerald' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 
                      pillar.color === 'emerald' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 
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
              <div className="aspect-square rounded-[4rem] bg-slate-900 overflow-hidden relative group shadow-2xl shadow-emerald-900/20">
                <img 
                  src="/mrman_brand.png" 
                  alt="Mr Man Founder" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 p-8 liquid-glass-emerald border-white/20 rounded-[2.5rem]">
                  <p className="text-white text-2xl font-black italic tracking-tight mb-4">
                    "Control the variable that matters most: Yourself."
                  </p>
                  <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">— Transformation Plan</p>
                </div>
              </div>
              
              {/* Decorative Floating Stats */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-6 bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
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

        {/* Pricing Tiers Section */}
        <div className="mb-[var(--spacing-fluid-lg)]" id="pricing">
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

        {/* Contact Section */}
        <section className="mb-[var(--spacing-fluid-lg)]" id="contact">
          <div className="liquid-glass p-8 md:p-20 rounded-[3rem] overflow-hidden relative border-slate-100/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[100px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[100px] rounded-full -ml-48 -mb-48" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[9px] font-black text-emerald-600 mb-6 rounded-full border border-emerald-100">
                  GET IN TOUCH
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-none">Reach Out.</h2>
                <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 max-w-md">
                  Whether you're ready to initiate your transformation or have technical inquiries, our elite support team is online.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-xl font-bold text-slate-800">hello@mrman.fit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-xl font-bold text-slate-800">+254 700 000 000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-xl font-bold text-slate-800">Milimani, Nakuru City</p>
                    </div>
                  </div>
                  
                  {!user && (
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Guest Mode</p>
                        <p className="text-[10px] font-bold text-blue-500/80 leading-relaxed">
                          Sign in to track your inquiry status and receive direct responses in your dashboard.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-slate-50">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Your Name</label>
                      <input 
                        required
                        type="text" 
                        value={contactData.name}
                        onChange={e => setContactData({...contactData, name: e.target.value})}
                        placeholder="Your Name" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={contactData.email}
                        onChange={e => setContactData({...contactData, email: e.target.value})}
                        placeholder="Email Address" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-800" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Your Message</label>
                    <textarea 
                      required
                      rows={4} 
                      value={contactData.message}
                      onChange={e => setContactData({...contactData, message: e.target.value})}
                      placeholder="Tell us your goals..." 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-800 resize-none"
                    ></textarea>
                  </div>
                  <button 
                    disabled={isSubmittingContact}
                    className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
                  >
                    {isSubmittingContact ? (
                      <div className="flex items-center gap-2 justify-center">
                        <LoadingSpinner size={16} /> Transmitting Protocol...
                      </div>
                    ) : "Transmit Message"}
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
