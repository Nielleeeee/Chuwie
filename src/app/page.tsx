import { currentUser } from "@clerk/nextjs";
import Post from "@/components/post/post";
import CreatePost from "@/components/post/createPost";
import { ToastContainer } from "react-toastify";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import "react-toastify/dist/ReactToastify.css";

export default async function Home() {
  const user = await currentUser();

  const queryClient = new QueryClient();

  return (
    <main className="min-h-screen bg-slate-700">
      <ToastContainer />

      <section className="flex flex-col w-full max-w-3xl mx-auto px-4 md:px-8">
        <CreatePost />

        <div className="relative py-10">
          <h1 className="text-purple-100 mb-10 text-xl">
            Welcome, <span className="font-semibold">{user?.firstName}!</span>
          </h1>

          <HydrationBoundary state={dehydrate(queryClient)}>
            <Post />
          </HydrationBoundary>
        </div>
      </section>
    </main>
  );
}
