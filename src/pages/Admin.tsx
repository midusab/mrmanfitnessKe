import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc,
  where
} from 'firebase/firestore';
import { 
  Zap, 
  Users, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Bell,
  TrendingUp,
  Settings,
  Mail
} from 'lucide-react';
import { LoadingSpinner } from '../components/SharedUI';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Plus, 
  Trash2, 
  Clock, 
  AlertTriangle,
  ListTodo
} from 'lucide-react';

const AdminPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'inquiries'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      navigate('/dashboard');
      notify("Unauthorized access. Admin protocols required.", "error");
    }
  }, [user, profile, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Bookings from Supabase
      const { data: bData, error: bError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bError) {
        console.error("Supabase bookings error:", bError);
      } else {
        setBookings(bData || []);
      }

      // Fetch Inquiries from Supabase
      const { data: iData, error: iError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (iError) {
        console.error("Supabase inquiries error:", iError);
      } else {
        setInquiries(iData || []);
      }

    } catch (e) {
      console.error(e);
      notify("Data retrieval failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchData();
    }
  }, [user, profile]);

  const handleBookingAction = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      notify(`Booking marked as ${status}.`, "success");
      fetchData();
    } catch (e) {
      notify("Action failed.", "error");
    }
  };

  const handleInquiryAction = async (id: string, response: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ 
          status: 'responded', 
          admin_response: response,
          responded_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      notify("Your response has been sent to the user.", "success");
      fetchData();
    } catch (e) {
      notify("Response failed to transmit.", "error");
    }
  };

  if (authLoading || (loading && bookings.length === 0)) {
    
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        {!isSupabaseConfigured ? (
          <div className="text-center p-8 bg-rose-50 border-2 border-rose-100 rounded-[2rem] max-w-md">
            <AlertTriangle className="text-rose-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-black text-slate-900 mb-2">Supabase Disconnected</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">
              Your environment variables (VITE_SUPABASE_URL) are missing in Vercel. 
              The Admin Dashboard cannot function without them.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xs font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3 rounded-xl"
            >
              Back to Safety
            </button>
          </div>
        ) : (
          <>
            <LoadingSpinner size={48} />
            <p className="mt-4 text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Synchronizing Protocols...</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
           <div>
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[10px] font-black text-blue-600 mb-8 rounded-full border border-blue-100 uppercase tracking-[0.2em] shadow-sm">
               <ShieldCheck size={14} /> Command Center 1.0
             </div>
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.8] mb-8">
               Admin <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Control.</span>
             </h1>
             <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
               System oversight for Nakuru's elite performance network. Manage bookings, respond to inquiries, and broadcast intelligence updates.
             </p>
           </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue / Bookings</p>
                <h4 className="text-4xl font-black tracking-tighter text-slate-900">{bookings.filter(b => b.status === 'pending').length}</h4>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Open / Inquiries</p>
                <h4 className="text-4xl font-black tracking-tighter text-slate-900">{inquiries.filter(i => i.status === 'pending').length}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'inquiries', label: 'Inquiries', icon: Mail }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' 
                  : 'text-slate-500 hover:bg-slate-100/50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'bookings' && (
                <motion.div 
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900">Manage Bookings.</h3>
                    <button 
                      onClick={fetchData}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                      <Activity size={14} className={loading ? 'animate-spin' : ''} />
                      Refresh Protocols
                    </button>
                  </div>
                  {bookings.length > 0 ? bookings.map(booking => (
                    <div key={booking.id} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-100 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h5 className="font-black text-lg text-slate-800">{booking.user_name || 'Anonymous Athlete'}</h5>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                            booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                           <Activity size={14} className="text-emerald-500" /> {booking.plan} • {booking.location}
                        </p>
                        <p className="text-slate-400 text-xs flex items-center gap-2">
                           <Calendar size={12} /> Start: {new Date(booking.activation_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleBookingAction(booking.id, 'confirmed')}
                              className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              title="Approve Booking"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button 
                              onClick={() => handleBookingAction(booking.id, 'cancelled')}
                              className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              title="Reject Booking"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                           <button 
                             onClick={() => handleBookingAction(booking.id, 'cancelled')}
                             className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline"
                           >
                             Cancel Plan
                           </button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No bookings logged in system.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'inquiries' && (
                <motion.div 
                  key="inquiries"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900">Inquiry Inbox.</h3>
                    <button 
                      onClick={fetchData}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                      <Activity size={14} className={loading ? 'animate-spin' : ''} />
                      Sync Protocol
                    </button>
                  </div>
                  {inquiries.length > 0 ? inquiries.map(inquiry => (
                    <div key={inquiry.id} className="p-6 md:p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-100 transition-colors overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <div className="max-w-full">
                          <h5 className="font-black text-lg text-slate-800 truncate">{inquiry.name}</h5>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-blue-600 text-sm font-bold truncate">{inquiry.email}</p>
                            <span className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
                            <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${inquiry.user_id ? 'text-emerald-500' : 'text-slate-400'}`}>
                              {inquiry.user_id ? <><ShieldCheck size={10} /> Linked</> : 'Guest'}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${
                          inquiry.status === 'responded' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="bg-slate-50 p-4 md:p-6 rounded-2xl text-slate-600 font-medium leading-relaxed mb-6 italic break-words">
                        "{inquiry.message}"
                      </p>
                      {inquiry.status === 'responded' ? (
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Admin Response</p>
                          <p className="text-slate-700 font-medium italic">"{inquiry.admin_response}"</p>
                        </div>
                      ) : (
                        <div className="mb-6 space-y-3">
                          <textarea 
                            value={responseTexts[inquiry.id] || ''}
                            onChange={e => setResponseTexts({...responseTexts, [inquiry.id]: e.target.value})}
                            placeholder="Type intelligence report for athlete..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 resize-none h-24"
                          />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Received: {new Date(inquiry.created_at).toLocaleString()}
                        </p>
                        {inquiry.status !== 'responded' && (
                          <button 
                            onClick={() => handleInquiryAction(inquiry.id, responseTexts[inquiry.id] || 'Understood. We are reviewing your request.')}
                            className="w-full sm:w-auto bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2"
                          >
                            Dispatch Response <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active inquiries in queue.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
