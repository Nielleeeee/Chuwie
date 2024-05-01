import { notFound } from "next/navigation";
import getUser from "@/app/actions/user/getUser";
import UserInfo from "@/components/user/userInfo";
import UserPost from "@/components/post/userPost";
import { MainContainer } from "@/components/container/container";
import CreatePost from "@/components/post/createPost";
import { currentUser } from "@clerk/nextjs/server";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const queryClient = new QueryClient();

  const userInfo = await getUser(params.username);

  const userId = userInfo?.clerk_id;
  const currentLoggedUser = await currentUser();
  const currentLoggedUserId = currentLoggedUser?.id;

  if (!userInfo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-700 py-10">
      <MainContainer>
        {userId == currentLoggedUserId && <CreatePost />}

        <UserInfo {...userInfo} />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <UserPost username={userInfo.username || ""} />
        </HydrationBoundary>
      </MainContainer>
    </main>
  );
}
