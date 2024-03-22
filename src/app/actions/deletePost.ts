"use server";

import { v2 as cloudinary } from "cloudinary";
import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const handleDeletePost = async ({ postId }: { postId: string }) => {
  const xataClient = getXataClient();

  const user = await currentUser();
  const user_id = user?.id;

  try {
    const deletePost = await xataClient.db.Post.delete(postId);
    
    // Remove image from cloudinary

    revalidateTag("allPosts")
    return { deletePost };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
