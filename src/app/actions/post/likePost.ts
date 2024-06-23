"use server";

import { getXataClient } from "@/xata";

export const likePost = async ({ post_id, user_id }: LikePostParams) => {
  try {
    const xataClient = getXataClient();

    await xataClient.db.Like.create({ post_id, user_id });

    return { status: true, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
};
