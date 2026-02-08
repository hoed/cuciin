import { Request, Response } from "express";
import prisma from "../prisma";
import { estimateOrder } from "../services/aiService";
import { findOptimalPartner } from "../services/matchingService";
import { io } from "../index";

export const createOrder = async (req: Request, res: Response) => {
    const { customerId, items, isExpress, pickupAddr, deliveryAddr, lat, lng } = req.body;

    try {
        // 1. AI Estimation
        const estimation = await estimateOrder(items, isExpress);
        if (!estimation) {
            return res.status(500).json({ error: "AI Estimation failed" });
        }

        // 2. AI Matching
        const optimalPartner = await findOptimalPartner(lat, lng);
        if (!optimalPartner) {
            return res.status(404).json({ error: "No available laundry partners in your area" });
        }

        // 3. Create Order in DB
        const orderCount = await prisma.order.count();
        const orderNumber = `ORD-${(orderCount + 1).toString().padStart(4, '0')}`;

        const order = await prisma.order.create({
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
        io.to(`partner_${optimalPartner.userId}`).emit("new_order", {
            message: "Anda mendapatkan order baru!",
            order
        });

        io.to("admin_room").emit("admin_notification", {
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

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.query;

    try {
        let orders;
        if (role === 'CUSTOMER') {
            orders = await prisma.order.findMany({
                where: { customerId: userId },
                include: { partner: true, courier: true },
                orderBy: { createdAt: 'desc' }
            });
        } else if (role === 'PARTNER') {
            const partner = await prisma.partner.findUnique({ where: { userId } });
            orders = await prisma.order.findMany({
                where: { partnerId: partner?.id },
                include: { customer: true, courier: true },
                orderBy: { createdAt: 'desc' }
            });
        } else if (role === 'COURIER') {
            // For couriers, showing assigned orders or available for pickup/delivery
            orders = await prisma.order.findMany({
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
        } else {
            // Admin gets all
            orders = await prisma.order.findMany({
                include: { customer: true, partner: true, courier: true },
                orderBy: { createdAt: 'desc' }
            });
        }

        res.json(orders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status, courierId } = req.body;

    try {
        const order = await prisma.order.update({
            where: { orderNumber: orderId },
            data: {
                status,
                ...(courierId && { courierId }) // Assign courier if provided
            },
            include: { customer: true, partner: true }
        });

        // Notify Customer
        io.to(`customer_${order.customerId}`).emit("order_update", {
            message: `Status order Anda: ${status}`,
            order
        });

        if (order.partner?.userId) {
            io.to(`partner_${order.partner.userId}`).emit("order_update", {
                message: `Status order ${order.orderNumber} diupdate menjadi ${status}`,
                order
            });
        }

        // Notify Courier if assigned
        if (order.courierId) {
            io.to(`courier_${order.courierId}`).emit("order_update", {
                message: `Tugas baru update: ${status}`,
                order
            });
        }

        res.json({ message: "Status updated", order });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
};
