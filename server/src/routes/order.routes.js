
import express from "express";
import { checkout } from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { getUserOrders } from "../controllers/order.controller.js";
import { getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

/*
POST /api/orders/checkout
Creates a new order from the user's cart.
*/
router.post("/checkout", authenticate, checkout);

router.get("/", authenticate, getUserOrders);

router.get("/:id", authenticate, getOrderById);

export default router;