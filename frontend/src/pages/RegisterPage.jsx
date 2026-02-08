import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Mail, Lock, Phone, MapPin, Loader2 } from 'lucide-react';
import api from '../api';
import MapPicker from '../components/MapPicker';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'CUSTOMER',
        lat: -7.2575,
        lng: 112.7521
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationSelect = (pos) => {
        setFormData(prev => ({ ...prev, lat: pos.lat, lng: pos.lng }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/register', formData);
            if (response.status === 201) {
                alert('Registrasi berhasil! Silakan login.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Terjadi kesalahan saat registrasi.');
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
                    <h2 className="text-3xl font-bold tracking-tight text-white">Buat Akun Cuciin</h2>
                    <p className="text-slate-400 text-sm">Bergabung dengan platform laundry cerdas</p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="glass-panel p-8">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 p-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="input-group">
                                <label className="input-label">Nama Lengkap</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 text-slate-500" size={18} />
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="input-field pl-10"
                                        placeholder="Contoh: Budi Santoso"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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

                            <div className="input-group">
                                <label className="input-label">Nomor WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-slate-500" size={18} />
                                    <input
                                        name="phone"
                                        type="text"
                                        required
                                        className="input-field pl-10"
                                        placeholder="08123456789"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Alamat Lengkap</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                                <textarea
                                    name="address"
                                    required
                                    rows="2"
                                    className="input-field pl-10"
                                    placeholder="Jl. Nama Jalan No. XX, Surabaya"
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Tentukan Lokasi (Leaflet Map)</label>
                            <p className="text-[10px] text-slate-500 mb-2">Geser peta atau klik untuk akurasi penjemputan</p>
                            <MapPicker onLocationSelect={handleLocationSelect} />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 btn btn-primary py-4 text-black font-bold flex justify-center items-center"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="text-[#D2F235] font-semibold hover:underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
