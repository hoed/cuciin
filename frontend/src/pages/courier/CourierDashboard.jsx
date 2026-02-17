import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { MapPin, Navigation, Package, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CourierDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [currentOrder, setCurrentOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/api/orders/user/${user.id}?role=COURIER`);
            setOrders(res.data);
            // Auto-select first active order
            const active = res.data.find(o => ['PICKUP_ASSIGNED', 'DELIVERING'].includes(o.status));
            if (active) setCurrentOrder(active);
        } catch (err) {
            console.error("Fetch courier orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user.id]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/api/orders/${orderId}/status`, {
                status: newStatus,
                courierId: user.id
            });
            alert(`Status berhasil diupdate: ${newStatus}`);
            fetchOrders();
        } catch (err) {
            alert("Gagal update status");
        }
    };

    return (
        <DashboardLayout role="Kurir" userName={user.name}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">

                {/* Left: Task List */}
                <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
                    <div className="glass-panel p-4 sticky top-0 bg-[#0F172A]/90 backdrop-blur z-10 mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Navigation size={20} className="text-[#D2F235]" />
                            Tugas Pengiriman
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#D2F235]" /></div>
                    ) : orders.length > 0 ? (
                        orders.map(order => (
                            <div
                                key={order.orderNumber}
                                onClick={() => setCurrentOrder(order)}
                                className={`glass-card p-4 cursor-pointer transition-all hover:border-[#D2F235]/50 ${currentOrder?.id === order.id ? 'border-[#D2F235] bg-[#D2F235]/5' : ''}`}
                            >
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-sm">{order.orderNumber}</span>
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full uppercase">{order.status}</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-slate-400 mb-2">
                                    <MapPin size={14} className="mt-0.5 text-indigo-400" />
                                    <div>
                                        <div className="font-semibold text-white">Jemput: {order.pickupAddr}</div>
                                        <div className="mt-1">Antar: {order.deliveryAddr}</div>
                                    </div>
                                </div>

                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.orderNumber, 'PICKUP_ASSIGNED'); }}
                                        className="w-full btn btn-primary py-2 text-xs mt-2"
                                    >
                                        Ambil Order
                                    </button>
                                )}
                                {order.status === 'PICKUP_ASSIGNED' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.orderNumber, 'PICKED_UP'); }}
                                        className="w-full btn btn-secondary py-2 text-xs mt-2"
                                    >
                                        Konfirmasi Penjemputan
                                    </button>
                                )}
                                {order.status === 'READY_FOR_DELIVERY' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.orderNumber, 'DELIVERING'); }}
                                        className="w-full btn btn-primary py-2 text-xs mt-2"
                                    >
                                        Mulai Pengantaran
                                    </button>
                                )}
                                {order.status === 'DELIVERING' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.orderNumber, 'COMPLETED'); }}
                                        className="w-full btn btn-primary py-2 text-xs mt-2 bg-green-500 hover:bg-green-600 text-white border-none"
                                    >
                                        Selesaikan Tugas
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-8 text-slate-500 text-sm">Belum ada tugas tersedia.</div>
                    )}
                </div>

                {/* Right: Map View */}
                <div className="lg:col-span-2 h-full rounded-2xl overflow-hidden glass-panel relative">
                    {currentOrder && currentOrder.lat && currentOrder.lng ? (
                        <MapContainer center={[currentOrder.lat, currentOrder.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* Customer Location */}
                            <Marker position={[currentOrder.lat, currentOrder.lng]}>
                                <Popup>
                                    <b>Pelanggan: {currentOrder.customer?.name}</b><br />
                                    {currentOrder.pickupAddr}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <MapPin size={48} className="mb-4 opacity-50" />
                            <p>Pilih tugas untuk melihat lokasi</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CourierDashboard;
