"use server";

import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs/server";

export const likePost = async (post_id: string) => {
  try {
    const user = await currentUser();

    const user_id = user?.publicMetadata.user_id as string;

    const xataClient = getXataClient();

    if (!user_id) {
      throw new Error("User ID is required to like a post.");
    }

    const isLiked = await xataClient.db.Like.filter({
      "post.id": post_id,
      "user.id": user_id,
    }).getFirst();

    let result;

    if (isLiked === null || isLiked === undefined) {
      result = await xataClient.transactions.run([
        {
          insert: {
            table: "Like",
            record: { user: user_id, post: post_id },
          },
        },
        {
          update: {
            table: "Post",
            id: post_id,
            fields: { like_count: { $increment: 1 } },
          },
        },
      ]);
    } else {
      result = await xataClient.transactions.run([
        { delete: { table: "Like", id: isLiked.id } },
        {
          update: {
            table: "Post",
            id: post_id,
            fields: { like_count: { $decrement: 1 } },
          },
        },
      ]);
    }

    console.log("Query Result: ", result);

    return { status: true, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
};
