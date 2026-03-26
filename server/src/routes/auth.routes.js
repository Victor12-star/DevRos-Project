import express from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Refresh access token
router.post("/refresh", refresh);

// Logout user
router.post("/logout", logout);

export default router;