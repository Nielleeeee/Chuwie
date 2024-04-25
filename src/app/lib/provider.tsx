"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { outerRoutes } from "@/app/data/const";
import { Analytics } from "@vercel/analytics/react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchInterval: 60 * 1000,
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <Analytics />
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools /> */}
        {!outerRoutes.includes(pathname) && <Header />}
        {children}
        {!outerRoutes.includes(pathname) && <Footer />}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
