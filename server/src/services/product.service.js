import prisma from "../config/prisma.js";

export const getAllProducts = async () => {
return await prisma.product.findMany({
    include: {
    category: true,
    },
});
};

export const createProduct = async (data) => {
const { name, description, price, stock, categoryName } = data;

  // Find or create category
let category = await prisma.category.findUnique({
    where: { name: categoryName },
});

if (!category) {
    category = await prisma.category.create({
    data: { name: categoryName },
    });
}

  // Create product
return await prisma.product.create({
    data: {
    name,
    description,
    price,
    stock,
    categoryId: category.id,
    },
});
};