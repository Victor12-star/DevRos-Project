
import express from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { getCart } from "../controllers/cart.controller.js";

/*
=====================================================
CART ROUTES
=====================================================

This file defines HTTP endpoints related to cart.

All cart operations must require authentication
because a cart belongs to a logged in user.
*/

const router = express.Router();

/*
POST /api/cart

Purpose:
Add a product to the authenticated user's cart.

Middleware flow:
1. authenticate → verifies JWT and sets req.user
2. addToCart → handles business logic
*/

router.post("/", authenticate, addToCart);


router.get("/", authenticate, getCart);

export default router;