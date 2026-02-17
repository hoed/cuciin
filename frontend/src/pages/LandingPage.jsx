import React from 'react';
import { ShoppingBag, MapPin, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass-panel mt-4 px-6 py-4 mx-auto max-w-7xl left-0 right-0 flex justify-between items-center rounded-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#D2F235] rounded-xl flex items-center justify-center">
                        <ShoppingBag className="text-black" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter">CUCIIN</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                    <a href="#" className="hover:text-[#D2F235] transition-colors">Layanan</a>
                    <a href="#" className="hover:text-[#D2F235] transition-colors">Mitra</a>
                    <a href="#" className="hover:text-[#D2F235] transition-colors">Tentang Kami</a>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/login')} className="text-sm font-semibold hover:text-[#D2F235] transition-colors">Masuk</button>
                    <button onClick={() => navigate('/register')} className="btn btn-primary text-sm px-6">Daftar Sekarang</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-semibold mb-8 text-[#D2F235]">
                    <Zap size={14} /> Platform Laundry #1 di Surabaya
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Cucian Bersih,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D2F235] to-[#6366F1]">Hidup Makin Lebih.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                    Platform marketplace laundry cerdas berbasis AI. Jemput, cuci, antar kembali ke depan pintu anda dengan transparansi penuh.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button onClick={() => navigate('/register')} className="btn btn-primary px-8 py-4 text-lg w-full md:w-auto">Pesan Laundry Sekarang</button>
                    <button onClick={() => navigate('/partner')} className="btn btn-secondary px-8 py-4 text-lg w-full md:w-auto">Buka Mitra Laundry</button>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-10">
                    <div className="w-14 h-14 bg-[#6366F1]/20 rounded-2xl flex items-center justify-center mb-6">
                        <MapPin className="text-[#6366F1]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Berbasis Lokasi</h3>
                    <p className="text-slate-400">Pilih mitra laundry terdekat dari rumah anda untuk biaya antar-jemput yang lebih ekonomis.</p>
                </div>
                <div className="glass-card p-10">
                    <div className="w-14 h-14 bg-[#D2F235]/20 rounded-2xl flex items-center justify-center mb-6">
                        <Zap className="text-[#D2F235]" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Estimasi Cerdas AI</h3>
                    <p className="text-slate-400">Input jenis cucian, sistem AI kami akan memberikan estimasi waktu dan harga yang sangat akurat.</p>
                </div>
                <div className="glass-card p-10">
                    <div className="w-14 h-14 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck className="text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Penjamin Kualitas</h3>
                    <p className="text-slate-400">Setiap mitra diverifikasi ketat. Jika hasil tidak memuaskan, garansi cuci ulang gratis.</p>
                </div>
            </section>

            {/* Footer Mock */}
            <footer className="py-10 border-t border-slate-800 text-center text-slate-500 text-sm">
                &copy; 2024 Cuciin Platform. Built with AI in Surabaya.
            </footer>
        </div>
    );
};

export default LandingPage;
