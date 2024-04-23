"use server";

import { getXataClient } from "@/xata";

export default async function deleteUser(clerk_id: string) {
  const xataClient = getXataClient();

  try {
    const deleteUser =
      await xataClient.sql`DELETE FROM "User" WHERE clerk_id=${clerk_id}`;

    return { status: true, message: deleteUser, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
}
