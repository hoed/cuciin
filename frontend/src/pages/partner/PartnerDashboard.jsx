import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Package, TrendingUp, Users, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api';

const PartnerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/api/orders/user/${user.id}?role=PARTNER`);
            setOrders(res.data);
        } catch (err) {
            console.error("Fetch partner orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user.id]);

    return (
        <DashboardLayout role="Mitra Laundry" userName={user.name}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 text-white">
                <StatCard label="Order Aktif" value={orders.length} icon={<Package className="text-[#D2F235]" />} />
                <StatCard label="Pendapatan (Rp)" value="1.2M" icon={<TrendingUp className="text-[#10B981]" />} />
                <StatCard label="Pelanggan Baru" value="5" icon={<Users className="text-[#6366F1]" />} />
                <StatCard label="Kapasitas Sisa" value="35%" icon={<AlertCircle className="text-[#F59E0B]" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
                {/* Active Orders List */}
                <div className="lg:col-span-2 glass-panel p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Daftar Pekerjaan</h3>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#D2F235]" /></div>
                        ) : orders.length > 0 ? orders.map(order => (
                            <JobRow
                                key={order.id}
                                id={order.orderNumber}
                                name={order.customer?.name || "Pelanggan"}
                                service={Array.isArray(order.items) ? order.items[0]?.name : "Laundry"}
                                status={order.status}
                                time="New Task"
                            />
                        )) : (
                            <div className="text-center p-8 text-slate-500 text-sm">Tidak ada pekerjaan saat ini.</div>
                        )}
                    </div>
                </div>

                {/* AI Insight Section */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 border-l-4 border-[#D2F235]">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <TrendingUp size={18} className="text-[#D2F235]" />
                            AI Laundry Insight
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            "Prediksi overload hari ini jam 17:00. Rekomendasi: Matikan layanan Express sementara untuk menjaga kualitas."
                        </p>
                        <button className="btn btn-primary w-full mt-4 text-xs py-2">Terapkan Rekomendasi</button>
                    </div>

                    <div className="glass-panel p-6 text-white text-opacity-80">
                        <h3 className="font-bold mb-4">Status Mesin</h3>
                        <div className="space-y-3">
                            <MachineRow label="Mesin Cuci A1" status="Active" color="#10B981" />
                            <MachineRow label="Mesin Cuci A2" status="Maintenance" color="#EF4444" />
                            <MachineRow label="Mesin Pengering B1" status="Active" color="#10B981" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ label, value, icon }) => (
    <div className="glass-panel p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    </div>
);

const JobRow = ({ id, name, service, status, time, alert = false }) => (
    <div className={`glass-card p-4 flex justify-between items-center ${alert ? 'border-l-2 border-rose-500' : ''}`}>
        <div className="flex gap-4 items-center">
            <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center font-bold text-[#D2F235]">
                {id.includes('-') ? id.split('-')[1] : '000'}
            </div>
            <div>
                <div className="font-bold text-sm">{name}</div>
                <div className="text-xs text-slate-500">{service}</div>
            </div>
        </div>
        <div className="text-right">
            <div className={`text-[10px] font-bold uppercase mb-1 ${alert ? 'text-rose-500' : 'text-indigo-400'}`}>
                {status}
            </div>
            <div className="text-[10px] text-slate-500">{time}</div>
        </div>
    </div>
);

const MachineRow = ({ label, status, color }) => (
    <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="flex items-center gap-1.5" style={{ color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
            {status}
        </span>
    </div>
);

export default PartnerDashboard;
