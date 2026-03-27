import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

/*
=====================================================
SECURITY MIDDLEWARE
=====================================================
helmet → sets secure HTTP headers
cors → allows frontend to communicate with backend
cookieParser → allows reading cookies from requests
*/
app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true               // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

/*
=====================================================
HEALTH CHECK ROUTE
=====================================================
Used to verify server is running
*/
app.get("/", (req, res) => {
  res.json({ message: "DevRos API running" });
});

/*
=====================================================
ROUTES
=====================================================
*/
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);


app.use("/api/cart", cartRoutes);

export default app;