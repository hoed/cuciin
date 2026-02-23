import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Users,
    AlertTriangle,
    ShieldCheck,
    TrendingUp,
    Activity,
    Loader2
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api';
import Typewriter from 'typewriter-effect';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/api/orders/user/${user.id}?role=ADMIN`);
            setOrders(res.data);
        } catch (err) {
            console.error("Fetch admin orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user.id]);

    // Calculate Stats
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'COMPLETED').length;
    const fraudAlerts = orders.filter(o => o.items && o.items.length > 20).length; // Simple fraud logic

    const chartData = [
        { name: 'Mon', revenue: 4000 },
        { name: 'Tue', revenue: 3000 },
        { name: 'Wed', revenue: 2000 },
        { name: 'Thu', revenue: 2780 },
        { name: 'Fri', revenue: 1890 },
        { name: 'Sat', revenue: 2390 },
        { name: 'Sun', revenue: 3490 },
    ];

    return (
        <DashboardLayout role="Administrator" userName={user.name}>
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex gap-2">
                    <span className="text-[#D2F235]">System Status:</span>
                    <Typewriter
                        options={{
                            strings: ['Operational', 'Monitoring Active', 'Secure'],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Total Revenue"
                    value={`Rp ${(totalRevenue / 1000).toFixed(1)}K`}
                    sub="Bulan Ini"
                    trend="+12.5%"
                    icon={<TrendingUp className="text-[#D2F235]" />}
                />
                <StatCard
                    label="Active Orders"
                    value={activeOrders}
                    sub="Live Tasks"
                    trend="+5.2%"
                    icon={<Activity className="text-[#6366F1]" />}
                />
                <StatCard
                    label="New Users"
                    value="128"
                    sub="Hari Ini"
                    trend="+22%"
                    icon={<Users className="text-[#10B981]" />}
                />
                <StatCard
                    label="Fraud Alerts"
                    value={fraudAlerts}
                    sub="Butuh Review"
                    alert={fraudAlerts > 0}
                    icon={<AlertTriangle className="text-rose-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Charts Panel */}
                    <div className="glass-panel p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Analisis Performa</h3>
                            <select className="bg-white/5 border border-white/10 rounded-lg text-xs p-2 outline-none">
                                <option>7 Hari Terakhir</option>
                                <option>30 Hari Terakhir</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="revenue" fill="#D2F235" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="glass-panel p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Transaksi Masuk</h3>
                            <button className="text-xs text-[#D2F235] hover:underline">Lihat Semua</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase border-b border-white/10">
                                    <tr>
                                        <th className="px-4 py-3">Order ID</th>
                                        <th className="px-4 py-3">Pelanggan</th>
                                        <th className="px-4 py-3">Mitra</th>
                                        <th className="px-4 py-3">Total</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="text-center p-4"><Loader2 className="animate-spin inline text-[#D2F235]" /> Loading...</td></tr>
                                    ) : orders.map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                                            <td className="px-4 py-3 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                                    {order.customer?.name?.charAt(0)}
                                                </div>
                                                {order.customer?.name}
                                            </td>
                                            <td className="px-4 py-3">{order.partner?.name || "-"}</td>
                                            <td className="px-4 py-3 font-bold text-[#D2F235]">Rp {(order.totalPrice || 0).toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                                    order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Insights & Alerts */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 border-l-4 border-rose-500">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="text-rose-500" size={20} />
                            <h3 className="font-bold">AI Fraud Detection</h3>
                        </div>
                        <div className="space-y-4">
                            {fraudAlerts > 0 ? (
                                <AlertBox
                                    title="Unusual Activity"
                                    desc={`${fraudAlerts} orders have unusually large item counts. Review required.`}
                                />
                            ) : (
                                <div className="text-sm text-slate-500">No active alerts. System secure.</div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="font-bold mb-4">Top Mitra (Bulan Ini)</h3>
                        <div className="space-y-4">
                            <PartnerRow rank="1" name="Clean & Fresh" score="98" />
                            <PartnerRow rank="2" name="Mama Laundry" score="95" />
                            <PartnerRow rank="3" name="Berkah Jaya" score="92" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ label, value, sub, trend, icon, alert = false }) => (
    <div className={`glass-panel p-6 relative overflow-hidden ${alert ? 'border-rose-500/30 bg-rose-500/5' : ''}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
                <div className="text-2xl font-bold font-mono">{value}</div>
            </div>
            <div className={`p-3 rounded-xl ${alert ? 'bg-rose-500/10' : 'bg-white/5'}`}>
                {icon}
            </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
            {trend && <span className={`${alert ? 'text-rose-400' : 'text-[#10B981]'} font-bold`}>{trend}</span>}
            <span className="text-slate-500">{sub}</span>
        </div>
    </div>
);

const AlertBox = ({ title, desc }) => (
    <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
        <div className="font-bold text-rose-500 text-xs mb-1 uppercase">{title}</div>
        <p className="text-slate-300 text-xs leading-relaxed">{desc}</p>
        <button className="mt-2 text-[10px] font-bold text-white bg-rose-500 px-3 py-1 rounded hover:bg-rose-600 transition-colors">Investigate</button>
    </div>
);

const PartnerRow = ({ rank, name, score }) => (
    <div className="flex items-center justify-between p-3 glass-card hover:bg-white/5 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === '1' ? 'bg-[#D2F235] text-black' : 'bg-white/10 text-slate-400'}`}>
                {rank}
            </div>
            <span className="font-medium text-sm">{name}</span>
        </div>
        <div className="text-xs font-bold text-[#D2F235]">
            {score}% Perf.
        </div>
    </div>
);

export default AdminDashboard;
