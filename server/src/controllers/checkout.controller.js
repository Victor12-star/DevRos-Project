import prisma from "../config/prisma.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {

      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      let total = 0;

      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(
            `Not enough stock for product ${item.product.name}`
          );
        }

        total += item.quantity * item.product.price;
      }

      const order = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        }
      });

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

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return order;
    });

    return res.status(200).json({
      message: "Checkout successful",
      order: result
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};