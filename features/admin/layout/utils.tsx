import {
  Album,
  AlbumIcon,
  Boxes,
  Inbox,
  List,
  LucideIcon,
  Network,
  User,
  Users,
  ChartPie,
} from "lucide-react";
export type NavMainType = {
  title: string;
  hide?: boolean;
  lists: {
    title: string;
    url: string;
    icon: LucideIcon;
    subLists?: { title: string; url: string; type?: "static" | "dymamic" }[];
  }[];
};

export const adminSidebarNavItems: NavMainType[] = [
  {
    title: "Home",
    lists: [
      {
        title: "Overviews",
        icon: Album,
        url: "/admin/home/overviews",
      },
      {
        title: "Users",
        icon: Users,
        url: "/admin/home/users",
      },
    ],
  },
  {
    title: "Catalog",
    lists: [
      {
        title: "Products",
        icon: Network,
        url: "/admin/catalog/products",
        subLists: [
          { title: "Add Product", url: "/admin/catalog/products/add-new" },
          {
            title: "Update product",
            url: "/admin/catalog/products",
            type: "dymamic",
          },
        ],
      },
      {
        title: "Inventory",
        icon: Inbox,
        url: "/admin/catalog/inventory",
      },
      {
        title: "Categories",
        icon: Boxes,
        url: "/admin/catalog/categories",
        subLists: [
          {
            title: "Product-listings",
            url: "/admin/catalog/categories",
            type: "dymamic",
          },
        ],
      },
      {
        title: "Marketing console",
        icon: AlbumIcon,
        url: "/admin/catalog/console",
      },
    ],
  },
  {
    title: "Sales",
    lists: [
      {
        title: "Orders",
        icon: List,
        url: "/admin/sales/orders",
      },
      {
        title: "Purchase",
        icon: ChartPie,
        url: "/admin/sales/purchase",
      },
    ],
  },

  {
    title: "Account",
    hide: true,
    lists: [
      {
        title: "Profile",
        icon: User,
        url: "/admin/account/profile",
      },
    ],
  },
];

type BreadcrumbItem = {
  title: string;
  url: string;
};

export function useAdminBreadcrumb(
  adminSidebarNavItems: NavMainType[],
  pathname: string,
): BreadcrumbItem[] {
  const exactPathname = pathname.split("?")[0];

  const breadcrumbs: BreadcrumbItem[] = [];

  for (const nav of adminSidebarNavItems) {
    for (const list of nav.lists) {
      if (list.url === exactPathname) {
        breadcrumbs.push(
          { title: nav.title, url: "#" },
          { title: list.title, url: list.url },
        );

        return breadcrumbs;
      }

      if (list.subLists?.length) {
        const matchedSub = list.subLists.find((sub) =>
          sub.type === "dymamic"
            ? exactPathname.startsWith(sub.url)
            : sub.url === exactPathname,
        );

        if (matchedSub) {
          breadcrumbs.push(
            { title: nav.title, url: "#" }, // 1️⃣ Main Group
            { title: list.title, url: list.url }, // 2️⃣ Parent Item
            { title: matchedSub.title, url: matchedSub.url }, // 3️⃣ Sub Item
          );

          return breadcrumbs;
        }
      }
    }
  }

  return breadcrumbs;
}
