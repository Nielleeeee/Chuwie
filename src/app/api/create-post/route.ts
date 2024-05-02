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

  const { imageFiles, videoFiles } = media;

  const xataClient = getXataClient();

  const user = await currentUser();
  const author_id = (user?.publicMetadata.user_id as string) || "";

  try {
    const mediaUrl: { secure_url: string; public_id: string }[] = [];

    // Upload image to cloudinary
    await Promise.all(
      imageFiles.map(async (fileData: any) => {
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

    // Upload video to cloudinary
    

    // Insert Data to xata database
    const postData = {
      content,
      media: mediaUrl,
      author: author_id,
    };

    await xataClient.db.Post.create(postData);

    return new Response(
      JSON.stringify({
        message: "Post created successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while creating post:", error);
    return new Response(JSON.stringify({ message: "Could not create post" }), {
      status: 500,
    });
  }
}
