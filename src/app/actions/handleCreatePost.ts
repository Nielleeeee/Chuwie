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

export const handleCreatePost = async (values: any) => {
  const { content, media } = values;

  const xataClient = getXataClient();

  const user = await currentUser();
  const user_id = user?.id;
  const author_username = user?.username;
  const author_fullname =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.firstName ?? "") + (user?.lastName ?? "");

  try {
    const mediaUrl: string[] = [];

    // Upload file to cloudinary
    const uploadedMedia = await Promise.all(
      media.map(async (fileData: any) => {
        try {
          const buffer = Buffer.from(fileData, "base64");
          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ tags: ["chuwie"] }, function (error, result) {
                if (error) {
                  reject(error);
                  return;
                }
                mediaUrl.push(result?.secure_url as string);
                resolve(result);
              })
              .end(buffer);
          });
        } catch (error) {
          console.error("Error while processing file data:", error);
          throw error;
        }
      })
    );

    // Insert Data to xata database
    const postData = {
      user_id,
      author_username,
      author_fullname,
      content,
      media: mediaUrl,
    };

    const createPost = await xataClient.db.Post.create(postData);

    revalidateTag("post");
  } catch (error) {
    console.error("Error while uploading images:", error);
    throw new Error("An unexpected error occurred");
  }
};
