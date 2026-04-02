
import { checkoutService } from "../services/order.service.js";
import { getUserOrdersService } from "../services/order.service.js";
import { getMyOrdersService } from "../services/order.service.js";
import { getOrderByIdService } from "../services/order.service.js";
import { updateOrderStatusService } from "../services/order.service.js";

/*
=====================================================
CHECKOUT CONTROLLER
=====================================================
Endpoint: POST /api/orders/checkout
*/

export const checkout = async (req, res) => {
try {
    const userId = req.user.id;
    const idempotencyKey = req.headers["idempotency-key"];

    if (!idempotencyKey) {
        return res.status(400).json({ message: "Missing Idempotency-Key header" });
    }

    // STEP 1: Check if order already exists
    const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: true }
    });

    if (existingOrder) {
        return res.status(200).json(existingOrder);
    }

    // STEP 2: Get cart items
    const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
    });

    if (!cartItems.length) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    // STEP 3: Calculate total
    let total = 0;
    for (const item of cartItems) {
      total += item.product.price * item.quantity;
    }

    // STEP 4: Create order
    const order = await prisma.order.create({
    data: {
        userId,
        total,
        status: "PENDING",
        idempotencyKey,
        items: {
        create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
        }))
        }
    },
    include: { items: true }
    });

    // STEP 5: Reduce stock
    for (const item of cartItems) {
    await prisma.product.update({
        where: { id: item.productId },
        data: {
        stock: {
            decrement: item.quantity
        }
        }
    });
    }

    // STEP 6: Clear cart
    await prisma.cartItem.deleteMany({
    where: { userId }
    });

    return res.status(200).json(order);

} catch (error) {
    return res.status(500).json({ message: error.message });
}
};

    // Continue checkout logic...


/*
=====================================================
GET USER ORDERS CONTROLLER
=====================================================
Endpoint: GET /api/orders
*/

export const getUserOrders = async (req, res) => {
try {
    const userId = req.user.id;

    const orders = await getUserOrdersService(userId);

    res.status(200).json({
    orders
    });

} catch (error) {
    res.status(400).json({
    message: error.message
    });
}
};



/*
=====================================================
GET ORDER BY ID CONTROLLER
=====================================================
Endpoint: GET /api/orders/:id
*/

export const getOrderById = async (req, res) => {
try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await getOrderByIdService(userId, orderId);

    res.status(200).json({
    order
    });

} catch (error) {
    res.status(404).json({
    message: error.message
    });
}
};


/*
=====================================================
UPDATE ORDER STATUS CONTROLLER
=====================================================
Endpoint: PATCH /api/orders/:id/status
Admin only.
*/

export const updateOrderStatus = async (req, res) => {
try {

    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
        message: "Status is required"
    });
    }

    const updatedOrder = await updateOrderStatusService(orderId, status);

    res.status(200).json({
    message: "Order status updated successfully",
    order: updatedOrder
    });

} catch (error) {
    res.status(400).json({
    message: error.message
    });
}
};





export const getMyOrders = async (req, res) => {
try {
    const userId = req.user.id;

    const orders = await getMyOrdersService(userId);

    res.status(200).json({ orders });

} catch (error) {
    res.status(500).json({
    message: error.message
    });
}
};