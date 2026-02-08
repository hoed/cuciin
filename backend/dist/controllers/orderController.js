"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const aiService_1 = require("../services/aiService");
const matchingService_1 = require("../services/matchingService");
const index_1 = require("../index");
const createOrder = async (req, res) => {
    const { customerId, items, isExpress, pickupAddr, deliveryAddr, lat, lng } = req.body;
    try {
        // 1. AI Estimation
        const estimation = await (0, aiService_1.estimateOrder)(items, isExpress);
        if (!estimation) {
            return res.status(500).json({ error: "AI Estimation failed" });
        }
        // 2. AI Matching
        const optimalPartner = await (0, matchingService_1.findOptimalPartner)(lat, lng);
        if (!optimalPartner) {
            return res.status(404).json({ error: "No available laundry partners in your area" });
        }
        // 3. Create Order in DB
        const orderCount = await prisma_1.default.order.count();
        const orderNumber = `ORD-${(orderCount + 1).toString().padStart(4, '0')}`;
        const order = await prisma_1.default.order.create({
            data: {
                orderNumber,
                customerId,
                partnerId: optimalPartner.id,
                items,
                totalPrice: estimation.total_price,
                estimatedTime: estimation.estimated_time_minutes,
                pickupAddr,
                deliveryAddr,
                lat,
                lng,
                status: "PENDING"
            },
            include: {
                partner: true,
                customer: true
            }
        });
        // 4. Real-time Notification
        // Notify the specific partner
        index_1.io.to(`partner_${optimalPartner.id}`).emit("new_order", {
            message: "Anda mendapatkan order baru!",
            order
        });
        // Notify all admins
        index_1.io.to("admin_room").emit("admin_notification", {
            type: "NEW_ORDER",
            message: `Order baru ${orderNumber} telah dibuat.`,
            order
        });
        res.status(201).json({
            message: "Order created successfully",
            order,
            ai_explanation: estimation.explanation,
            confidence_score: estimation.confidence_score
        });
    }
    catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.query;
    try {
        let orders;
        if (role === 'CUSTOMER') {
            orders = await prisma_1.default.order.findMany({
                where: { customerId: userId },
                include: { partner: true },
                orderBy: { createdAt: 'desc' }
            });
        }
        else if (role === 'PARTNER') {
            const partner = await prisma_1.default.partner.findUnique({ where: { userId } });
            orders = await prisma_1.default.order.findMany({
                where: { partnerId: partner?.id },
                include: { customer: true },
                orderBy: { createdAt: 'desc' }
            });
        }
        else {
            orders = await prisma_1.default.order.findMany({
                include: { customer: true, partner: true },
                orderBy: { createdAt: 'desc' }
            });
        }
        res.json(orders);
    }
    catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};
exports.getMyOrders = getMyOrders;
