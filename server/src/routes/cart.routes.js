import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";

import {
  getCart,
  addToCart,
  removeFromCart
} from "../controllers/cart.controller.js";

const router = express.Router();

// All cart routes require authentication
router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:id", protect, removeFromCart);
router.post("/checkout", protect, checkout);

export default router;