"use server";

import { getXataClient } from "@/xata";

export const likePost = async ({ post_id, user_id }: LikePostParams) => {
  try {
    const xataClient = getXataClient();

    if (!user_id) {
      throw new Error("User ID is required to like a post.");
    }

    const isLiked = await xataClient.db.Like.filter({
      "post_id.id": post_id,
      "user_id.id": user_id,
    }).getFirst();

    if (!isLiked) {
      await xataClient.db.Like.create({ post_id, user_id });
    }

    return { status: true, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
};

export const removelikePost = async ({ likeId }: { likeId: string }) => {
  try {
    const xataClient = getXataClient();

    await xataClient.db.Like.delete(likeId);

    return { status: true, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
};
