
import prisma from "../config/prisma.js";

export const addToCartService = async (userId, productId, quantity) => {
  // 1. Ensure quantity is valid
if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
}

  // 2. Find or create cart for this user
    let cart = await prisma.cart.findUnique({
    where: { userId }
});

if (!cart) {
    cart = await prisma.cart.create({
    data: { userId }
    });
}

  // 3. Check if product already exists in cart
const existingItem = await prisma.cartItem.findUnique({
    where: {
    cartId_productId: {
        cartId: cart.id,
        productId
    }
    }
});

  // 4. If exists → increase quantity
if (existingItem) {
    return await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: {
        quantity: existingItem.quantity + quantity
    }
    });
}

  // 5. If not → create new cart item
    return await prisma.cartItem.create({
    data: {
    cartId: cart.id,
    productId,
    quantity
    }
});
};

export const getCartService = async (userId) => {

  // 1. Find cart for user and include products
const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
    items: {
        include: {
        product: true
        }
    }
    }
});

  // 2. If user has no cart yet
if (!cart) {
    return {
    items: [],
    total: 0
    };
}

  // 3. Format cart response
const formattedItems = cart.items.map(item => {
    const subtotal = item.quantity * item.product.price;

    return {
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    subtotal
    };
});

  // 4. Calculate total
const total = formattedItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
    items: formattedItems,
    total
};
};