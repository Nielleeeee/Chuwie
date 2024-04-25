"use server";

import { getXataClient } from "@/xata";

const xataClient = getXataClient();

export default async function getUser(username: string) {
  try {
    const userInfo = await xataClient.db.User.filter({ username }).getFirst();

    return userInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}
