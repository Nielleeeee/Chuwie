import { notFound } from "next/navigation";
import getUser from "@/app/actions/user/getUser";
import Image from "next/image";

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const userInfo = await getUser(params.slug);

  if (!userInfo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-700">
      <section>
        <Image
          src={userInfo.profile_picture || ""}
          alt={userInfo.username || ""}
          height={100}
          width={100}
        />
        <h2>
          {userInfo.first_name} {userInfo.last_name} ({userInfo.username})
        </h2>
      </section>
    </main>
  );
}
