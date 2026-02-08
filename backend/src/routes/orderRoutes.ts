import { Router } from "express";
import { createOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController";

const router = Router();

router.post("/create", createOrder);
router.get("/user/:userId", getMyOrders);
router.put("/:orderId/status", updateOrderStatus);

export default router;
