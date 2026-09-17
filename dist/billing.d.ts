import { BillingAddress, Invoice } from './types';
export declare function getBillingAddress(): BillingAddress;
export declare function generateInvoice(customerId: string, customerName: string, totalAmount: number, status?: Invoice['status']): Invoice;
