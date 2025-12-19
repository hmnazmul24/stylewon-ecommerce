import { create } from "zustand";

type Store = {
  signupSigninPhoneNo: string;
  setSignupSigninPhoneNo: (num: string) => void;
};

export const useAuthStore = create<Store>((set) => ({
  signupSigninPhoneNo: "",
  setSignupSigninPhoneNo: (num) => set({ signupSigninPhoneNo: num }),
}));
