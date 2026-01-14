import { Toaster } from "@/components/ui/sonner";
import Providers from "@/tanstack-query/providers";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/next-theme-provider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stylewon | get fasionable, modern, cool, things",
  description: "A ecommerce platform for selling custom branded products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${nunito.variable} font-nunito font-normal antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Providers>
        </ThemeProvider>
        <Toaster closeButton />
      </body>
    </html>
  );
}
