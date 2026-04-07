import prisma from "../config/prisma.js";

/*
=====================================
GET USER CART
=====================================
*/
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart first
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    return res.status(200).json({
      items: cart.items,
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

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Find user cart
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
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

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    return res.status(200).json({ message: "Item removed from cart" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};