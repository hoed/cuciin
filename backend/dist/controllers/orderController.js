"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getMyOrders = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const aiService_1 = require("../services/aiService");
const matchingService_1 = require("../services/matchingService");
const index_1 = require("../index");
const createOrder = async (req, res) => {
    const { items, isExpress, pickupAddr, deliveryAddr, lat, lng } = req.body;
    const customerId = req.user?.userId;
    if (!customerId)
        return res.status(401).json({ error: "Unauthorized" });
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
        index_1.io.to(`partner_${optimalPartner.userId}`).emit("new_order", {
            message: "Anda mendapatkan order baru!",
            order
        });
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
    const userId = req.user?.userId;
    const role = req.user?.role;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        let orders;
        if (role === 'CUSTOMER') {
            orders = await prisma_1.default.order.findMany({
                where: { customerId: userId },
                include: { partner: true, courier: true },
                orderBy: { createdAt: 'desc' }
            });
        }
        else if (role === 'PARTNER') {
            const partner = await prisma_1.default.partner.findUnique({ where: { userId } });
            orders = await prisma_1.default.order.findMany({
                where: { partnerId: partner?.id },
                include: { customer: true, courier: true },
                orderBy: { createdAt: 'desc' }
            });
        }
        else if (role === 'COURIER') {
            // For couriers, showing assigned orders or available for pickup/delivery
            orders = await prisma_1.default.order.findMany({
                where: {
                    OR: [
                        { courierId: userId },
                        { status: 'PENDING' }, // Available for pickup
                        { status: 'READY_FOR_DELIVERY' } // Available for delivery
                    ]
                },
                include: { customer: true, partner: true },
                orderBy: { createdAt: 'desc' }
            });
        }
        else {
            // Admin gets all
            orders = await prisma_1.default.order.findMany({
                include: { customer: true, partner: true, courier: true },
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
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status, courierId } = req.body;
    const requesterId = req.user?.userId;
    const requesterRole = req.user?.role;
    try {
        // Fetch current order to check permissions
        const currentOrder = await prisma_1.default.order.findUnique({
            where: { orderNumber: orderId }
        });
        if (!currentOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        // Security Check: prevent couriers from changing courierId field to someone else
        // or changing it if they are already assigned, unless they are admin.
        if (requesterRole === 'COURIER') {
            if (courierId && courierId !== requesterId) {
                return res.status(403).json({ error: "You can only assign yourself as a courier." });
            }
            // If the order already has a courier and it's not the requester, prevent update
            if (currentOrder.courierId && currentOrder.courierId !== requesterId) {
                return res.status(403).json({ error: "This order is already assigned to another courier." });
            }
        }
        const order = await prisma_1.default.order.update({
            where: { orderNumber: orderId },
            data: {
                status,
                ...(courierId && { courierId }) // Assign courier if provided (and passed checks above)
            },
            include: { customer: true, partner: true }
        });
        // Notify Customer
        index_1.io.to(`customer_${order.customerId}`).emit("order_update", {
            message: `Status order Anda: ${status}`,
            order
        });
        if (order.partner?.userId) {
            index_1.io.to(`partner_${order.partner.userId}`).emit("order_update", {
                message: `Status order ${order.orderNumber} diupdate menjadi ${status}`,
                order
            });
        }
        // Notify Courier if assigned
        if (order.courierId) {
            index_1.io.to(`courier_${order.courierId}`).emit("order_update", {
                message: `Tugas baru update: ${status}`,
                order
            });
        }
        res.json({ message: "Status updated", order });
    }
    catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
};
exports.updateOrderStatus = updateOrderStatus;
