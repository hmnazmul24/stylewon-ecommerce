"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Expand, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { selectedAdminUser } from "../actions";
import { AddNewCustomer } from "./add-new-customer";
import { ExistedUser } from "./existed-user";
import { OrderHistory } from "./order-history";

export function SelectUser() {
  const [customerId, setCustomerId] = useQueryState("customer_id");
  return (
    <div>
      {customerId ? (
        <SelectedCustomerCard
          customerId={customerId}
          remove={() => setCustomerId("")}
        />
      ) : (
        <Tabs defaultValue="register">
          <TabsList>
            <TabsTrigger value="register">Register New</TabsTrigger>
            <TabsTrigger value="existed">Search existed Customer</TabsTrigger>
          </TabsList>
          <TabsContent value="existed">
            <ExistedUser setCustomerId={setCustomerId} />
          </TabsContent>
          <TabsContent value="register">
            <AddNewCustomer setCustomerId={setCustomerId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export function SelectedCustomerCard({
  customerId,
  remove,
}: {
  customerId: string;
  remove: () => void;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["selected-customer", customerId],
    queryFn: () => selectedAdminUser(customerId),
  });

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle className="text-lg">Selected Customer</CardTitle>
        <Button
          size="icon"
          variant="ghost"
          onClick={remove}
          className="text-muted-foreground hover:text-destructive h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        )}

        {!isPending && data && (
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground text-sm">Phone Number</p>
              <p className="font-medium">{data.phoneNumber}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm">Customer ID</p>
              <p className="font-mono text-sm">{data.id}</p>
            </div>

            {data.name && (
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="font-medium">{data.name}</p>
              </div>
            )}
          </div>
        )}
        {data && <ShowUserPurchesHistoryDialog userId={data.id} />}
      </CardContent>
    </Card>
  );
}

function ShowUserPurchesHistoryDialog(props: { userId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Purchases History <Expand />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User purches history</DialogTitle>
        </DialogHeader>
        <OrderHistory {...props} />
      </DialogContent>
    </Dialog>
  );
}
