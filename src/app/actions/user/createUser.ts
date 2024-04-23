"use server";

import { getXataClient } from "@/xata";

export default async function createUser(userInfo: UserInfoProps) {
  const xataClient = getXataClient();

  try {
    const createUser = await xataClient.db.User.create(userInfo);

    return { status: true, id: createUser.id, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
}
