"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingBag, Truck, Wallet, User, PackageCheck } from "lucide-react";

export function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back, here’s an overview of your account
          </p>
        </div>
        <Button size="sm" variant="outline">
          View Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        <StatCard title="Total Orders" value="24" icon={<ShoppingBag />} />
        <StatCard title="Pending Orders" value="3" icon={<Truck />} />
        <StatCard title="Completed" value="21" icon={<PackageCheck />} />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div
                key={order}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">Order #ORD-10{order}</p>
                  <p className="text-muted-foreground text-sm">
                    Placed 2 days ago
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Processing</Badge>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Complete your profile</p>
                <p className="text-muted-foreground text-xs">
                  Add address & phone number
                </p>
              </div>
            </div>
            <Progress value={70} />
            <Button size="sm" className="w-full">
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Widgets */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Home Address</p>
            <p className="text-muted-foreground text-xs">Dhaka, Bangladesh</p>
            <Button size="sm" variant="outline">
              Manage Addresses
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary">
              Track Order
            </Button>
            <Button size="sm" variant="secondary">
              View Orders
            </Button>
            <Button size="sm" variant="secondary">
              Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className="bg-muted flex size-10 items-center justify-center rounded-xl">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
