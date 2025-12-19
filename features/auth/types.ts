import { User } from "better-auth";
import { AuthComponentSelectType } from "./schemas";
import { getUserInfo } from "./actions";

export type AuthComponentPropsType = {
  onClose?: () => void;
  switchComponentTo?: (v: AuthComponentSelectType) => void;
};
export type ProfileComponentPropsType = {
  onSuccess?: () => void;
  user: Awaited<ReturnType<typeof getUserInfo>>["user"];
  isPasswordAccountExist?: Awaited<
    ReturnType<typeof getUserInfo>
  >["isPasswordAccountExist"];
};
