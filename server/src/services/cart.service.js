
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

/*
=====================================================
UPDATE CART ITEM QUANTITY SERVICE
=====================================================

Purpose:
Updates the quantity of a specific product in the
authenticated user's cart.

Flow:
1. Find the user's cart
2. Verify the product exists in the cart
3. Update the quantity
4. Return the updated cart item
*/

export const updateCartItemService = async (userId, productId, quantity) => {
  // Validate quantity
if (!quantity || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
}

  // 1. Find the user's cart
const cart = await prisma.cart.findUnique({
    where: { userId }
});

if (!cart) {
    throw new Error("Cart not found");
}

  // 2. Check if the product exists in the cart
const cartItem = await prisma.cartItem.findUnique({
    where: {
    cartId_productId: {
        cartId: cart.id,
        productId
    }
    }
});

if (!cartItem) {
    throw new Error("Product not found in cart");
}

  // 3. Update the quantity
const updatedItem = await prisma.cartItem.update({
    where: {
    cartId_productId: {
        cartId: cart.id,
        productId
    }
    },
    data: {
    quantity
    },
    include: {
    product: true
    }
});

  // 4. Return formatted response
    return {
    productId: updatedItem.product.id,
    name: updatedItem.product.name,
    price: updatedItem.product.price,
    quantity: updatedItem.quantity,
    subtotal: updatedItem.product.price * updatedItem.quantity
};
};

/*
=====================================================
REMOVE CART ITEM SERVICE
=====================================================

Purpose:
Removes a specific product from the authenticated
user's cart.

Flow:
1. Find the user's cart
2. Check if the product exists in the cart
3. Delete the cart item
4. Return a success message
*/

export const removeCartItemService = async (userId, productId) => {
  // 1. Find the user's cart
const cart = await prisma.cart.findUnique({
    where: { userId }
});

if (!cart) {
    throw new Error("Cart not found");
}

  // 2. Check if the product exists in the cart
const cartItem = await prisma.cartItem.findUnique({
    where: {
    cartId_productId: {
        cartId: cart.id,
        productId
    }
    }
});

if (!cartItem) {
    throw new Error("Product not found in cart");
}

  // 3. Delete the cart item
await prisma.cartItem.delete({
    where: {
    cartId_productId: {
        cartId: cart.id,
        productId
    }
    }
});

  // 4. Return success response
    return {
    message: "Item removed from cart successfully"
};
};