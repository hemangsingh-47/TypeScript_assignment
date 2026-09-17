import {
  BillResult,
  CartItem,
  CustomerType,
  Payment,
} from "./types";

import {
  calculateSubtotal,
} from "./cart";

export function calculateDiscount(
  subtotal: number,
  customer: CustomerType
): {
  membershipDiscount: number;
  additionalDiscount: number;
  totalDiscount: number;
} {
  let membershipDiscount = 0;

  if ("membershipLevel" in customer) {
    membershipDiscount =
      subtotal * (customer.discountPercentage / 100);
  }

  const amountAfterMembership =
    subtotal - membershipDiscount;

  let additionalDiscount = 0;

  if (subtotal > 2000) {
    additionalDiscount =
      amountAfterMembership * 0.05;
  }

  const totalDiscount =
    membershipDiscount + additionalDiscount;

  return {
    membershipDiscount,
    additionalDiscount,
    totalDiscount,
  };
}

export function calculateTax(
  amountAfterDiscount: number
): number {
  return amountAfterDiscount * 0.05;
}

export function calculateFinalAmount(
  amountAfterDiscount: number,
  tax: number
): number {
  return amountAfterDiscount + tax;
}

export function generateBill(
  orderId: number,
  customer: CustomerType,
  cart: CartItem[],
  payment: Payment
): BillResult {
  if (cart.length === 0) {
    return {
      status: "error",
      message: "Cannot generate bill for an empty cart.",
    };
  }

  const subtotal = calculateSubtotal(cart);

  const discount = calculateDiscount(
    subtotal,
    customer
  );

  const amountAfterDiscount =
    subtotal - discount.totalDiscount;

  const tax = calculateTax(
    amountAfterDiscount
  );

  const finalAmount = calculateFinalAmount(
    amountAfterDiscount,
    tax
  );

  return {
    status: "success",
    bill: {
      orderId,
      customer,
      cartItems: cart,
      subtotal,
      membershipDiscount:
        discount.membershipDiscount,
      additionalDiscount:
        discount.additionalDiscount,
      totalDiscount:
        discount.totalDiscount,
      amountAfterDiscount,
      tax,
      finalAmount,
      payment,
      orderStatus: "pending",
    },
  };
}