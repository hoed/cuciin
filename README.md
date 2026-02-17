# 🧺 Cuciin Platform - Smart Laundry Marketplace

Platform marketplace jasa laundry berbasis AI yang menghubungkan pelanggan dengan mitra laundry lokal di Surabaya. Dibangun dengan teknologi modern dan AI untuk memberikan pengalaman terbaik.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-20-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)

## 🌟 Fitur Utama

### 👥 Multi-Role System
- **Pelanggan**: Order laundry, tracking real-time, AI estimation
- **Mitra Laundry**: Kelola order, update status, AI insights
- **Kurir**: Navigasi pickup/delivery, update status
- **Admin**: Monitoring platform, fraud detection, analytics

### 🤖 AI-Powered Features
1. **AI Estimation Engine** - Estimasi harga & waktu berbasis Gemini AI
2. **AI Order Matching** - Pemilihan mitra optimal berdasarkan jarak, rating, kapasitas
3. **AI Customer Service** - Chatbot 24/7 dengan bahasa Indonesia santai
4. **AI Performance Monitoring** - Deteksi anomali, fraud, dan performa mitra

### 🗺️ Location-Based Services
- Integrasi **Leaflet Maps** untuk deteksi lokasi otomatis
- Radius-based partner matching
- Real-time courier tracking

### ⚡ Real-time Notifications
- **Socket.io** untuk notifikasi instant
- Order status updates
- Partner alerts untuk order baru

## 🛠️ Tech Stack

### Frontend
- **React.js** + **Vite** - Fast development & HMR
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Leaflet** + **React Leaflet** - Interactive maps
- **Lucide React** - Modern icon library

### Backend
- **Node.js** + **TypeScript** - Type-safe server
- **Express.js** - Web framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL (Neon)** - Cloud database
- **Socket.io** - WebSocket server
- **Google Gemini AI** - AI processing
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- PostgreSQL database (sudah tersedia di Neon)

### 1. Clone Repository
```bash
git clone <repository-url>
cd cuciin
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🔑 Demo Accounts

Gunakan akun berikut untuk testing (password semua: `password123`):

| Role | Email | Dashboard |
|------|-------|-----------|
| **Pelanggan** | budi@cuciin.com | `/dashboard` |
| **Mitra Laundry** | clean@cuciin.com | `/partner` |
| **Kurir** | slamet@cuciin.com | `/courier` |
| **Admin** | admin@cuciin.com | `/admin` |

## 🚀 Cara Menggunakan

### Sebagai Pelanggan:
1. Login dengan akun pelanggan
2. Klik **"Buat Order Baru"**
3. Input daftar cucian (nama item, jumlah, satuan)
4. Pilih layanan Express jika perlu
5. Klik **"Analisis AI & Cari Mitra"**
6. Review estimasi harga & waktu dari AI
7. Konfirmasi order

### Sebagai Mitra Laundry:
1. Login dengan akun mitra
2. Dashboard akan menampilkan order yang masuk
3. Terima notifikasi real-time saat ada order baru
4. Update status cucian sesuai progress
5. Lihat AI insights untuk optimasi kapasitas

### Sebagai Admin:
1. Login dengan akun admin
2. Monitor semua order di platform
3. Lihat fraud detection alerts
4. Analytics performa platform

## 📁 Project Structure

```
cuciin/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Demo data seeder
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic & AI
│   │   ├── middlewares/       # Auth, validation
│   │   └── index.ts           # Server entry point
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   │   ├── customer/      # Customer dashboard
│   │   │   ├── partner/       # Partner dashboard
│   │   │   ├── courier/       # Courier dashboard
│   │   │   └── admin/         # Admin dashboard
│   │   ├── context/           # State management
│   │   ├── hooks/             # Custom hooks
│   │   ├── App.jsx            # Main app component
│   │   └── index.css          # Global styles
│   └── public/
│
└── architecture.md            # System architecture docs
```

## 🎨 Design System

### Color Palette
- **Primary**: `#D2F235` (Neon Green-Yellow)
- **Secondary**: `#6366F1` (Indigo)
- **Accent**: `#F43F5E` (Rose)
- **Background**: `#0F172A` (Slate 900)
- **Surface**: `#1E293B` (Slate 800)

### UI Philosophy
- **Dark Mode Glassmorphism** - Modern, premium look
- **Micro-animations** - Smooth transitions
- **Mobile-first** - Responsive design
- **Accessibility** - WCAG compliant

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="your-gemini-api-key"
PORT=5000
JWT_SECRET="your-secret-key"
```

## 📊 Database Schema

### Main Tables
- `User` - Multi-role user accounts
- `Partner` - Laundry partner profiles
- `Courier` - Courier profiles
- `Order` - Order transactions
- `Review` - Customer reviews

## 🤝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Orders
- `POST /api/orders/create` - Create new order (with AI)
- `GET /api/orders/user/:userId` - Get user orders

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Push notifications (FCM)
- [ ] Advanced AI chatbot
- [ ] Multi-city expansion
- [ ] Loyalty program
- [ ] Subscription plans
- [ ] Mobile apps (React Native)

## 📈 Scaling Strategy

1. **Database**: PostgreSQL connection pooling, read replicas
2. **Backend**: Horizontal scaling with load balancer
3. **Frontend**: CDN deployment (Vercel/Netlify)
4. **AI**: Rate limiting, caching responses
5. **Real-time**: Redis for Socket.io adapter

## 🐛 Known Issues

- Socket.io rooms perlu mapping partner ID yang lebih robust
- AI estimation perlu training data lebih banyak
- Map marker icons perlu custom styling

## 👨‍💻 Development

### Run Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Deployment Guide

#### 1. Backend Deployment (Railway/Render/Fly.io)
Recommended for hosting the Node.js + Socket.io server.

1. **Connect Repository**
2. **Root Directory**: `backend`
3. **Build Command**: `npm install && npx prisma generate && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `DATABASE_URL`: Connection string from Neon/Postgres
   - `JWT_SECRET`: Random secret string
   - `GEMINI_API_KEY`: Google AI Studio Key
   - `PORT`: `PORT` provided by Railway (or 8080)

#### 2. Frontend Deployment (Vercel)
Recommended for hosting the React SPA.

1. **Connect Repository**: Import the `frontend` folder.
2. **Framework Preset**: Select `Vite`.
3. **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://cuciin-backend.railway.app`)
4. **Deploy**: Vercel will automatically detect `vercel.json` configuration for SPA routing.

#### Database (Neon)
- Use the **Connection Pooling** URL for serverless/cloud environments to manage connections efficiently.

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Credits

- **Google Gemini AI** - AI processing
- **Neon Database** - PostgreSQL hosting
- **OpenStreetMap** - Map tiles
- **Lucide Icons** - Icon library

---

**Built with ❤️ by Senior CTO Team**

Untuk pertanyaan atau support, hubungi: support@cuciin.com
