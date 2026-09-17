"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGuest = createGuest;
exports.createMember = createMember;
exports.getCustomerDiscount = getCustomerDiscount;
function createGuest(id, name, address, phone) {
    return {
        id,
        name,
        phone,
        address,
        type: "guest",
    };
}
function createMember(id, name, address, membershipLevel, discountPercentage, membershipId, phone) {
    return {
        id,
        name,
        phone,
        address,
        type: "member",
        membershipId,
        discountPercentage,
        membershipLevel,
    };
}
function getCustomerDiscount(customer) {
    if ("membershipLevel" in customer) {
        return customer.discountPercentage;
    }
    return 0;
}
