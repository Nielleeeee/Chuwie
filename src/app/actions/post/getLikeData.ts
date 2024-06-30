"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getXataClient } from "@/xata";

export const getLikeData = async (postID: string) => {
  try {
    const xataClient = getXataClient();

    const user = await currentUser();
    const dbID = user?.publicMetadata.user_id as string;

    const isLiked = await xataClient.db.Like.filter({
      "post.id": postID,
      "user.id": dbID,
    }).getFirst();

    const getLikesCount = await xataClient.db.Post.select(["like_count"])
      .filter({ id: postID })
      .getFirst();

    const likeData = { likeCount: getLikesCount?.like_count, isCurrentUserLiked: isLiked !== null };

    return {
      status: true,
      error: null,
      likeData,
    };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
};
