"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
// import Footer from "@/components/layout/footer";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000,
            refetchInterval: 10 * 1000,
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools /> */}
        {pathname !== "/sign-in" && pathname !== "/sign-up" && <Header />}
        {children}
        {/* {(pathname !== "/sign-in" && pathname !== "/sign-up") && <Footer />} */}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
