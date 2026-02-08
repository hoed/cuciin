import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';
import api from '../api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/login', formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirect based on role
                const role = response.data.user.role;
                if (role === 'CUSTOMER') navigate('/dashboard');
                else if (role === 'PARTNER') navigate('/partner');
                else if (role === 'COURIER') navigate('/courier');
                else if (role === 'ADMIN') navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Email atau password salah.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-[#D2F235] rounded-xl flex items-center justify-center">
                        <ShoppingBag className="text-black" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Selamat Datang Kembali</h2>
                    <p className="text-slate-400 text-sm">Masuk ke akun Cuciin anda</p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass-panel p-8">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="input-field pl-10"
                                    placeholder="nama@email.com"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 bg-slate-800 border-slate-700 rounded" />
                                <label className="ml-2 block text-sm text-slate-400">Ingat saya</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-[#D2F235] hover:underline">Lupa password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-4 text-black font-bold"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Masuk sekarang'}
                        </button>
                    </form>

                    {/* Quick Demo Login */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mb-4">Akses Cepat Demo (Testing)</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setFormData({ email: 'budi@cuciin.com', password: 'password123' })} className="text-[10px] p-2 glass-card hover:border-[#D2F235] transition-colors">Pelanggan</button>
                            <button onClick={() => setFormData({ email: 'clean@cuciin.com', password: 'password123' })} className="text-[10px] p-2 glass-card hover:border-[#D2F235] transition-colors">Mitra Laundry</button>
                            <button onClick={() => setFormData({ email: 'slamet@cuciin.com', password: 'password123' })} className="text-[10px] p-2 glass-card hover:border-[#D2F235] transition-colors">Kurir</button>
                            <button onClick={() => setFormData({ email: 'admin@cuciin.com', password: 'password123' })} className="text-[10px] p-2 glass-card hover:border-[#D2F235] transition-colors">Admin</button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Belum punya akun?{' '}
                            <Link to="/register" className="text-[#D2F235] font-semibold hover:underline">
                                Daftar Gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
