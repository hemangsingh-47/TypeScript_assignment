"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCashPayment = createCashPayment;
exports.createCardPayment = createCardPayment;
exports.createUpiPayment = createUpiPayment;
exports.processPayment = processPayment;
function createCashPayment(receivedAmount) {
    return {
        method: "cash",
        receivedAmount,
    };
}
function createCardPayment(last4Digits) {
    return {
        method: "card",
        last4Digits,
    };
}
function createUpiPayment(transactionId) {
    return {
        method: "upi",
        transactionId,
    };
}
function processPayment(payment, amount) {
    if (payment.method === "cash") {
        if (payment.receivedAmount < amount) {
            return "Insufficient cash received.";
        }
        const change = payment.receivedAmount - amount;
        return `Cash payment successful. Change: ₹${change.toFixed(2)}`;
    }
    if (payment.method === "card") {
        return `Card payment successful. Card ending in ${payment.last4Digits}`;
    }
    if (payment.method === "upi") {
        return `UPI payment successful. Transaction ID: ${payment.transactionId}`;
    }
    return assertNever(payment);
}
function assertNever(value) {
    throw new Error(`Unhandled payment method: ${value}`);
}
