import { clerkClient } from "@clerk/nextjs";

export default async function getUser(userId: string) {
  try {
    const userInfo = await clerkClient.users.getUser(userId);

    return userInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}
