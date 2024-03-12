import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getXataClient } from "@/xata";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, media } = body;

  const xataClient = getXataClient();

  try {
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
              resolve(result);
            })
            .end(buffer);
        });
      })
    );

    uploadedMedia.map((result) => {
      console.log(result.secure_url);
    })

    return new Response(
      JSON.stringify({
        message: "Images uploaded successfully",
        uploadedMedia,
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
