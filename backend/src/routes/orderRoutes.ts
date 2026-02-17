import { Router } from "express";
import { createOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticate);

router.post("/create", createOrder);
router.get("/user/:userId", getMyOrders);
router.put("/:orderId/status", updateOrderStatus);

export default router;
