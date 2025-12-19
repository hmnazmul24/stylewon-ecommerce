import { CartType } from "../types";

const CART_KEY = "app_cart";

// Safe load from localStorage
export function loadCartFromLocalStorage(): CartType[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save state → localStorage
export function saveCart(items: CartType[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
