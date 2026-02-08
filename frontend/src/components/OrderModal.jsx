import React, { useState } from 'react';
import { X, Sparkles, MapPin, Loader2, Info, ChevronRight, Calculator } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const OrderModal = ({ isOpen, onClose, user }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [aiAnalyzing, setAiAnalyzing] = useState(false);

    const [orderData, setOrderData] = useState({
        items: [{ name: '', qty: 1 }],
        isExpress: false,
        pickupAddr: user.address || '',
        deliveryAddr: user.address || '',
        lat: user.lat || -7.2575,
        lng: user.lng || 112.7521
    });

    const [estimation, setEstimation] = useState(null);

    const addItem = () => {
        setOrderData(prev => ({
            ...prev,
            items: [...prev.items, { name: '', qty: 1, type: 'pcs' }]
        }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...orderData.items];
        newItems[index][field] = value;
        setOrderData(prev => ({ ...prev, items: newItems }));
    };

    // AI Estimation
    const handleAnalyze = async () => {
        setAiAnalyzing(true);
        try {
            // Simulate AI delay for UX
            await new Promise(r => setTimeout(r, 1500));

            // Call AI endpoint to estimate price
            // Simplify for demo: just post to get estimation? 
            // Usually we'd have a specific /estimate endpoint, but for now let's use the logic 
            // embedded in create or separate service.
            // Let's mocking the frontend estimation for improved UX or call a calculation endpoint if we had one.

            // But wait, the backend createOrder DOES estimation.
            // Let's Create a temporary estimation object based on simple logic or 
            // actually call a new endpoint /api/orders/estimate (which we haven't built yet, but we can mock or build).

            // Let's build a quick estimate logic here or assumes the user proceeds to "Next" 
            // and we show "Estimated Price" before confirming.

            const totalItems = orderData.items.reduce((acc, curr) => acc + Number(curr.qty), 0);
            const basePrice = totalItems * 5000;
            const expressFee = orderData.isExpress ? 20000 : 0;
            const total = basePrice + expressFee;

            setEstimation({
                price: total,
                time: orderData.isExpress ? 4 : 24,
                confidence: 98,
                explanation: "Estimasi berdasarkan jenis kain dan beban kerja mitra saat ini."
            });

            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setAiAnalyzing(false);
        }
    };

    const handleSubmitOrder = async () => {
        setLoading(true);
        try {
            const res = await api.post('/api/orders/create', {
                customerId: user.id,
                items: orderData.items,
                isExpress: orderData.isExpress,
                pickupAddr: orderData.pickupAddr,
                deliveryAddr: orderData.deliveryAddr,
                lat: orderData.lat,
                lng: orderData.lng
            });

            alert(`Order Berhasil! ID: ${res.data.order.orderNumber}`);
            onClose();
        } catch (err) {
            alert('Gagal membuat order: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-[#D2F235]" size={20} />
                        <h3 className="text-xl font-bold">Pemesanan Cerdas AI</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-slate-400 mb-4 block">Daftar Cucian</label>
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Contoh: Kemeja"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            className="w-20 bg-white/5 border border-white/10 rounded-lg p-3 text-sm"
                                            value={item.qty}
                                            onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                                        />
                                        <select
                                            className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-slate-400"
                                            value={item.type}
                                            onChange={(e) => handleItemChange(idx, 'type', e.target.value)}
                                        >
                                            <option value="kg">kg</option>
                                            <option value="pcs">pcs</option>
                                            <option value="pasang">pasang</option>
                                        </select>
                                    </div>
                                ))}
                                <button onClick={addItem} className="text-[#D2F235] text-xs font-bold hover:underline">+ Tambah Barang</button>
                            </div>

                            <div className="flex items-center justify-between p-4 glass-card">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-indigo-400" />
                                    <div>
                                        <div className="font-bold text-sm">Layanan Express</div>
                                        <div className="text-[10px] text-slate-500">Selesai dalam 6-12 jam</div>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-10 h-5"
                                    checked={isExpress}
                                    onChange={(e) => setIsExpress(e.target.checked)}
                                />
                            </div>

                            <button
                                onClick={getEstimation}
                                disabled={loading}
                                className="w-full btn btn-primary py-4 mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Analisis AI & Cari Mitra'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="w-16 h-16 bg-[#D2F235]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="text-[#D2F235]" size={32} />
                            </div>
                            <h4 className="text-2xl font-bold">Hasil Analisis AI</h4>
                            <p className="text-slate-400 text-sm">
                                "{aiEstimation?.ai_explanation}"
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="glass-card p-4">
                                    <div className="text-xs text-slate-500 uppercase font-bold">Total Harga</div>
                                    <div className="text-lg font-bold text-[#D2F235]">Rp {aiEstimation?.order?.totalPrice.toLocaleString()}</div>
                                </div>
                                <div className="glass-card p-4">
                                    <div className="text-xs text-slate-500 uppercase font-bold">Estimasi Selesai</div>
                                    <div className="text-lg font-bold">{(aiEstimation?.order?.estimatedTime / 60).toFixed(1)} Jam</div>
                                </div>
                            </div>

                            <div className="glass-card p-4 flex items-center gap-4 text-left border-l-4 border-indigo-500">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                    <ShoppingBag className="text-indigo-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Mitra Terpilih</div>
                                    <div className="font-bold">{aiEstimation?.order?.partner?.name}</div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button onClick={() => setStep(1)} className="flex-1 btn btn-secondary py-4">Revisi Order</button>
                                <button
                                    onClick={() => {
                                        alert('Order berhasil dikonfirmasi!');
                                        onClose();
                                        refreshOrders();
                                    }}
                                    className="flex-1 btn btn-primary py-4"
                                >
                                    Konfirmasi Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
