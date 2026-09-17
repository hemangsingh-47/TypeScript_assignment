"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDiscount = calculateDiscount;
exports.calculateTax = calculateTax;
exports.calculateFinalAmount = calculateFinalAmount;
exports.generateBill = generateBill;
const cart_1 = require("./cart");
function calculateDiscount(subtotal, customer) {
    let membershipDiscount = 0;
    if ("membershipLevel" in customer) {
        membershipDiscount =
            subtotal * (customer.discountPercentage / 100);
    }
    const amountAfterMembership = subtotal - membershipDiscount;
    let additionalDiscount = 0;
    if (subtotal > 2000) {
        additionalDiscount =
            amountAfterMembership * 0.05;
    }
    const totalDiscount = membershipDiscount + additionalDiscount;
    return {
        membershipDiscount,
        additionalDiscount,
        totalDiscount,
    };
}
function calculateTax(amountAfterDiscount) {
    return amountAfterDiscount * 0.05;
}
function calculateFinalAmount(amountAfterDiscount, tax) {
    return amountAfterDiscount + tax;
}
function generateBill(orderId, customer, cart, payment) {
    if (cart.length === 0) {
        return {
            status: "error",
            message: "Cannot generate bill for an empty cart.",
        };
    }
    const subtotal = (0, cart_1.calculateSubtotal)(cart);
    const discount = calculateDiscount(subtotal, customer);
    const amountAfterDiscount = subtotal - discount.totalDiscount;
    const tax = calculateTax(amountAfterDiscount);
    const finalAmount = calculateFinalAmount(amountAfterDiscount, tax);
    return {
        status: "success",
        bill: {
            orderId,
            customer,
            cartItems: cart,
            subtotal,
            membershipDiscount: discount.membershipDiscount,
            additionalDiscount: discount.additionalDiscount,
            totalDiscount: discount.totalDiscount,
            amountAfterDiscount,
            tax,
            finalAmount,
            payment,
            orderStatus: "pending",
        },
    };
}
