import { notFound } from "next/navigation";
import getUser from "@/app/actions/user/getUser";
import UserInfo from "@/components/user/userInfo";
// import UserPost from "@/components/post/userPost";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const userInfo = await getUser(params.username);

  if (!userInfo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-700">
      <UserInfo {...userInfo} />

      {/* <UserPost username={userInfo.username || ""} /> */}
    </main>
  );
}
