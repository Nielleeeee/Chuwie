import Image from "next/image";
import { UserButton, currentUser } from "@clerk/nextjs";
import Header from "@/components/layout/header";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="min-h-screen bg-slate-700">
      <Header />
      <h1>
        Welcome, <span className="text-purple-100">{user?.firstName}</span>
      </h1>

      {/* Post here */}
    </main>
  );
}
