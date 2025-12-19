import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartType } from "../types";

type Store = {
  // --- CART (guest only) ---
  guestUserCartItems: CartType[];
  guestUserAddItem: (item: CartType) => void;
  guestUserRemoveItem: (productId: string) => void;
  guestUserUpdateItemQty: (productId: string, qty: number) => void;
  guestUserClearCart: () => void;
};

export const useGuestUserCart = create<Store>()(
  persist(
    (set, get) => ({
      // CART STATE
      guestUserCartItems: [],

      guestUserAddItem: (item) => {
        const cart = get().guestUserCartItems;
        const exist = cart.find((i) => i.productId === item.productId);

        const updated = exist
          ? cart.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            )
          : [...cart, item];

        set({ guestUserCartItems: updated });
      },

      guestUserRemoveItem: (productId) => {
        const updated = get().guestUserCartItems.filter(
          (i) => i.productId !== productId,
        );
        set({ guestUserCartItems: updated });
      },

      guestUserUpdateItemQty: (productId, qty) => {
        const updated = get().guestUserCartItems.map((i) =>
          i.productId === productId ? { ...i, quantity: qty } : i,
        );
        set({ guestUserCartItems: updated });
      },

      guestUserClearCart: () => set({ guestUserCartItems: [] }),
    }),

    {
      name: "guest-user-cart-storage", // key in localStorage
    },
  ),
);
