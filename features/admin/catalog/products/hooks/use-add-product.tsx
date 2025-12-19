import { Option } from "@/components/ui/multiple-selector";
import { create } from "zustand";
import { ColorOption } from "../components/add-product-options";

type SizeColorOptions = {
  sizes: Option[];
  colors: ColorOption[];
  selectedOption: "size" | "color";
  optionDialogOpen: boolean;
  setOptionDialogOpen: (v: boolean) => void;
  setSelectedOption: (s: "size" | "color") => void;
  setSizes: (optons: Option[]) => void;
  setColors: (optons: ColorOption[]) => void;
};

export const useSizeColorOptions = create<SizeColorOptions>()((set) => ({
  sizes: [],
  colors: [],
  selectedOption: "size",
  optionDialogOpen: false,
  setOptionDialogOpen: (v) => set({ optionDialogOpen: v }),
  setSelectedOption: (s) => set({ selectedOption: s }),
  setColors: (colors) =>
    set(() => {
      const editedColors = colors.map((color) =>
        color.hexColor ? color : { ...color, hexColor: "#000000" },
      );
      return { colors: editedColors };
    }),
  setSizes: (options) => set({ sizes: options }),
}));

type CategorySelectionType = {
  checkedCategoryIds: string[];

  setCheckedCategoryIds: (id: string) => void;
};

export const useCategorySelection = create<CategorySelectionType>()((set) => ({
  checkedCategoryIds: [],

  setCheckedCategoryIds: (id) =>
    set((exist) => {
      let categoryIds = [...exist.checkedCategoryIds];
      const index = categoryIds.indexOf(id);
      if (index === -1) {
        categoryIds.push(id);
      } else {
        categoryIds = categoryIds.filter((existedId) => existedId !== id);
      }
      return { checkedCategoryIds: categoryIds };
    }),
}));
