"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardData } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "@/components/shared/error";

const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4200 },
  { name: "May", value: 6200 },
];

const earningsData = [
  { name: "Week 1", value: 1200 },
  { name: "Week 2", value: 2100 },
  { name: "Week 3", value: 1800 },
  { name: "Week 4", value: 2600 },
];

const categoryData = [
  { name: "Clothing", value: 40 },
  { name: "Shoes", value: 25 },
  { name: "Accessories", value: 20 },
  { name: "Others", value: 15 },
];

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444"];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardAboveSection />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-80">
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-80">
          <CardHeader>
            <CardTitle>Weekly Earnings</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="h-80 lg:col-span-1">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-80 lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardAboveSection() {
  const { isPending, error, data } = useQuery({
    queryKey: ["dashboard-info"],
    queryFn: () => getDashboardData(),
  });
  if (isPending) {
    return <DashboardAboveSectionSkeleton />;
  }
  if (error) {
    return <Error />;
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {data.productCount}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Categories</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {data.categoryCount}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {data.usersCount}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Brands</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold">
          {data.brandCount}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardAboveSectionSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="space-y-3 rounded-lg p-6">
          <Skeleton className="h-5 w-4/5 bg-gray-500/50" />
          <Skeleton className="h-8 w-1/3 bg-gray-500/50" />
        </Skeleton>
      ))}
    </div>
  );
}
