import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

// READ all products
router.get("/", getProducts);

// CREATE product
router.post("/", createProduct);

// UPDATE product by id
router.put("/:id", updateProduct);

// DELETE product by id
router.delete("/:id", deleteProduct);

export default router;