import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Home,
    Clock,
    User,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    X,
    Sparkles
} from 'lucide-react';
import { io } from 'socket.io-client';
import { getSocketUrl } from '../api';

const DashboardLayout = ({ children, role = "Pemanntau", userName = "Pengguna" }) => {
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    let currentUser = {};
    try {
        const stored = localStorage.getItem('user');
        if (stored && stored !== 'undefined') {
            currentUser = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error parsing user data");
    }

    useEffect(() => {
        const socket = io(getSocketUrl());

        // Join rooms based on role
        if (currentUser.role === 'PARTNER') {
            socket.emit('join_order', `partner_${currentUser.id}`);
        } else if (currentUser.role === 'ADMIN') {
            socket.emit('join_order', 'admin_room');
        }

        socket.on('new_order', (data) => {
            setNotifications(prev => [{ id: Date.now(), type: 'ORDER', ...data }, ...prev]);
        });

        socket.on('admin_notification', (data) => {
            setNotifications(prev => [{ id: Date.now(), type: 'ADMIN', ...data }, ...prev]);
        });

        return () => socket.disconnect();
    }, [currentUser.id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="flex min-h-screen bg-[#0F172A] text-white">
            {/* Sidebar */}
            <aside className="w-64 glass-panel m-4 mr-0 flex flex-col items-center py-8">
                <div className="flex items-center gap-2 mb-12 px-6">
                    <div className="w-8 h-8 bg-[#D2F235] rounded-lg flex items-center justify-center">
                        <ShoppingBag size={18} className="text-black" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter">CUCIIN</span>
                </div>

                <nav className="flex-1 w-full px-4 space-y-2">
                    <SidebarItem icon={<Home size={20} />} label="Dashboard" active />
                    <SidebarItem icon={<Clock size={20} />} label="Riwayat Order" />
                    <SidebarItem icon={<MessageSquare size={20} />} label="AI Chat" />
                    <SidebarItem icon={<User size={20} />} label="Profil" />
                </nav>

                <div className="w-full px-4 mt-auto">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto relative">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold">Halo, {userName} 👋</h2>
                        <p className="text-slate-400 text-sm">Selamat datang di dashboard {role} anda.</p>
                    </div>
                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setShowNotif(!showNotif)}
                            className="h-12 w-12 glass-card flex items-center justify-center rounded-xl relative hover:border-[#D2F235]/50 transition-all"
                        >
                            <Bell size={20} />
                            {notifications.length > 0 && (
                                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0F172A]"></div>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotif && (
                            <div className="absolute top-16 right-0 w-80 glass-panel p-4 z-[100] animate-fade-in shadow-2xl">
                                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                    <h4 className="font-bold text-sm">Pemberitahuan</h4>
                                    <button onClick={() => setNotifications([])} className="text-[10px] text-[#D2F235] hover:underline">Hapus Semua</button>
                                </div>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(notif => (
                                        <div key={notif.id} className="p-3 glass-card text-xs flex gap-3 items-start border-l-2 border-[#D2F235]">
                                            <div className="w-8 h-8 rounded-lg bg-[#D2F235]/10 flex items-center justify-center shrink-0">
                                                <Sparkles size={14} className="text-[#D2F235]" />
                                            </div>
                                            <div>
                                                <div className="font-bold uppercase text-[9px] text-slate-500">{notif.type} BARU</div>
                                                <p className="text-slate-300 mt-0.5">{notif.message}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-slate-500 text-xs">Tidak ada notifikasi baru</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="h-12 glass-card flex items-center gap-3 px-4 rounded-xl">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20">
                                {userName ? String(userName).charAt(0).toUpperCase() : '?'}
                            </div>
                            <span className="font-medium text-sm">{userName || "Pengguna"}</span>
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active = false }) => (
    <a href="#" className={`
    flex items-center gap-3 w-full p-3 rounded-xl transition-all
    ${active ? 'bg-[#D2F235] text-black shadow-lg shadow-[#D2F235]/20' : 'text-slate-400 hover:bg-white/5'}
  `}>
        {icon}
        <span className="font-medium">{label}</span>
    </a>
);

export default DashboardLayout;
