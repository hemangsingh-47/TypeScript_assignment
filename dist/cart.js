"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.updateQuantity = updateQuantity;
exports.calculateItemTotal = calculateItemTotal;
exports.calculateSubtotal = calculateSubtotal;
function addToCart(cart, foodItem, quantity, specialInstruction) {
    const existingItem = cart.find((item) => item.id === foodItem.id);
    if (existingItem) {
        existingItem.quantity += quantity;
        if (specialInstruction) {
            existingItem.specialInstruction = specialInstruction;
        }
        return cart;
    }
    const newCartItem = {
        ...foodItem,
        quantity,
        specialInstruction,
    };
    return [...cart, newCartItem];
}
function removeFromCart(cart, foodItemId) {
    return cart.filter((item) => item.id !== foodItemId);
}
function updateQuantity(cart, foodItemId, quantity) {
    const itemIndex = cart.findIndex((item) => item.id === foodItemId);
    if (itemIndex === -1) {
        return cart;
    }
    if (quantity <= 0) {
        return removeFromCart(cart, foodItemId);
    }
    const updatedCart = [...cart];
    updatedCart[itemIndex] = {
        ...updatedCart[itemIndex],
        quantity,
    };
    return updatedCart;
}
function calculateItemTotal(item) {
    return item.price * item.quantity;
}
function calculateSubtotal(cart) {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
}
