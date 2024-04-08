import { clerkClient } from "@clerk/nextjs";
import React from "react";

export default async function SamplePage() {
  const userInfo = await clerkClient.users.getUser(
    "user_2dPfCHll2amghRRyU2P7neS8Aih"
  );

  console.log("User Info: ", userInfo);

  return <section className="h-screen">Sample Page</section>;
}
