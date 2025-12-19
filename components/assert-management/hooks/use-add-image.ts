import { create } from "zustand";
type ImgType = {
  url: string;
  publicId: string;
};
type Store = {
  images: ImgType[];
  addImage: (i: ImgType) => void;
  removeImage: (publicId: string) => void;
  clearImages: () => void;
};

export const useAddImage = create<Store>((set) => ({
  images: [],

  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),

  removeImage: (publicId) =>
    set((state) => ({
      images: state.images.filter((img) => img.publicId !== publicId),
    })),

  clearImages: () => set({ images: [] }),
}));
