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
import { supabase } from '../lib/supabase';
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
    try {
      setLoading(true);
      // Fetch bookings
      const { data: bData, error: bError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (bError) throw bError;
      setBookings(bData || []);

      // Fetch program updates
      const { data: uData, error: uError } = await supabase
        .from('program_updates')
        .select('*')
        .lte('created_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (uError) throw uError;
      setUpdates(uData || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setIsUpdatingProfile(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      notify("Identity synced with mainframe.", "success");
    } catch (error) {
      console.error('Profile update error:', error);
      notify("Synchronization failed. Check biometrics.", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSubmitTestimonial = async (bookingId: string) => {
    if (!user || !testimonialQuote) return;
    try {
      setIsSubmittingTestimonial(bookingId);
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          user_id: user.id,
          name: profile?.display_name || user.user_metadata.full_name || user.email?.split('@')[0],
          role: "Optimizer",
          quote: testimonialQuote,
          image: user.user_metadata.avatar_url,
          booking_id: bookingId,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setTestimonialQuote('');
      notify("Testimonial transmitted. Awaiting synchronization.", "protocol");
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
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;
      notify("Protocol marked as Completed (Simulated Admin Action).", "success");
      fetchData();
    } catch (e) {
      console.error(e);
      notify("Permission Denied: Admin status required.", "error");
    }
  };

  // Simulates an admin dispatching a protocol update
  const simulateUpdate = async () => {
    try {
      const { error } = await supabase
        .from('program_updates')
        .insert([{
          title: "System Calibration: Optimization Cycle 4.2",
          content: "We have updated the hypoxic training parameters for the Milimani studio. Please review your active protocol constraints.",
          program_type: "Elite",
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      notify("System update dispatched (Simulated Admin Action).", "success");
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
                    src={user?.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user?.user_metadata.full_name || user?.email}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 leading-tight">
                  {profile?.display_name || user?.user_metadata.full_name || user?.email?.split('@')[0]}
                </h2>
                <p className="text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  Elite Status: Verified
                </p>
              </div>

              <div className="mt-10 space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'profile', label: 'Identity', icon: UserIcon },
                  { id: 'bookings', label: 'Protocols', icon: Calendar },
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
                  Terminate Session
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
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Protocols</p>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                        <Calendar size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cycles</p>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900">{bookings.length}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Integrity</p>
                      <h4 className="text-3xl font-black tracking-tighter text-slate-900">Optimal</h4>
                    </div>
                  </div>

                  <div className="liquid-glass border-slate-100 p-10 rounded-[3rem]">
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8 flex items-center gap-3">
                      <Bell className="text-rose-600" size={24} /> Latest Intelligence
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
                            <Zap size={14} className="text-rose-600" /> Dispatch System Update
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
                               {update.program_type || 'Global'}
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="liquid-glass border-slate-100 p-10 rounded-[3rem]"
                >
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-10">Define Identity.</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Full Name</label>
                       <input 
                         value={profileData.display_name}
                         onChange={e => setProfileData({...profileData, display_name: e.target.value})}
                         className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800"
                       />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 pl-2 uppercase tracking-widest">Personal Mission / Bio</label>
                      <textarea 
                        rows={4}
                        value={profileData.bio}
                        onChange={e => setProfileData({...profileData, bio: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 resize-none"
                        placeholder="State your physiological objectives..."
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isUpdatingProfile ? 'Syncing...' : 'Sync Identity'}
                    </button>
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
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-10">Active Protocols.</h3>
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
                               <Calendar size={14} /> Activation: {new Date(booking.activation_date).toLocaleDateString()}
                             </p>
                          </div>

                          {booking.status === 'completed' && (
                            <div className="w-full md:w-auto p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                              <h6 className="text-[10px] font-black text-rose-600 uppercase mb-3 flex items-center gap-2">
                                <Star size={12} fill="currentColor" /> Submit Intelligence
                              </h6>
                              <div className="flex gap-2">
                                <input 
                                  placeholder="Share your evolution quote..."
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
                          <p className="text-slate-400 font-bold">No active protocols detected.</p>
                          <button 
                            onClick={() => navigate('/programs')}
                            className="mt-4 text-rose-600 font-black text-sm uppercase tracking-widest hover:underline"
                          >
                            Explore Protocols
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
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-10">System Intelligence.</h3>
                  <div className="space-y-8">
                    {updates.length > 0 ? updates.map(update => (
                      <div key={update.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-rose-100">
                        <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-rose-600" />
                        <h5 className="font-black text-lg text-slate-900 mb-2">{update.title}</h5>
                        <p className="text-slate-600 leading-relaxed mb-4">{update.content}</p>
                         <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <span>{new Date(update.created_at).toLocaleString()}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full" />
                           <span className="text-rose-600">Admin Dispatch</span>
                         </div>
                      </div>
                    )) : (
                      <div className="text-center py-12 text-slate-400 font-medium">Clear of new intelligence.</div>
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
