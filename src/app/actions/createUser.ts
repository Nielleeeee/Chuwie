"use server";

import { getXataClient } from "@/xata";

export default async function createUser(userInfo: UserInfoProps) {
  const xataClient = getXataClient();

  try {
    const {
      clerk_id,
      email,
      username,
      first_name,
      last_name,
      profile_picture,
    } = userInfo;

    const createUser = await xataClient.db.User.create(userInfo);

    return { status: true, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
}
