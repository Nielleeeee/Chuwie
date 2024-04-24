"use server";

import { getXataClient } from "@/xata";

export default async function updateUser(userInfo: UserInfoProps) {
  const xataClient = getXataClient();

  const { user_id, ...updatedUserInfo } = userInfo;

  try {
    const updateUser = await xataClient.db.User.createOrReplace(
      user_id,
      updatedUserInfo
    );

    return { status: true, message: updateUser, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
}
