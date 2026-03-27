
import { addToCartService } from "../services/cart.service.js";
import { getCartService } from "../services/cart.service.js";

/*
=====================================================
ADD TO CART CONTROLLER
=====================================================

Purpose:
This controller handles the HTTP request for adding
a product to the authenticated user's cart.

Flow:
1. Get userId from authentication middleware
2. Extract productId and quantity from request body
3. Validate input
4. Call service layer (business logic)
5. Return response to client
*/

export const addToCart = async (req, res) => {
try {
    // 1. Get authenticated user's ID
    // This must be set by your JWT auth middleware
    const userId = req.user.id;

    // 2. Extract productId and quantity from frontend request
    const { productId, quantity } = req.body;

    /*
    3. Basic validation
    - productId must exist
    - quantity must exist
    - quantity must be greater than 0
    */
    if (!productId || !quantity) {
        return res.status(400).json({
        message: "Product ID and quantity are required"
    });
    }

    if (Number(quantity) <= 0) {
        return res.status(400).json({
        message: "Quantity must be greater than 0"
    });
    }

    /*
    4. Call service layer
    Service handles:
    - Finding or creating cart
    - Checking existing cart item
    - Updating or creating cart item
    */
    const cartItem = await addToCartService(
    userId,
    Number(productId),
    Number(quantity)
    );

    /*
    5. Send success response
    We return updated/created cart item
    */
    return res.status(200).json({
    message: "Product added to cart successfully",
    cartItem
    });

} catch (error) {
    /*
    If anything fails (validation error or DB error),
    we send a 400 response with error message
    */
    return res.status(400).json({
    message: error.message
    });
}
};


export const getCart = async (req, res) => {
try {
    const userId = req.user.id;

    const cart = await getCartService(userId);

    return res.status(200).json(cart);

} catch (error) {
    return res.status(500).json({
    message: error.message
    });
}
};