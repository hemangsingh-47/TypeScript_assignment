import {
  Address,
  CustomerType,
  Guest,
  Member,
} from "./types";

export function createGuest(
  id: number,
  name: string,
  address: Address,
  phone?: string
): Guest {
  return {
    id,
    name,
    phone,
    address,
    type: "guest",
  };
}

export function createMember(
  id: number,
  name: string,
  address: Address,
  membershipLevel: Member["membershipLevel"],
  discountPercentage: number,
  membershipId: string,
  phone?: string
): Member {
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

export function getCustomerDiscount(
  customer: CustomerType
): number {
  if ("membershipLevel" in customer) {
    return customer.discountPercentage;
  }

  return 0;
}