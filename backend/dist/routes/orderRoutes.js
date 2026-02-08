"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
router.post("/create", orderController_1.createOrder);
router.get("/user/:userId", orderController_1.getMyOrders);
exports.default = router;
