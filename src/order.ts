import { OrderStatus } from "./types";


// ========================================
// EXHAUSTIVE CHECKING
// ========================================

function assertNever(
  value: never
): never {
  throw new Error(
    `Unhandled order status: ${value}`
  );
}


// ========================================
// GET ORDER STATUS MESSAGE
// ========================================

export function getOrderStatusMessage(
  status: OrderStatus
): string {

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

export function canChangeOrderStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {

  switch (currentStatus) {

    // Pending → Confirmed / Cancelled
    case "pending":
      return (
        newStatus === "confirmed" ||
        newStatus === "cancelled"
      );


    // Confirmed → Preparing / Cancelled
    case "confirmed":
      return (
        newStatus === "preparing" ||
        newStatus === "cancelled"
      );


    // Preparing → Delivered / Cancelled
    case "preparing":
      return (
        newStatus === "delivered" ||
        newStatus === "cancelled"
      );


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

export function updateOrderStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): OrderStatus {

  if (
    !canChangeOrderStatus(
      currentStatus,
      newStatus
    )
  ) {
    return currentStatus;
  }

  return newStatus;
}
