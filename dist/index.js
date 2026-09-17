"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const data_1 = require("./data");
const customer_1 = require("./customer");
const cart_1 = require("./cart");
const payment_1 = require("./payment");
const billing_1 = require("./billing");
const order_1 = require("./order");
// ========================================
// READLINE
// ========================================
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
// ========================================
// QUESTION FUNCTION
// ========================================
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}
// ========================================
// APPLICATION DATA
// ========================================
let currentCustomer;
let cart = [];
let orderStatus = "pending";
let orderId = 1001;
// ========================================
// FOOD MENU
// ========================================
function displayFoodMenu() {
    console.log("\n==============================");
    console.log("          FOOD MENU");
    console.log("==============================");
    data_1.foodItems.forEach((item) => {
        console.log(`${item.id}. ${item.name} - ₹${item.price} - ${item.category}`);
    });
    console.log("==============================");
}
// ========================================
// CREATE CUSTOMER
// ========================================
async function createCustomer() {
    const name = await askQuestion("Enter customer name: ");
    const type = (await askQuestion("Enter customer type (guest/member): ")).toLowerCase();
    const city = await askQuestion("Enter city: ");
    const state = await askQuestion("Enter state: ");
    const pincode = await askQuestion("Enter pincode: ");
    const phone = await askQuestion("Enter phone (optional): ");
    const address = {
        city,
        state,
        pincode,
    };
    // MEMBER
    if (type === "member") {
        const levelInput = (await askQuestion("Membership level (silver/gold/platinum): ")).toLowerCase();
        let discount = 0;
        if (levelInput === "silver") {
            discount = 5;
        }
        else if (levelInput === "gold") {
            discount = 10;
        }
        else if (levelInput === "platinum") {
            discount = 15;
        }
        else {
            console.log("Invalid membership level.");
            return;
        }
        const membershipId = await askQuestion("Enter membership ID: ");
        currentCustomer = (0, customer_1.createMember)(1, name, address, levelInput, discount, membershipId, phone || undefined);
        // GUEST
    }
    else if (type === "guest") {
        currentCustomer = (0, customer_1.createGuest)(1, name, address, phone || undefined);
    }
    else {
        console.log("Invalid customer type.");
        return;
    }
    console.log("\nCustomer created successfully!");
}
// ========================================
// ADD ITEM TO CART
// ========================================
async function handleAddToCart() {
    if (!currentCustomer) {
        console.log("Please create customer first.");
        return;
    }
    displayFoodMenu();
    const id = Number(await askQuestion("Enter food item ID: "));
    const quantity = Number(await askQuestion("Enter quantity: "));
    const foodItem = data_1.foodItems.find((item) => item.id === id);
    if (!foodItem) {
        console.log("Food item not found.");
        return;
    }
    if (!foodItem.isAvailable) {
        console.log("Food item is unavailable.");
        return;
    }
    if (!Number.isInteger(quantity) ||
        quantity <= 0) {
        console.log("Invalid quantity.");
        return;
    }
    const instruction = await askQuestion("Special instruction (optional): ");
    cart = (0, cart_1.addToCart)(cart, foodItem, quantity, instruction || undefined);
    console.log("Item added to cart successfully!");
}
// ========================================
// DISPLAY CART
// ========================================
function displayCart() {
    if (cart.length === 0) {
        console.log("\nCart is empty.");
        return;
    }
    console.log("\n==============================");
    console.log("            CART");
    console.log("==============================");
    cart.forEach((item) => {
        const total = item.price * item.quantity;
        console.log(`${item.name} x ${item.quantity} = ₹${total}`);
        if (item.specialInstruction) {
            console.log(`Instruction: ${item.specialInstruction}`);
        }
    });
    const subtotal = (0, cart_1.calculateSubtotal)(cart);
    console.log("------------------------------");
    console.log(`Subtotal: ₹${subtotal.toFixed(2)}`);
    console.log("==============================");
}
// ========================================
// UPDATE QUANTITY
// ========================================
async function handleUpdateQuantity() {
    if (cart.length === 0) {
        console.log("Cart is empty.");
        return;
    }
    displayCart();
    const id = Number(await askQuestion("Enter food item ID: "));
    const quantity = Number(await askQuestion("Enter new quantity: "));
    if (!Number.isInteger(quantity) ||
        quantity < 0) {
        console.log("Invalid quantity.");
        return;
    }
    const exists = cart.some((item) => item.id === id);
    if (!exists) {
        console.log("Item not found in cart.");
        return;
    }
    cart = (0, cart_1.updateQuantity)(cart, id, quantity);
    console.log("Quantity updated successfully!");
}
// ========================================
// REMOVE ITEM
// ========================================
async function handleRemoveItem() {
    if (cart.length === 0) {
        console.log("Cart is empty.");
        return;
    }
    displayCart();
    const id = Number(await askQuestion("Enter food item ID to remove: "));
    const exists = cart.some((item) => item.id === id);
    if (!exists) {
        console.log("Item not found in cart.");
        return;
    }
    cart = (0, cart_1.removeFromCart)(cart, id);
    console.log("Item removed successfully!");
}
// ========================================
// DISPLAY BILL
// ========================================
function displayBill(bill) {
    console.log("\n========================================");
    console.log("              FINAL BILL");
    console.log("========================================");
    console.log(`Order ID: ${bill.orderId}`);
    console.log(`Customer: ${bill.customer.name}`);
    if ("membershipLevel" in bill.customer) {
        console.log(`Membership: ${bill.customer.membershipLevel}`);
    }
    else {
        console.log("Membership: Guest");
    }
    console.log("\nItems:");
    bill.cartItems.forEach((item) => {
        const total = item.price * item.quantity;
        console.log(`${item.name} x${item.quantity} = ₹${total.toFixed(2)}`);
    });
    console.log("----------------------------------------");
    console.log(`Subtotal: ₹${bill.subtotal.toFixed(2)}`);
    console.log(`Membership Discount: ₹${bill.membershipDiscount.toFixed(2)}`);
    console.log(`Additional Discount: ₹${bill.additionalDiscount.toFixed(2)}`);
    console.log(`Total Discount: ₹${bill.totalDiscount.toFixed(2)}`);
    console.log(`After Discount: ₹${bill.amountAfterDiscount.toFixed(2)}`);
    console.log(`GST 5%: ₹${bill.tax.toFixed(2)}`);
    console.log(`Final Amount: ₹${bill.finalAmount.toFixed(2)}`);
    console.log(`Payment: ${bill.payment.method}`);
    if (bill.payment.method === "cash") {
        console.log(`Cash Received: ₹${bill.payment.receivedAmount.toFixed(2)}`);
    }
    else if (bill.payment.method === "card") {
        console.log(`Card Ending: ${bill.payment.last4Digits}`);
    }
    else if (bill.payment.method === "upi") {
        console.log(`Transaction ID: ${bill.payment.transactionId}`);
    }
    console.log(`Order Status: ${bill.orderStatus}`);
    console.log("========================================");
}
// ========================================
// CHECKOUT
// ========================================
async function checkout() {
    if (!currentCustomer) {
        console.log("Please create customer first.");
        return;
    }
    if (cart.length === 0) {
        console.log("Cart is empty.");
        return;
    }
    displayCart();
    const method = (await askQuestion("Payment method (cash/card/upi): ")).toLowerCase();
    let payment;
    // CASH
    if (method === "cash") {
        const amount = Number(await askQuestion("Enter cash received: "));
        payment = (0, payment_1.createCashPayment)(amount);
        // CARD
    }
    else if (method === "card") {
        const last4 = await askQuestion("Enter last 4 digits: ");
        payment = (0, payment_1.createCardPayment)(last4);
        // UPI
    }
    else if (method === "upi") {
        const transactionId = await askQuestion("Enter transaction ID: ");
        payment = (0, payment_1.createUpiPayment)(transactionId);
        // INVALID
    }
    else {
        console.log("Invalid payment method.");
        return;
    }
    // GENERATE BILL
    const result = (0, billing_1.generateBill)(orderId, currentCustomer, cart, payment);
    if (result.status === "error") {
        console.log(result.message);
        return;
    }
    // PROCESS PAYMENT
    const paymentMessage = (0, payment_1.processPayment)(payment, result.bill.finalAmount);
    console.log(`\n${paymentMessage}`);
    if (paymentMessage.startsWith("Insufficient")) {
        return;
    }
    // UPDATE ORDER
    orderStatus = "confirmed";
    result.bill.orderStatus =
        orderStatus;
    displayBill(result.bill);
    orderId++;
    cart = [];
    orderStatus = "pending";
}
// ========================================
// ORDER STATUS
// ========================================
async function handleOrderStatus() {
    console.log(`Current status: ${orderStatus}`);
    console.log((0, order_1.getOrderStatusMessage)(orderStatus));
    const input = (await askQuestion("Enter new status: ")).toLowerCase();
    if (input !== "pending" &&
        input !== "confirmed" &&
        input !== "preparing" &&
        input !== "delivered" &&
        input !== "cancelled") {
        console.log("Invalid status.");
        return;
    }
    const newStatus = input;
    const updatedStatus = (0, order_1.updateOrderStatus)(orderStatus, newStatus);
    if (updatedStatus === orderStatus &&
        newStatus !== orderStatus) {
        console.log("This status change is not allowed.");
        return;
    }
    orderStatus =
        updatedStatus;
    console.log(`Order status: ${orderStatus}`);
    console.log((0, order_1.getOrderStatusMessage)(orderStatus));
}
// ========================================
// MAIN MENU
// ========================================
function displayMainMenu() {
    console.log("\n");
    console.log("╔════════════════════════════════╗");
    console.log("║      FOOD ORDERING SYSTEM      ║");
    console.log("╚════════════════════════════════╝");
    console.log("1. View Food Menu");
    console.log("2. Create Customer");
    console.log("3. Add Item to Cart");
    console.log("4. View Cart");
    console.log("5. Update Quantity");
    console.log("6. Remove Item");
    console.log("7. Checkout");
    console.log("8. Change Order Status");
    console.log("9. Exit");
}
// ========================================
// START APPLICATION
// ========================================
async function startApplication() {
    console.log("\nWelcome to Food Ordering System!");
    let running = true;
    while (running) {
        displayMainMenu();
        const choice = (await askQuestion("Select option: ")).trim();
        switch (choice) {
            case "1":
                displayFoodMenu();
                break;
            case "2":
                await createCustomer();
                break;
            case "3":
                await handleAddToCart();
                break;
            case "4":
                displayCart();
                break;
            case "5":
                await handleUpdateQuantity();
                break;
            case "6":
                await handleRemoveItem();
                break;
            case "7":
                await checkout();
                break;
            case "8":
                await handleOrderStatus();
                break;
            case "9":
                running = false;
                console.log("\nThank you for using Food Ordering System!");
                break;
            default:
                console.log("Invalid option.");
        }
    }
    rl.close();
}
// ========================================
// RUN
// ========================================
startApplication();
