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
  const { content, media, post_id, toDelete, currentMedia }: UpdatePostRoute =
    body;

  const xataClient = getXataClient();

  try {
    const mediaUrl: { secure_url: string; public_id: string }[] = [];

    // // Delete updated image in cloudinary
    if (toDelete?.length !== 0) {
      toDelete?.map(async (publicId: any) => {
        const deleteImage = await cloudinary.uploader.destroy(publicId);
      });
    }

    // Upload file to cloudinary
    if (media.image.length !== 0) {
      await Promise.all(
        media.image.map(async (fileData: any) => {
          const buffer = Buffer.from(fileData.data);

          return new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ tags: ["chuwie"] }, function (error, result) {
                if (error) {
                  reject(error);
                  return;
                }
                mediaUrl.push({
                  public_id: result?.public_id as string,
                  secure_url: result?.secure_url as string,
                });
                resolve(result);
              })
              .end(buffer);
          });
        })
      );
    }

    const filteredMedia = currentMedia.filter(
      (mediaItem) =>
        !toDelete?.some((publicId) => publicId === mediaItem.public_id)
    );

    const updatedMedia = JSON.stringify([...filteredMedia, ...mediaUrl]);

    const updatePostResult = await xataClient.transactions.run([
      {
        update: {
          table: "Post",
          id: post_id,
          fields: {
            content,
          },
        },
      },
      {
        update: {
          table: "Post",
          id: post_id,
          fields: {
            media: updatedMedia,
          },
        },
      },
    ]);

    return new Response(
      JSON.stringify({
        message: "Post Updated successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error while updating post:", error);
    return new Response(
      JSON.stringify({ message: "Could not update images" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
