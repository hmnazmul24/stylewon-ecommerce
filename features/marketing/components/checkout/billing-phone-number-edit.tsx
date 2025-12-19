import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GenericOTPVerifier } from "@/features/auth/components/generic-otp-verifier";
import { BD_PHONE_REGEX } from "@/features/auth/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { sendOtpPhoneNumberVerify } from "../../server/billing.actions";

const phoneSchema = z.object({
  phone: z.string().regex(BD_PHONE_REGEX, "Enter a valid phone number"),
});
export function BillingsPhoneNumberEdit({
  phoneNumber,
  children,
  setPhoneNumber,
}: {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [optVerify, setOtpVerify] = useState(true);
  const [otp, setOtp] = useState("");
  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: phoneNumber,
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (inputs: z.infer<typeof phoneSchema>) => {
      if (phoneNumber === inputs.phone) {
        form.reset();
        setOpen(false);
        return;
      }
      const res = await sendOtpPhoneNumberVerify({ phoneNumber: inputs.phone });
      setOtp(res.otp);
      setOtpVerify(false);
      toast.message("OTP sent");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your phone number</DialogTitle>
          <DialogDescription>
            if you want to update your phone number enter and verify it.
          </DialogDescription>
        </DialogHeader>
        {!optVerify ? (
          <GenericOTPVerifier
            identifier={form.getValues("phone")}
            onVerify={async (otpInput) => {
              const isVerified = otpInput === otp;
              if (isVerified) {
                return {
                  success: "OTP is verified",
                };
              }
              return { error: "Invalid OTP" };
            }}
            onResend={async () => {
              const phoneNumber = form.getValues("phone");
              const res = await sendOtpPhoneNumberVerify({
                phoneNumber,
              });
              setOtp(res.otp);
              if (res.otp) {
                return {
                  success: "OTP is has sent again!",
                };
              }
              return { error: "Error" };
            }}
            onSuccess={() => {
              setPhoneNumber(form.getValues("phone") ?? "");
              setOpen(false);
            }}
          />
        ) : (
          <div>
            <FieldGroup>
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Phone Number</FieldLabel>
                    <Input aria-invalid={fieldState.invalid} {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                disabled={sendMutation.isPending}
                onClick={() =>
                  sendMutation.mutate({ phone: form.getValues("phone") ?? "" })
                }
                type="button"
              >
                Send OTP via SMS
              </Button>
            </FieldGroup>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
