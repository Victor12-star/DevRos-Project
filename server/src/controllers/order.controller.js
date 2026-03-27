
import { checkoutService } from "../services/order.service.js";
import { getUserOrdersService } from "../services/order.service.js";

/*
=====================================================
CHECKOUT CONTROLLER
=====================================================
Endpoint: POST /api/orders/checkout
*/

export const checkout = async (req, res) => {
try {
    const userId = req.user.id;

    const order = await checkoutService(userId);

    res.status(201).json({
    message: "Order placed successfully",
    order
    });
} catch (error) {
    res.status(400).json({
    message: error.message
    });
}
};



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