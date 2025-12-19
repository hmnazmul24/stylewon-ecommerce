"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PenSquareIcon, Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { getUserInfo } from "../../actions";
import { AddOrUpdateName } from "./add-or-update-name";
import { cn } from "@/lib/tiptap-utils";
import { SignOutButton } from "../sign-out-button";
import { Separator } from "@/components/ui/separator";
import { AddOrUpdateEmail } from "./add-or-update-email";
import { AddOrUpdatePhoneNumber } from "./add-or-update-phone-number";
import { AddOrUpdatePassword } from "./add-or-update-password";

export function ProfileSections() {
  const { data } = useSuspenseQuery({
    queryKey: ["user-info"],
    queryFn: () => getUserInfo(),
  });
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Profile informations</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProfileSectionWrapper
          label="Full name"
          value={data.user.name}
          variant={data.user.name ? "UPDATE" : "ADD"}
          buttonLabel={{ add: "Add name", change: "Update name" }}
          open={openNameDialog}
          setOpen={setOpenNameDialog}
        >
          <AddOrUpdateName
            onSuccess={() => setOpenNameDialog(false)}
            user={data.user}
          />
        </ProfileSectionWrapper>
        <Separator />

        <ProfileSectionWrapper
          label="Email address"
          value={data.user.email}
          variant={data.user.email ? "UPDATE" : "ADD"}
          buttonLabel={{
            add: "Add email address",
            change: "Update email address",
          }}
          open={openEmailDialog}
          setOpen={setOpenEmailDialog}
        >
          <AddOrUpdateEmail
            onSuccess={() => setOpenEmailDialog(false)}
            user={data.user}
          />
        </ProfileSectionWrapper>
        <Separator />

        <ProfileSectionWrapper
          label="Phone Number"
          value={data.user.phoneNumber ?? ""}
          variant={data.user.phoneNumber ? "UPDATE" : "ADD"}
          buttonLabel={{
            add: "Add phone number",
            change: "Update phone number",
          }}
          open={openPhoneDialog}
          setOpen={setOpenPhoneDialog}
        >
          <AddOrUpdatePhoneNumber
            onSuccess={() => setOpenPhoneDialog(false)}
            user={data.user}
          />
        </ProfileSectionWrapper>
        <Separator />
        <ProfileSectionWrapper
          label="Password"
          variant={data.isPasswordAccountExist ? "UPDATE" : "ADD"}
          buttonLabel={{
            add: "Add new password",
            change: "Update password",
          }}
          value={data.isPasswordAccountExist ? "********" : ""}
          open={openPasswordDialog}
          setOpen={setOpenPasswordDialog}
        >
          <AddOrUpdatePassword
            onSuccess={() => setOpenPasswordDialog(false)}
            user={data.user}
            isPasswordAccountExist={data.isPasswordAccountExist}
          />
        </ProfileSectionWrapper>
        <Separator />
        <SignOutButton />
      </CardContent>
    </Card>
  );
}

type ProfileSectionProps = {
  label: string;
  value?: string;
  variant: "ADD" | "UPDATE";
  buttonLabel: {
    add: string;
    change: string;
  };
  children: ReactNode;

  open: boolean;
  setOpen: (open: boolean) => void;
};

function ProfileSectionWrapper({
  label,
  value,
  variant,
  buttonLabel,
  children,
  open,
  setOpen,
}: ProfileSectionProps) {
  const isAdd = variant === "ADD";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className={cn("space-y-2", isAdd && "flex items-center gap-2")}>
        <h1 className="text-sm font-semibold">{label}</h1>

        <div className="flex items-center gap-3">
          {!isAdd && value && <Badge>{value}</Badge>}

          <DialogTrigger asChild>
            <Button variant={isAdd ? "outline" : "ghost"}>
              {isAdd ? <Plus /> : <PenSquareIcon />}
              <span className="hidden md:block">
                {isAdd ? buttonLabel.add : buttonLabel.change}
              </span>
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="min-h-[50%]">
        <DialogHeader>
          <DialogTitle className="text-start text-xl">
            {isAdd ? buttonLabel.add : buttonLabel.change}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
