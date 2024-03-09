import Image from "next/image";
import { UserButton, currentUser } from "@clerk/nextjs";
import Header from "@/components/layout/header";
import SamplePost from "@/components/samplePost";
import CreatePost from "@/components/post/createPost";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="min-h-screen bg-slate-700">
      <Header />

      <section className="flex flex-col w-full max-w-3xl mx-auto px-4 md:px-8">
        <div className="relative py-5">
          <h1 className="text-purple-100 mb-10 text-xl">
            Welcome, <span className="font-semibold">{user?.firstName}!</span>
          </h1>
          
          <CreatePost />
        </div>

        <SamplePost />
      </section>
    </main>
  );
}
