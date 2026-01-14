import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { searchAdminUser } from "../actions";

export function ExistedUser({
  setCustomerId,
}: {
  setCustomerId: (v: string) => void;
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const debouncedPhoneNo = useDebounce(phoneNumber);

  const { isPending, data } = useQuery({
    queryKey: ["admin-purchase-user", debouncedPhoneNo],
    queryFn: () => searchAdminUser(debouncedPhoneNo),
  });

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Search Customer</CardTitle>
        <CardDescription>
          Find an existing customer using their phone number.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Box */}
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              className="pl-9"
              placeholder="Enter phone number..."
              inputMode="numeric"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2">
          {!isPending && (!data || data.length === 0) && (
            <div className="text-muted-foreground flex h-20 items-center justify-center rounded-lg border border-dashed text-sm">
              No customer found
            </div>
          )}

          {data && data.length > 0 && (
            <div className="divide-y rounded-lg border">
              {data.map((user) => (
                <div
                  key={user.id}
                  className="hover:bg-muted/50 flex items-center justify-between px-4 py-3 transition"
                >
                  <div>
                    <p className="text-sm font-medium">{user.phoneNumber} </p>
                    <p className="text-muted-foreground text-xs">
                      Customer ID: {user.id}
                    </p>
                  </div>

                  <Button
                    onClick={() => setCustomerId(user.id)}
                    size="sm"
                    variant="secondary"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t py-4">
        {isPending && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Spinner className="h-4 w-4" />
            Searching...
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
