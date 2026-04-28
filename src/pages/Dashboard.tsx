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
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, profile, logOut, loading: authLoading } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'bookings' | 'updates'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
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
      // Fetch bookings
      const bookingsRef = collection(db, 'bookings');
      const qBookings = query(bookingsRef, where('user_id', '==', user.uid), orderBy('created_at', 'desc'));
      const bookingsSnap = await getDocs(qBookings);
      setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch program updates
      const updatesRef = collection(db, 'program_updates');
      const qUpdates = query(updatesRef, orderBy('created_at', 'desc'), limit(5));
      const updatesSnap = await getDocs(qUpdates);
      setUpdates(updatesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

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
        <Activity className="animate-spin text-rose-500" size={48} />
      </div>
    );
  }

  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-4 sm:px-6">
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
                        ? 'bg-slate-900 text-white shadow-lg translate-x-2' 
                        : 'text-slate-500 hover:bg-slate-100'
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
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
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
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <Activity size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Workouts</p>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
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
                      <Bell className="text-rose-600" size={24} /> Latest Updates
                    </h3>

                    {/* Developer Simulation Controls */}
                    {user?.email === 'bochieng228@gmail.com' && (
                      <div className="mb-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Developer Simulation (Test Mode)</p>
                        <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={simulateUpdate}
                            className="text-xs font-bold px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2"
                          >
                            <Zap size={14} className="text-rose-600" /> Post System Update
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
                           <span className="text-[9px] font-black text-rose-600 uppercase bg-rose-50 px-2 py-1 rounded-md">
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
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="liquid-glass border-slate-100 p-10 rounded-[3rem] relative overflow-hidden"
                >
                  {/* Holographic Success Overlay */}
                  <AnimatePresence>
                    {showSuccessAnim && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-rose-500/10 backdrop-blur-[2px] pointer-events-none"
                      >
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/40 mb-4">
                            <ShieldCheck size={40} className="text-white" />
                          </div>
                          <p className="text-rose-600 font-black uppercase tracking-[0.3em] text-xs">Profile Saved</p>
                          <motion.div 
                            animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 bg-rose-500/20 rounded-full"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter text-slate-900">Edit Profile.</h3>
                      <p className="text-slate-400 font-bold text-sm mt-2 flex items-center gap-2">
                        <Zap size={14} className="text-rose-600" /> Profile sync active
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Connected</span>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-10 relative">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3 group">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <UserIcon size={12} className="text-rose-500" /> Full Name
                          </label>
                          <span className="text-[8px] font-black text-emerald-500 uppercase opacity-0 group-focus-within:opacity-100 transition-opacity">Optimal</span>
                        </div>
                        <div className="relative">
                          <input 
                            value={profileData.display_name}
                            onChange={e => setProfileData({...profileData, display_name: e.target.value})}
                            className="w-full bg-white border-2 border-slate-100 rounded-3xl px-8 py-5 focus:outline-none focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 transition-all font-black text-slate-800 text-lg placeholder:text-slate-200"
                            placeholder="Identify yourself..."
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-rose-500 transition-all">
                            <Activity size={20} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 flex flex-col justify-end">
                        <div className="p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                          <p className="text-[9px] font-black text-slate-400 leading-relaxed uppercase tracking-wider">
                            Sync Status: <span className="text-slate-900">Secure</span><br/>
                            Stability Index: <span className="text-emerald-500">99.98%</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 group">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare size={12} className="text-rose-500" /> About Me & Goals
                        </label>
                        <span className="text-[8px] font-black text-slate-300 uppercase">Limit: 256 Chars</span>
                      </div>
                      <div className="relative">
                        <textarea 
                          rows={4}
                          value={profileData.bio}
                          onChange={e => setProfileData({...profileData, bio: e.target.value})}
                          className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] px-8 py-6 focus:outline-none focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 transition-all font-bold text-slate-700 leading-relaxed resize-none placeholder:text-slate-200"
                          placeholder="Tell us about your fitness goals..."
                        />
                         <div className="absolute right-6 bottom-6 opacity-20 group-focus-within:opacity-100 group-focus-within:text-rose-500 transition-all">
                          <Settings size={20} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
                      <button 
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="relative w-full sm:w-auto bg-slate-900 text-white px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50 group overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {isUpdatingProfile ? (
                            <>
                              <Activity className="animate-spin" size={18} />
                              Saving Profile...
                            </>
                          ) : (
                            <>
                              <Zap size={18} />
                              Save Changes
                            </>
                          )}
                        </span>
                        {/* Scanning Line Animation */}
                        {isUpdatingProfile && (
                          <motion.div 
                            initial={{ y: "-100%" }}
                            animate={{ y: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/20 to-transparent h-20 w-full"
                          />
                        )}
                      </button>
                      
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[200px] leading-tight">
                        Note: Profile changes are saved to the secure system immediately.
                      </p>
                    </div>
                  </form>
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
                                booking.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                             <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                               <Calendar size={14} /> Start Date: {new Date(booking.activation_date).toLocaleDateString()}
                             </p>
                          </div>

                          {booking.status === 'completed' && (
                            <div className="w-full md:w-auto p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                              <h6 className="text-[10px] font-black text-rose-600 uppercase mb-3 flex items-center gap-2">
                                <Star size={12} fill="currentColor" /> Share Your Story
                              </h6>
                              <div className="flex gap-2">
                                <input 
                                  placeholder="How was your progress?"
                                  value={testimonialQuote}
                                  onChange={e => setTestimonialQuote(e.target.value)}
                                  className="flex-1 bg-white border border-rose-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                />
                                <button 
                                  onClick={() => handleSubmitTestimonial(booking.id)}
                                  disabled={isSubmittingTestimonial === booking.id}
                                  className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all"
                                >
                                  {isSubmittingTestimonial === booking.id ? '...' : 'Post'}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Simulation: Mark as Completed */}
                          {user?.email === 'bochieng228@gmail.com' && booking.status !== 'completed' && (
                            <button 
                              onClick={() => simulateCompletion(booking.id)}
                              className="text-[9px] font-black uppercase text-slate-400 hover:text-rose-600 transition-colors mt-2"
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
                            className="mt-4 text-rose-600 font-black text-sm uppercase tracking-widest hover:underline"
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
                      <div key={update.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-rose-100">
                        <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-rose-600" />
                        <h5 className="font-black text-lg text-slate-900 mb-2">{update.title}</h5>
                        <p className="text-slate-600 leading-relaxed mb-4">{update.content}</p>
                         <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>{new Date(update.created_at).toLocaleString()}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           <span className="text-rose-600">Admin Post</span>
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
