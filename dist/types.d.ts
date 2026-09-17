export type CustomerStatus = 'active' | 'inactive' | 'vip';
export interface Customer {
    id: string;
    name: string;
    email: string;
    status: CustomerStatus;
}
export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}
export interface BillingAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export interface PaymentDetails {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    amount: number;
}
export interface Invoice {
    invoiceId: string;
    customerId: string;
    customerName: string;
    totalAmount: number;
    status: 'paid' | 'pending';
}
export interface Order {
    orderId: string;
    customerId: string;
    items: CartItem[];
    totalAmount: number;
    status: 'created' | 'paid' | 'shipped';
}
