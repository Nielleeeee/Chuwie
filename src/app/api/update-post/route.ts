import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, media } = body;
  const path = req.nextUrl.searchParams.get("path") || "/";

  const xataClient = getXataClient();

  const user = await currentUser();
  const user_id = user?.id;
  const author_username = user?.username;
  const author_fullname =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.firstName ?? "") + (user?.lastName ?? "");

  try {
    const mediaUrl: { secure_url: string; public_id: string }[] = [];

    // Add to delete handler in here

    // Upload file to cloudinary
    const uploadedMedia = await Promise.all(
      media.map(async (fileData: any) => {
        const buffer = Buffer.from(fileData.data);

        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ tags: ["chuwie"] }, function (error, result) {
              if (error) {
                reject(error);
                return;
              }
              mediaUrl.push({
                secure_url: result?.secure_url as string,
                public_id: result?.public_id as string,
              });
              resolve(result);
            })
            .end(buffer);
        });
      })
    );

    // Insert Data to xata database
    const postData = {
      content,
      media: mediaUrl,
    };

    const updatePost = await xataClient.db.Post.create(postData);

    return new Response(
      JSON.stringify({
        message: "Images uploaded successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error while uploading images:", error);
    return new Response(
      JSON.stringify({ message: "Could not upload images" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
