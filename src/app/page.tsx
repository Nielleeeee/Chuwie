import { currentUser } from "@clerk/nextjs";
import SamplePost from "@/components/samplePost";
import CreatePost from "@/components/post/createPost";
import Header from "@/components/layout/header";
import { getAllPost } from "./actions/getPost";

export default async function Home() {
  const user = await currentUser();
  const post = await getAllPost();

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
