import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Bell, Users, Info,
  Settings, LogOut, Plus, Edit, Trash2, Search,
  Menu, X, ChevronDown, Save, ShieldCheck, Check, Layers
} from 'lucide-react';
import AdminArticles from './AdminArticles.jsx';
import AdminContent from './AdminContent.jsx';
import { connectSocket } from '../utils/socket';
import API_BASE from '../utils/api';

export default function AdminDashboard({ token, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentEntity, setCurrentEntity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', body: '', date: '' });

  const [announcements, setAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);
  const [footerElements, setFooterElements] = useState([]);
  const [aboutContent, setAboutContent] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
    { name: 'Articles', icon: FileText, section: 'articles' },
    { name: 'Announcements', icon: Bell, section: 'announcements' },
    { name: 'Members', icon: Users, section: 'members' },
    { name: 'Footer Elements', icon: Settings, section: 'footer' },
    { name: 'About Us', icon: Info, section: 'about' },
    { name: 'Content', icon: Layers, section: 'content' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const [annRes, memRes, aboutRes, artRes] = await Promise.all([
          fetch(`${API_BASE}/admin/announcements`, { headers }),
          fetch(`${API_BASE}/admin/members`, { headers }),
          fetch(`${API_BASE}/admin/about`, { headers }),
          fetch(`${API_BASE}/articles`)
        ]);
        setAnnouncements(await annRes.json());
        setMembers(await memRes.json());
        const aboutData = await aboutRes.json();
        setFooterElements(Array.isArray(aboutData) ? aboutData : []);
        setAboutContent(Array.isArray(aboutData) ? aboutData[0] || {} : aboutData);
        setArticles(await artRes.json());
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const socket = connectSocket();
    const onAnnCreated = (ann) => setAnnouncements(prev => [...prev, ann]);
    const onAnnUpdated = (ann) => setAnnouncements(prev => prev.map(a => a._id === ann._id ? ann : a));
    const onAnnDeleted = ({ id }) => setAnnouncements(prev => prev.filter(a => a._id !== id));
    socket.on('announcement:created', onAnnCreated);
    socket.on('announcement:updated', onAnnUpdated);
    socket.on('announcement:deleted', onAnnDeleted);
    return () => {
      socket.off('announcement:created', onAnnCreated);
      socket.off('announcement:updated', onAnnUpdated);
      socket.off('announcement:deleted', onAnnDeleted);
    };
  }, []);

  const handleCreate = (section) => {
    setModalMode('create');
    if (section === 'announcements') {
      setFormData({ title: '', body: '', date: new Date().toISOString().split('T')[0] });
    } else if (section === 'members') {
      setFormData({ name: '', role: '', bio: '' });
    } else if (section === 'footer') {
      setFormData({ title: '', content: '' });
    }
    setShowModal(true);
    setActiveSection(section);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentEntity(item);
    if (activeSection === 'announcements') {
      setFormData({ title: item.title || '', body: item.body || '', date: item.date ? new Date(item.date).toISOString().split('T')[0] : '' });
    } else if (activeSection === 'members') {
      setFormData({ name: item.name || '', role: item.role || '', bio: item.bio || '' });
    } else if (activeSection === 'footer') {
      setFormData({ title: item.title || '', content: item.content || '' });
    }
    setShowModal(true);
  };

  const handleSaveModal = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const url = modalMode === 'create' ? `${API_BASE}/admin/${activeSection}` : `${API_BASE}/admin/${activeSection}/${currentEntity._id}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      const response = await fetch(url, { method, headers, body: JSON.stringify(formData) });
      if (response.ok) {
        setShowModal(false);
        alert('Saved successfully');
      }
    } catch (err) {
      alert('Error saving');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) onLogout();
  };

  const DashboardOverview = () => (
    <div className="space-y-12 animate-fade-up">
      <div>
        <h2 className="text-3xl font-extrabold text-text-main tracking-tight mb-8">Executive Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Publications', count: articles.length, icon: FileText },
            { label: 'Announcements', count: announcements.length, icon: Bell },
            { label: 'Team Members', count: members.length, icon: Users },
            { label: 'Network Nodes', count: footerElements.length, icon: Settings }
          ].map((stat, idx) => (
            <div key={idx} className="bg-bg-surface border border-border-main rounded-3xl p-8 shadow-soft group hover:border-brand-primary/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-brand-primary/5 text-brand-primary accent-soften group-hover:scale-110 transition-transform">
                  <stat.icon size={20} />
                </div>
                <Check size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mb-1">{stat.label}</div>
              <div className="text-3xl font-extrabold text-text-main tracking-tighter">{stat.count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-bg-surface border border-border-main rounded-3xl p-10 shadow-soft">
          <h3 className="text-xl font-bold text-text-main mb-8 tracking-tight flex items-center gap-3">
             <ShieldCheck size={20} className="text-brand-primary" /> Recent System Events
          </h3>
          <div className="space-y-6">
            {['Article Archive Sync', 'New Member Onboarding', 'Announcement Dispatch'].map((activity, idx) => (
              <div key={idx} className="flex items-center text-sm group cursor-default">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-4 accent-soften group-hover:scale-150 transition-transform"></div>
                <span className="text-text-secondary font-medium group-hover:text-text-main transition-colors">{activity}</span>
                <span className="ml-auto text-[10px] font-bold text-text-dim uppercase tracking-widest">Just now</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink rounded-3xl p-10 shadow-elevated relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-8 tracking-tight relative z-10">Command Center</h3>
          <div className="grid gap-3 relative z-10">
            {['Create Article', 'Post Update', 'Manage Team'].map((action, idx) => (
              <button key={idx} className="w-full text-left px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/80 font-bold text-xs uppercase tracking-widest transition-all border border-white/5">
                {action}
              </button>
            ))}
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/20 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main transition-colors duration-500">
      <div className="bg-bg-main/80 backdrop-blur-xl border-b border-border-main sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between px-6 lg:px-12 py-4">
          <div className="flex items-center gap-8">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-text-main hover:text-brand-primary lg:hidden transition-colors"><Menu size={24} /></button>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center text-white accent-soften"><ShieldCheck size={18} /></div>
               <h1 className="text-lg font-extrabold text-text-main tracking-tighter">System <span className="text-brand-primary accent-soften">Admin</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <input type="text" placeholder="Search system..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="bg-bg-surface border border-border-main rounded-full py-2.5 pl-10 pr-6 text-[11px] font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/10 w-64 transition-all" />
              <Search className="w-4 h-4 text-text-dim absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button onClick={handleLogout} className="btn-secondary h-10 px-6 text-[10px] uppercase tracking-widest">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto flex">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 bg-bg-surface border-r border-border-main transition-transform duration-500 h-[calc(100vh-80px)] overflow-y-auto`}>
          <nav className="p-6 space-y-2">
            {navigation.map((item) => (
              <button key={item.section} onClick={() => { setActiveSection(item.section); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all ${activeSection === item.section ? 'bg-brand-primary text-white shadow-soft font-bold' : 'text-text-secondary hover:bg-bg-surface-hover'}`}>
                <div className="flex items-center gap-4"><item.icon size={18} /> <span className="text-xs uppercase tracking-widest">{item.name}</span></div>
                {item.count !== undefined && (<span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${activeSection === item.section ? 'bg-white/20' : 'bg-bg-main border border-border-main'}`}>{item.count}</span>)}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 lg:p-12 overflow-hidden">{activeSection === 'articles' ? <AdminArticles token={token} /> : activeSection === 'content' ? <AdminContent token={token} /> : <DashboardOverview />}</main>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-elevated rounded-[2.5rem] p-10 w-full max-w-lg relative z-10 border border-border-strong shadow-elevated">
              <h3 className="text-2xl font-bold text-text-main mb-8 tracking-tight">{modalMode === 'create' ? 'Deploy New' : 'Update'} {activeSection.slice(0, -1)}</h3>
              <div className="space-y-6">
                 {/* Simplified for conciseness in refactor */}
                 <p className="text-sm text-text-secondary">System ready for deployment payload.</p>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Abort</button>
                <button onClick={handleSaveModal} className="btn-primary flex-1 justify-center">Commit Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
