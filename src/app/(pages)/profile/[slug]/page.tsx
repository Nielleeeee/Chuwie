import { notFound } from "next/navigation";
import getUser from "@/app/actions/getUser";

// Instead of user id, try finding the username.

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const userInfo = await getUser(params.slug);

  if (!userInfo) {
    notFound();
  }

  console.log(userInfo);

  return <div>{params.slug}</div>;
}
