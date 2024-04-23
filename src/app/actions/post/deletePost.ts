"use server";

import { v2 as cloudinary } from "cloudinary";
import { getXataClient } from "@/xata";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const handleDeletePost = async ({
  postId,
  postMedia,
}: DeletePostParams) => {
  const xataClient = getXataClient();

  try {
    if (postMedia?.length !== 0) {
      postMedia?.map(async (media: any) => {
        const deleteImage = await cloudinary.uploader.destroy(media.public_id);
      });
    }

    const deletePost = await xataClient.db.Post.delete(postId);

    return { status: true, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
};
