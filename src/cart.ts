import { CartItem, FoodItem } from "./types";

export function addToCart(
  cart: CartItem[],
  foodItem: FoodItem,
  quantity: number,
  specialInstruction?: string
): CartItem[] {
  const existingItem = cart.find(
    (item) => item.id === foodItem.id
  );

  if (existingItem) {
    existingItem.quantity += quantity;

    if (specialInstruction) {
      existingItem.specialInstruction = specialInstruction;
    }

    return cart;
  }

  const newCartItem: CartItem = {
    ...foodItem,
    quantity,
    specialInstruction,
  };

  return [...cart, newCartItem];
}

export function removeFromCart(
  cart: CartItem[],
  foodItemId: number
): CartItem[] {
  return cart.filter(
    (item) => item.id !== foodItemId
  );
}

export function updateQuantity(
  cart: CartItem[],
  foodItemId: number,
  quantity: number
): CartItem[] {
  const itemIndex = cart.findIndex(
    (item) => item.id === foodItemId
  );

  if (itemIndex === -1) {
    return cart;
  }

  if (quantity <= 0) {
    return removeFromCart(cart, foodItemId);
  }

  const updatedCart = [...cart];

  updatedCart[itemIndex] = {
    ...updatedCart[itemIndex],
    quantity,
  };

  return updatedCart;
}

export function calculateItemTotal(
  item: CartItem
): number {
  return item.price * item.quantity;
}

export function calculateSubtotal(
  cart: CartItem[]
): number {
  return cart.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
}