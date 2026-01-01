import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserListingTable } from "../components/user-listing-table";

export default function AdminUsersPage() {
  return (
    <div>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <Users />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

async function Users() {
  const res = await authClient.admin.listUsers({
    query: {
      limit: 100,
    },
    fetchOptions: {
      headers: await headers(),
    },
  });
  if (!res.data) {
    return null;
  }
  return (
    <div>
      {}
      <UserListingTable users={res.data.users} />
    </div>
  );
}
