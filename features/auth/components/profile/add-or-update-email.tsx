"use client";

import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";
import { ProfileComponentPropsType } from "../../types";
import { GenericEmailInputForm } from "../generic-email-input-form";

export function AddOrUpdateEmail({
  user,
  onSuccess,
}: ProfileComponentPropsType) {
  return user.email ? (
    <GenericEmailInputForm
      key={1}
      defaultValue={user.email}
      submitLabel="Send verfication link"
      onSubmit={async (input) => {
        if (user.email === input.email) {
          toast.info("You haven't changed anything");
          return;
        }
        const res = await authClient.changeEmail({ newEmail: input.email });
        if (res.data) {
          toast.success("Email verification link has sent");
          onSuccess && onSuccess();
        }
        if (res.error) {
          toast.error(res.error.message || res.error.statusText);
        }
      }}
    />
  ) : (
    <GenericEmailInputForm
      key={2}
      submitLabel="Send verfication link"
      onSubmit={async (input) => {
        const res = await authClient.changeEmail({ newEmail: input.email });
        if (res.data) {
          toast.success("Email verification link has sent");
          onSuccess && onSuccess();
        }
        if (res.error) {
          toast.error(res.error.message || res.error.statusText);
        }
      }}
    />
  );
}
