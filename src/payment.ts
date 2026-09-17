import {
  CashPayment,
  CardPayment,
  UpiPayment,
  Payment,
} from "./types";

export function createCashPayment(
  receivedAmount: number
): CashPayment {
  return {
    method: "cash",
    receivedAmount,
  };
}

export function createCardPayment(
  last4Digits: string
): CardPayment {
  return {
    method: "card",
    last4Digits,
  };
}

export function createUpiPayment(
  transactionId: string
): UpiPayment {
  return {
    method: "upi",
    transactionId,
  };
}

export function processPayment(
  payment: Payment,
  amount: number
): string {
  if (payment.method === "cash") {
    if (payment.receivedAmount < amount) {
      return "Insufficient cash received.";
    }

    const change =
      payment.receivedAmount - amount;

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

function assertNever(value: never): never {
  throw new Error(`Unhandled payment method: ${value}`);
}