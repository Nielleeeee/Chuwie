"use server";

import { v2 as cloudinary } from "cloudinary";
import { getXataClient } from "@/xata";
import { revalidatePath } from "next/cache";

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
    const deletePost = await xataClient.db.Post.delete(postId);

    if (postMedia?.length !== 0) {
      postMedia?.map(async (media: any) => {
        await cloudinary.uploader
          .destroy(media.public_id)
          .then((result) => console.log(result));
      });
    }

    revalidatePath("/");
    
  } catch (error) {
    console.error(error);
    throw error;
  }
};
