import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Settings, 
  Calendar, 
  Zap, 
  MessageSquare, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Activity,
  Bell,
  Star,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/SharedUI';
import { supabase } from '../lib/supabase';

const DashboardPage = () => {
  const { user, profile, logOut, loading: authLoading } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'bookings' | 'updates'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ display_name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState<string | null>(null);

  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
    if (user) {
      fetchData();
      setProfileData({ 
        display_name: profile?.display_name || '', 
        bio: profile?.bio || '' 
      });
    }
  }, [user, authLoading, profile]);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetch bookings from Supabase
      const { data: bData, error: bError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });
      
      if (bError) {
        console.error("Supabase bookings error:", bError);
      } else {
        setBookings(bData || []);
      }

      // Fetch program updates
      const updatesRef = collection(db, 'program_updates');
      const qUpdates = query(updatesRef, orderBy('created_at', 'desc'), limit(5));
      const updatesSnap = await getDocs(qUpdates);
      setUpdates(updatesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Inquiries from Supabase
      const { data: iData, error: iError } = await supabase
        .from('inquiries')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });
      
      if (iError) {
        console.error("Supabase fetch error:", iError);
      } else {
        setInquiries(iData || []);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      handleFirestoreError(error, OperationType.LIST, 'dashboard_data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setIsUpdatingProfile(true);
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        ...profileData,
        updated_at: new Date().toISOString()
      });

      setShowSuccessAnim(true);
      setTimeout(() => setShowSuccessAnim(false), 3000);
      
      notify("Profile updated successfully.", "success");
    } catch (error) {
      console.error('Profile update error:', error);
      notify("Failed to update profile. Please try again.", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSubmitTestimonial = async (bookingId: string) => {
    if (!user || !testimonialQuote) return;
    try {
      setIsSubmittingTestimonial(bookingId);
      const testimonialsRef = collection(db, 'testimonials');
      await addDoc(testimonialsRef, {
        user_id: user.uid,
        name: profile?.display_name || user.displayName || user.email?.split('@')[0],
        role: "Optimizer",
        quote: testimonialQuote,
        image: user.photoURL,
        booking_id: bookingId,
        created_at: new Date().toISOString()
      });

      setTestimonialQuote('');
      notify("Feedback submitted successfully.", "protocol");
    } catch (error) {
      console.error('Testimonial submission error:', error);
      notify("Submission failed.", "error");
    } finally {
      setIsSubmittingTestimonial(null);
    }
  };

  // Simulates an admin completing a booking
  const simulateCompletion = async (bookingId: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'completed',
        updated_at: new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`));

      notify("Workout marked as Completed.", "success");
      fetchData();
    } catch (e) {
      console.error(e);
      notify("Permission Denied: Admin status required.", "error");
    }
  };

  // Simulates an admin dispatching a protocol update
  const simulateUpdate = async () => {
    try {
      const updatesRef = collection(db, 'program_updates');
      await addDoc(updatesRef, {
        title: "System Calibration: Optimization Cycle 4.2",
        content: "We have updated the hypoxic training parameters for the Milimani studio. Please review your active protocol constraints.",
        program_type: "Elite",
        created_at: new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, 'program_updates'));

      notify("System update posted.", "success");
      fetchData();
    } catch (e) {
      console.error(e);
      notify("Permission Denied: Admin status required.", "error");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="relative min-h-screen bg-slate-50/50 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="liquid-glass border-slate-100 p-8 rounded-[2.5rem]">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6">
                  <img 
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 leading-tight">
                  {profile?.display_name || user?.displayName || user?.email?.split('@')[0]}
                </h2>
                <p className="text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  Elite Member
                </p>
              </div>

              <div className="mt-10 space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'profile', label: 'Profile', icon: UserIcon },
                  { id: 'bookings', label: 'Workouts', icon: Calendar },
                  { id: 'updates', label: 'Updates', icon: Bell }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100">
                <button 
                  onClick={logOut}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <Activity size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Workouts</p>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <Calendar size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sessions</p>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900">{bookings.length}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Health</p>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900">Optimal</h4>
                    </div>
                  </div>

                  <div className="liquid-glass border-slate-100 p-10 rounded-[3rem]">
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8 flex items-center gap-3">
                      <Bell className="text-emerald-600" size={24} /> Latest Updates
                    </h3>

                    {user?.email === 'bochieng228@gmail.com' && (
                      <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Developer Simulation (Test Mode)</p>
                        <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={simulateUpdate}
                            className="text-xs font-bold px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2"
                          >
                            <Zap size={14} className="text-emerald-600" /> Post System Update
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {updates.length > 0 ? updates.map(update => (
                        <div key={update.id} className="p-6 bg-white rounded-3xl border border-slate-50 shadow-sm hover:shadow-md transition-all">
                          <h5 className="font-black text-slate-800 mb-2">{update.title}</h5>
                           <p className="text-slate-500 text-sm leading-relaxed">{update.content}</p>
                          <div className="mt-4 flex items-center gap-4">
                           <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">
                               {update.program_type || 'General'}
                             </span>
                             <span className="text-[9px] font-black text-slate-400 uppercase">
                               {new Date(update.created_at).toLocaleDateString()}
                             </span>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-slate-400 font-medium">No system updates available.</div>
                      )}
                    </div>
                  </div>

                  {/* Inquiry Responses */}
                  {inquiries.some(i => i.status === 'responded') && (
                    <div className="bg-white border-2 border-emerald-100 p-10 rounded-[3rem] shadow-xl shadow-emerald-900/5">
                      <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8 flex items-center gap-3">
                        <MessageSquare className="text-emerald-600" size={24} /> Inquiry Intelligence
                      </h3>
                      <div className="space-y-6">
                        {inquiries.filter(i => i.status === 'responded').map(inquiry => (
                          <div key={inquiry.id} className="bg-slate-50 p-8 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                            <div className="mb-4">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Inquiry</p>
                              <p className="text-slate-600 font-medium italic">"{inquiry.message}"</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-emerald-50 shadow-sm">
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ShieldCheck size={12} /> Official Response
                              </p>
                              <p className="text-slate-800 font-bold leading-relaxed">{inquiry.admin_response}</p>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">
                                Responded at: {new Date(inquiry.responded_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

               {activeTab === 'profile' && (
                 <motion.div
                   key="profile"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-8"
                 >
                   {/* Profile Header Card */}
                   <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-slate-900/5 border border-slate-100 relative">
                     {/* Banner */}
                     <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                       <img 
                         src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200" 
                         className="w-full h-full object-cover opacity-40 grayscale"
                         alt="Banner"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                     </div>
                     
                     <div className="px-10 pb-10 -mt-16 relative z-10">
                       <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                         <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-2xl relative group">
                           <div className="w-full h-full rounded-[2rem] overflow-hidden">
                             <img 
                               src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || user?.email}&background=0D9488&color=fff`} 
                               alt="Avatar" 
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                             <Fingerprint size={18} />
                           </div>
                         </div>
                         <div className="flex-1 pb-2">
                           <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                             {profile?.display_name || user?.displayName || user?.email?.split('@')[0]}
                           </h2>
                           <p className="text-slate-400 font-bold text-sm mt-2 flex items-center gap-2">
                             Member since {new Date(user?.metadata.creationTime || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                           </p>
                         </div>
                         <div className="flex gap-3">
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                              {profile?.role || 'Elite Member'}
                            </div>
                         </div>
                       </div>

                       {/* Profile Info Grid */}
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-50">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account ID</p>
                            <p className="text-sm font-bold text-slate-800 font-mono truncate max-w-[120px]">{user?.uid}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Access</p>
                            <p className="text-sm font-bold text-slate-800">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Protocol</p>
                            <p className="text-sm font-bold text-slate-800">{bookings[0]?.protocol || 'None Active'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Status</p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-sm font-bold text-emerald-600">Online</span>
                            </div>
                          </div>
                       </div>
                     </div>
                   </div>

                   {/* Settings Form Card */}
                   <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-900/5 border border-slate-100">
                     <div className="flex items-center gap-4 mb-10">
                       <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                         <Settings size={20} />
                       </div>
                       <div>
                         <h3 className="text-2xl font-black tracking-tighter text-slate-900">System Preferences</h3>
                         <p className="text-slate-400 font-medium text-xs">Update your identification and objectives.</p>
                       </div>
                     </div>

                     <form onSubmit={handleUpdateProfile} className="space-y-10">
                       <div className="grid md:grid-cols-2 gap-10">
                         <div className="space-y-3 group">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                             <UserIcon size={12} className="text-emerald-500" /> Full Name
                           </label>
                           <input 
                             value={profileData.display_name}
                             onChange={e => setProfileData({...profileData, display_name: e.target.value})}
                             className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-300"
                             placeholder="Display Name"
                           />
                         </div>
                         <div className="space-y-3 group">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                             <Zap size={12} className="text-emerald-500" /> Role Identity
                           </label>
                           <input 
                             disabled
                             value={profile?.role || 'Elite Member'}
                             className="w-full bg-slate-100 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-400 cursor-not-allowed"
                           />
                         </div>
                       </div>

                       <div className="space-y-3 group">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-1">
                           <MessageSquare size={12} className="text-emerald-500" /> Personal Objectives
                         </label>
                         <textarea 
                           rows={4}
                           value={profileData.bio}
                           onChange={e => setProfileData({...profileData, bio: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-6 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700 leading-relaxed resize-none placeholder:text-slate-300"
                           placeholder="Describe your current fitness trajectory..."
                         />
                       </div>

                       <div className="pt-4 flex flex-col sm:flex-row items-center gap-6 border-t border-slate-50 pt-10">
                         <button 
                           type="submit"
                           disabled={isUpdatingProfile}
                           className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                         >
                           {isUpdatingProfile ? "Syncing..." : "Update Protocol"}
                         </button>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[200px] leading-tight">
                           Authentication verified. All changes are immutable once committed.
                         </p>
                       </div>
                     </form>
                   </div>
                 </motion.div>
               )}

              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="liquid-glass border-slate-100 p-10 rounded-[3rem]">
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-10">Active Workout Plans.</h3>
                    <div className="space-y-6">
                      {bookings.length > 0 ? bookings.map(booking => (
                        <div key={booking.id} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h5 className="font-black text-xl text-slate-900">{booking.protocol}</h5>
                              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                                booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                             <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                               <Calendar size={14} /> Start Date: {new Date(booking.activation_date).toLocaleDateString()}
                             </p>
                          </div>

                          {booking.status === 'completed' && (
                             <div className="w-full md:w-auto p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                               <h6 className="text-[10px] font-black text-emerald-600 uppercase mb-3 flex items-center gap-2">
                                 <Star size={12} fill="currentColor" /> Share Your Story
                               </h6>
                               <div className="flex gap-2">
                                 <input 
                                   placeholder="How was your progress?"
                                   value={testimonialQuote}
                                   onChange={e => setTestimonialQuote(e.target.value)}
                                   className="flex-1 bg-white border border-emerald-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                 />
                                 <button 
                                   onClick={() => handleSubmitTestimonial(booking.id)}
                                   disabled={isSubmittingTestimonial === booking.id}
                                   className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                                 >
                                   {isSubmittingTestimonial === booking.id ? '...' : 'Post'}
                                 </button>
                               </div>
                             </div>
                           )}

                          {user?.email === 'bochieng228@gmail.com' && booking.status !== 'completed' && (
                             <button 
                               onClick={() => simulateCompletion(booking.id)}
                               className="text-[9px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors mt-2"
                             >
                              [Simulate Completion]
                            </button>
                          )}
                        </div>
                      )) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                          <p className="text-slate-400 font-bold">No active plans detected.</p>
                           <button 
                             onClick={() => navigate('/programs')}
                             className="mt-4 text-blue-600 font-black text-sm uppercase tracking-widest hover:underline"
                           >
                            Explore Training Plans
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'updates' && (
                <motion.div
                  key="updates"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="liquid-glass border-slate-100 p-10 rounded-[3rem]"
                >
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-10">System Updates.</h3>
                  <div className="space-y-8">
                     {updates.length > 0 ? updates.map(update => (
                       <div key={update.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-blue-100">
                         <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <h5 className="font-black text-lg text-slate-900 mb-2">{update.title}</h5>
                        <p className="text-slate-600 leading-relaxed mb-4">{update.content}</p>
                         <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>{new Date(update.created_at).toLocaleString()}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-blue-600">Admin Post</span>
                          </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 text-slate-400 font-medium">No new updates.</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
