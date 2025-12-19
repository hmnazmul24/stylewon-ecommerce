import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { AuthDialogWrapper } from "@/features/auth/components/auth-dialog-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { User as UserType } from "better-auth";
import { ChevronDown, Search, ShoppingCartIcon, User } from "lucide-react";
import Link from "next/link";
import { CartWrapper } from "../components/cart/cart-wrapper";
import { CategoryCheckBox } from "../components/shared/category-checkbox";
import { getCategories } from "../server/queries";

type UserSession = {
  isPending: boolean;
  user: UserType | undefined;
};
export function NavbarDesktop(session: UserSession) {
  const categoryQuery = useQuery({
    queryKey: ["marketing-categories", "categories"],
    queryFn: () => getCategories(),
  });
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center justify-between">
      <section>
        <Logo />
      </section>
      <section className="space-x-1">
        {categoryQuery.isPending ? (
          <Button variant={"ghost"}>
            Categories <Spinner />
          </Button>
        ) : categoryQuery.error ? (
          <Button variant={"ghost"}>Categories</Button>
        ) : categoryQuery.data.length === 0 ? (
          <Button variant={"ghost"}>Categories</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                Categories <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <CategoryCheckBox data={categoryQuery.data} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Link href={"/products"}>
          {" "}
          <Button variant={"ghost"}>Products</Button>
        </Link>
      </section>
      <section className="flex items-center justify-center gap-1">
        <Link href={"/products"}>
          <Button>
            Search <Search />
          </Button>
        </Link>
        <CartWrapper>
          <Button>
            Cart <ShoppingCartIcon />
          </Button>
        </CartWrapper>
        {session.isPending ? (
          <Skeleton className="h-9 w-24 bg-white/80" />
        ) : session.user ? (
          <Link href={isMobile ? "/account" : "/account/dashboard"}>
            <Button>
              Account <User />
            </Button>
          </Link>
        ) : (
          <AuthDialogWrapper>
            <Button>
              Sign in <User />
            </Button>
          </AuthDialogWrapper>
        )}
      </section>
    </div>
  );
}
