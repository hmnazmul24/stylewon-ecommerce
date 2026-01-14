import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function page(
  props: PageProps<"/qr-code-scan/[product-id]">,
) {
  const productId = (await props.params)["product-id"];
  if (!productId) {
    redirect("/");
  }
  const res = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });
  if (res.data && res.data.user.role === "admin") {
    redirect(`/admin/sales/purchase?productids=${productId}`);
  } else {
    redirect(`/product/${productId}`);
  }
}
