"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatusMessage = getOrderStatusMessage;
exports.canChangeOrderStatus = canChangeOrderStatus;
exports.updateOrderStatus = updateOrderStatus;
// ========================================
// EXHAUSTIVE CHECKING
// ========================================
function assertNever(value) {
    throw new Error(`Unhandled order status: ${value}`);
}
// ========================================
// GET ORDER STATUS MESSAGE
// ========================================
function getOrderStatusMessage(status) {
    switch (status) {
        case "pending":
            return "Order is waiting for confirmation.";
        case "confirmed":
            return "Order has been confirmed.";
        case "preparing":
            return "Food is being prepared.";
        case "delivered":
            return "Order has been delivered.";
        case "cancelled":
            return "Order has been cancelled.";
        default:
            return assertNever(status);
    }
}
// ========================================
// CHECK WHETHER STATUS CAN CHANGE
// ========================================
function canChangeOrderStatus(currentStatus, newStatus) {
    switch (currentStatus) {
        // Pending → Confirmed / Cancelled
        case "pending":
            return (newStatus === "confirmed" ||
                newStatus === "cancelled");
        // Confirmed → Preparing / Cancelled
        case "confirmed":
            return (newStatus === "preparing" ||
                newStatus === "cancelled");
        // Preparing → Delivered / Cancelled
        case "preparing":
            return (newStatus === "delivered" ||
                newStatus === "cancelled");
        // Delivered → No further change
        case "delivered":
            return false;
        // Cancelled → No further change
        case "cancelled":
            return false;
        default:
            return assertNever(currentStatus);
    }
}
// ========================================
// UPDATE ORDER STATUS
// ========================================
function updateOrderStatus(currentStatus, newStatus) {
    if (!canChangeOrderStatus(currentStatus, newStatus)) {
        return currentStatus;
    }
    return newStatus;
}
