
import express from "express";
import { checkout } from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
POST /api/orders/checkout
Creates a new order from the user's cart.
*/
router.post("/checkout", authenticate, checkout);

export default router;