import prisma from "../config/prisma.js";

/*
=====================================
GET USER CART
=====================================
*/
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    return res.status(200).json({
      items: cartItems,
      total
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
=====================================
ADD TO CART
=====================================
*/
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { userId, productId, quantity }
      });
    }

    return res.status(200).json({ message: "Product added to cart" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/*
=====================================
REMOVE FROM CART
=====================================
*/
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = parseInt(req.params.id);

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        userId
      }
    });

    return res.status(200).json({ message: "Item removed from cart" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};