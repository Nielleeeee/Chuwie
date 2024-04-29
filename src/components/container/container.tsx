import React from "react";

export function MainContainer({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col w-full max-w-3xl mx-auto px-4 md:px-8">
      {children}
    </section>
  );
}
