import prisma from "../config/prisma.js";

/*
=====================================================
CHECKOUT SERVICE
=====================================================
Purpose:
Converts the authenticated user's cart into an order.

Flow:
1. Retrieve the user's cart with products
2. Validate cart is not empty
3. Validate stock and calculate total
4. Create order inside a transaction
5. Reduce stock
6. Clear cart
*/

export const checkoutService = async (userId) => {

  // 1️⃣ Retrieve user's cart including product details
  const cart = await prisma.cart.findUnique({
    where: { userId: Number(userId) },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  // Validate cart existence
  if (!cart) {
    throw new Error("Cart not found");
  }

  // Validate cart not empty
  if (!cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let total = 0;

  // 2️⃣ Validate stock and prepare order items
  const orderItemsData = cart.items.map((item) => {

    // Check stock availability
    if (item.product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${item.product.name}`
      );
    }

    const subtotal = item.product.price * item.quantity;

    total += subtotal;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price
    };
  });

  // 3️⃣ Execute atomic transaction
  const order = await prisma.$transaction(async (tx) => {

    // Create order with items
    const newOrder = await tx.order.create({
      data: {
        userId: Number(userId),
        total: Number(total),
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // 4️⃣ Reduce product stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // 5️⃣ Clear cart items
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return newOrder;
  });

  return order;
};

/*
=====================================================
GET USER ORDERS SERVICE
=====================================================
Returns all orders belonging to the authenticated user.
*/

export const getUserOrdersService = async (userId) => {
  const orders = await prisma.order.findMany({
    where: {
      userId: Number(userId)
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return orders;
};