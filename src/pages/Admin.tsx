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

const AdminPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'inquiries' | 'promotions'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Promotion Form State
  const [promoData, setPromoData] = useState({ title: '', content: '', type: 'General' });
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'admin')) {
      navigate('/dashboard');
      notify("Unauthorized access. Admin protocols required.", "error");
    }
  }, [user, profile, authLoading, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Bookings
      const bookingsRef = collection(db, 'bookings');
      const bQuery = query(bookingsRef, orderBy('created_at', 'desc'));
      const bSnap = await getDocs(bQuery);
      setBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch Inquiries
      const inquiriesRef = collection(db, 'inquiries');
      const iQuery = query(inquiriesRef, orderBy('created_at', 'desc'));
      const iSnap = await getDocs(iQuery);
      setInquiries(iSnap.docs.map(d => ({ id: d.id, ...d.data() })));

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
      const bRef = doc(db, 'bookings', id);
      await updateDoc(bRef, { status, updated_at: new Date().toISOString() });
      notify(`Booking ${status}.`, "success");
      fetchData();
    } catch (e) {
      notify("Action failed.", "error");
    }
  };

  const handleInquiryAction = async (id: string, status: 'responded') => {
    try {
      const iRef = doc(db, 'inquiries', id);
      await updateDoc(iRef, { status, updated_at: new Date().toISOString() });
      notify("Inquiry status updated.", "success");
      fetchData();
    } catch (e) {
      notify("Action failed.", "error");
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoData.title || !promoData.content) return;
    
    setIsSubmittingPromo(true);
    try {
      const updatesRef = collection(db, 'program_updates');
      await addDoc(updatesRef, {
        ...promoData,
        created_at: new Date().toISOString(),
        program_type: promoData.type
      });
      
      notify("Promotion dispatched successfully.", "success");
      setPromoData({ title: '', content: '', type: 'General' });
      fetchData();
    } catch (e) {
      notify("Dispatch failed.", "error");
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  if (authLoading || (loading && bookings.length === 0)) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <LoadingSpinner size={48} />
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
              { id: 'inquiries', label: 'Inquiries', icon: Mail },
              { id: 'promotions', label: 'Promotions', icon: Zap }
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
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8">Manage Bookings.</h3>
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
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8">Inquiry Inbox.</h3>
                  {inquiries.length > 0 ? inquiries.map(inquiry => (
                    <div key={inquiry.id} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h5 className="font-black text-lg text-slate-800">{inquiry.name}</h5>
                          <p className="text-blue-600 text-sm font-bold">{inquiry.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          inquiry.status === 'responded' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="bg-slate-50 p-6 rounded-2xl text-slate-600 font-medium leading-relaxed mb-6 italic">
                        "{inquiry.message}"
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Received: {new Date(inquiry.created_at).toLocaleString()}
                        </p>
                        {inquiry.status !== 'responded' && (
                          <button 
                            onClick={() => handleInquiryAction(inquiry.id, 'responded')}
                            className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center gap-2"
                          >
                            Mark as Responded <ArrowRight size={14} />
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

              {activeTab === 'promotions' && (
                <motion.div 
                  key="promotions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8">Promotion Studio.</h3>
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <form onSubmit={handleCreatePromo} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Promotion Title</label>
                          <input 
                            required
                            type="text" 
                            value={promoData.title}
                            onChange={e => setPromoData({...promoData, title: e.target.value})}
                            placeholder="e.g. New Year Muscle Rebuild"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Target Program Type</label>
                          <select 
                            value={promoData.type}
                            onChange={e => setPromoData({...promoData, type: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800 appearance-none"
                          >
                            <option value="General">General (Global)</option>
                            <option value="Elite">Elite Only</option>
                            <option value="Vanguard">Vanguard Tier</option>
                            <option value="Titan">Titan Tier</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Broadcast Message</label>
                        <textarea 
                          required
                          rows={4}
                          value={promoData.content}
                          onChange={e => setPromoData({...promoData, content: e.target.value})}
                          placeholder="What would you like to announce to your athletes?"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-800 resize-none"
                        ></textarea>
                      </div>

                      <button 
                        disabled={isSubmittingPromo}
                        className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-widest disabled:opacity-50"
                      >
                        {isSubmittingPromo ? (
                          <>
                            <LoadingSpinner size={20} /> Dispatching Intelligence...
                          </>
                        ) : (
                          <>
                            <Zap size={20} fill="white" /> Dispatch Intelligence
                          </>
                        )}
                      </button>
                    </form>
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

export default AdminPage;
