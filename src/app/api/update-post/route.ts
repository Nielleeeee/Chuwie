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
  const { content, media, post_id, toDelete } = body;

  const xataClient = getXataClient();

  try {
    const mediaUrl: { secure_url: string; public_id: string }[] = [];

    // Delete updated image in cloudinary
    if (toDelete?.length !== 0) {
      toDelete?.map(async (media: any) => {
        const deleteImage = await cloudinary.uploader.destroy(media.public_id);
      });
    }

    // Upload file to cloudinary
    if (media.length !== 0) {
      await Promise.all(
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
    }

    const updatePost = await xataClient.sql`
      BEGIN;
    
      -- Step 1: Delete media objects with matching public_id from the media array
      UPDATE Post
      SET media = jsonb_agg(media_item)
      FROM (
        SELECT jsonb_array_elements(media) AS media_item
        WHERE NOT (media_item->>'public_id' = ANY (${toDelete}))
      ) AS media_filtered
      WHERE id = ${post_id};
    
      -- Step 2: Append new media URLs to the media array
      UPDATE Post
      SET media = media || ${mediaUrl}
      WHERE id = ${post_id};

      -- Step 3: Update Content
      UPDATE Post
      SET content = ${content}
      WHERE id = ${post_id}
    
      COMMIT;
    `;

    console.log(updatePost);

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
