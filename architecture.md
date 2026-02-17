# Cuciin Platform - Architecture & Design Document

## 1. System Architecture
- **Frontend**: React.js with Vite for fast HMR and optimized builds.
- **Backend**: Node.js with TypeScript and Express.
- **Database**: PostgreSQL hosted on Neon.
- **ORM**: Prisma for type-safe database access.
- **Real-time**: Socket.io for order tracking and notifications.
- **AI Engine**: Google Gemini Pro via Generative AI SDK, integrated into various modules:
    - **Customer Service**: AI-driven chatbot for user inquiries.
    - **Estimation Engine**: Calculating price and time based on laundry load and partner capacity.
    - **Order Matching**: Heuristic + AI model to assign orders to the best partner.
- **Maps**: Leaflet for map integration and proximity calculations.

## 2. Database Schema (Draft)
- `users`: id, name, email, password, phone, role (customer, partner, courier, admin), location (lat/lng/address)
- `partners`: id, userId, name, address, location, services, ratings, operationalHours, capacity, currentLoad
- `orders`: id, customerId, partnerId, courierId, status (pending, pickup, washing, drying, ironing, delivery, completed), items (json), total_price, estimated_time, pickup_location, delivery_location
- `order_tracking`: id, orderId, status, timestamp, courierId
- `reviews`: id, orderId, rating, comment, role (customer_to_partner, customer_to_courier)
- `ai_logs`: id, orderId, prompt, response, module (estimation, matching, cs)

## 3. AI Module Logic
### AI Estimation Engine
- **Input**: Items list, Express/Regular, Current partner load.
- **Logic**: Base time + Load weight + Service multiplier. Gemini validates if the estimation makes sense based on historical data.

### AI Order Matching
- **Criteria**: Distance < 5km, Rating > 4.0, Low Load, Reliability score.

## 4. UI/UX Concept
- **Theme**: Futuristic Dark/Glassmorphism with vibrant accents (#D2F235 - Neon Green-Yellow, #6366F1 - Indigo).
- **Responsiveness**: Mobile-first for users/couriers, Desktop-optimized for partners/admin.
