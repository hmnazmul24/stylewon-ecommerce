import { create } from "zustand";

type Store = {
  search: string;
  setSearch: (search: string) => void;
};

export const useSearch = create<Store>()((set, get) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));
