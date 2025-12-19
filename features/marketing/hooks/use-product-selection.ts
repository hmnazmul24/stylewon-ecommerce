import { create } from "zustand";

type Store = {
  selectedSize: string;
  setSelectedSize: (size: string) => void;

  selectedColor: string;
  setSelectedColor: (color: string) => void;

  selectedImage: string;
  setSelectedImage: (img: string) => void;

  quantity: number;
  setQuantity: (qty: number) => void;
};

export const useProductSelection = create<Store>()((set, get) => ({
  selectedSize: "",
  setSelectedSize: (size) => set({ selectedSize: size }),

  selectedColor: "",
  setSelectedColor: (color) => set({ selectedColor: color }),

  selectedImage: "",
  setSelectedImage: (img) => set({ selectedImage: img }),

  quantity: 1,
  setQuantity: (qty) => set({ quantity: qty }),
}));
