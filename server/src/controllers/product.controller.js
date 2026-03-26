import prisma from "../config/prisma.js";
import { z } from "zod";

// Validation schema
const productSchema = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    description: z.string().min(1),
    categoryName: z.string().min(1)
});

// GET all products
export const getProducts = async (req, res) => {
try {
    const products = await prisma.product.findMany({
    include: { category: true }
    });

    res.json(products);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

// CREATE product
export const createProduct = async (req, res) => {
try {
    const validatedData = productSchema.parse(req.body);

    const product = await prisma.product.create({
    data: {
        name: validatedData.name,
        price: validatedData.price,
        stock: validatedData.stock,
        description: validatedData.description,
        category: {
        connectOrCreate: {
            where: { name: validatedData.categoryName },
            create: { name: validatedData.categoryName }
        }
        }
    },
    include: { category: true }
    });

    res.status(201).json(product);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

// UPDATE product
export const updateProduct = async (req, res) => {
try {
    const { id } = req.params;

    const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: req.body,
    include: { category: true }
    });

    res.json(updated);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

// DELETE product
export const deleteProduct = async (req, res) => {
try {
    const { id } = req.params;

    await prisma.product.delete({
    where: { id: Number(id) }
    });

    res.json({ message: "Product deleted successfully" });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};