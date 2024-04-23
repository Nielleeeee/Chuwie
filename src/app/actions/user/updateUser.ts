"use server";

import { getXataClient } from "@/xata";

export default async function updateUser(userInfo: UserInfoProps) {
  const xataClient = getXataClient();

  try {
    const updateUser = await xataClient.db.User.createOrReplace(
      userInfo.user_id,
      userInfo
    );

    return { status: true, message: updateUser, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
}
