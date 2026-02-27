import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, MapPin, Calculator, Plus, Loader2 } from 'lucide-react';
import OrderModal from '../../components/OrderModal';
import api from '../../api';

const CustomerDashboard = () => {
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    let user = { id: "demo-id", name: "Budi Santoso" };
    try {
        const stored = localStorage.getItem('user');
        if (stored && stored !== 'undefined') {
            user = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error parsing user data");
    }

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/api/orders/user/${user.id}?role=CUSTOMER`);
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Fetch orders error:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <DashboardLayout role="Pelanggan" userName={user.name}>
            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                customerId={user.id}
                customerLat={-7.2855} // Default from demo user
                customerLng={112.7483}
                refreshOrders={fetchOrders}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Quick Actions & Stats */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Action Bar */}
                    <div className="glass-panel p-2 flex gap-2">
                        <button
                            onClick={() => setIsOrderModalOpen(true)}
                            className="flex-1 btn btn-primary py-4"
                        >
                            <Plus size={20} /> Buat Order Baru
                        </button>
                        <button className="flex-1 btn btn-secondary py-4">
                            <Calculator size={20} /> Estimasi Harga
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard label="Total Order" value={orders.length} />
                        <StatCard label="Sedang Proses" value={orders.filter(o => o.status !== 'COMPLETED').length} />
                        <StatCard label="Point Cuciin" value="450" />
                    </div>

                    {/* Recent Orders Table */}
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold mb-6">Order Terbaru</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#D2F235]" /></div>
                            ) : orders.length > 0 ? (
                                orders.map(order => (
                                    <OrderRow
                                        key={order.id}
                                        id={order.orderNumber}
                                        partner={order.partner?.name || "Mencari Mitra..."}
                                        status={order.status}
                                        price={`Rp ${(order.totalPrice || 0).toLocaleString()}`}
                                        date={new Date(order.createdAt).toLocaleDateString('id-ID')}
                                    />
                                ))
                            ) : (
                                <div className="text-center p-8 text-slate-500 text-sm">Belum ada order. Mulai sekarang!</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Assistant & Maps */}
                <div className="space-y-8">
                    <div className="glass-panel p-6 bg-gradient-to-br from-[#6366F1]/20 to-transparent border-[#6366F1]/30">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#D2F235] rounded-full animate-pulse"></span>
                            Cuciin AI Assistant
                        </h3>
                        <div className="bg-[#0F172A]/50 rounded-xl p-4 mb-4 text-sm text-slate-300">
                            "Halo kak Budi! Order #ORD-001 kakak saat ini sedang tahap pengeringan. Estimasi selesai jam 15:00 hari ini ya."
                        </div>
                        <input
                            type="text"
                            placeholder="Tanya status atau estimasi..."
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-sm focus:border-[#D2F235] outline-none"
                        />
                    </div>

                    <div className="glass-panel p-6 h-64 flex flex-col items-center justify-center text-center">
                        <MapPin className="text-[#D2F235] mb-4" size={32} />
                        <h3 className="font-bold mb-2">Lokasi Penjemputan</h3>
                        <p className="text-sm text-slate-400">Jl. Gubeng No. 123, Surabaya</p>
                        <button className="btn btn-secondary mt-4 text-xs">Ubah Lokasi</button>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

const StatCard = ({ label, value }) => (
    <div className="glass-panel p-6">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
);

const OrderRow = ({ id, partner, status, price, date }) => (
    <div className="glass-card p-4 flex justify-between items-center">
        <div>
            <div className="text-xs text-[#D2F235] font-bold mb-1">{id}</div>
            <div className="font-bold">{partner}</div>
            <div className="text-xs text-slate-500">{date}</div>
        </div>
        <div className="text-right">
            <div className="text-sm font-bold">{price}</div>
            <div className="mt-1">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase">
                    {status}
                </span>
            </div>
        </div>
    </div>
);

export default CustomerDashboard;
