import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getXataClient } from "@/xata";
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { signedUrl } from "@/app/actions/aws/signedUrl";
import crypto from "crypto";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client([
  {
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  },
]);

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, media, post_id, toDelete, currentMedia }: UpdatePostRoute =
    body;

  const xataClient = getXataClient();

  try {
    const mediaObject: {
      fileName: string;
      type: string;
      url: string;
    }[] = [];

    // // Delete updated image in cloudinary
    if (toDelete?.length !== 0) {
      toDelete?.map(async (media: any) => {
        const deleteParams = {
          Bucket: bucketName,
          Key: media,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
      });
    }

    // Upload media to S3
    if (media.length !== 0) {
      await Promise.all(
        media.map(async (media: CombinedMedia) => {
          const mediaBuffer = Buffer.from(media.data);

          const fileName = generateFileName();

          const params = {
            Bucket: bucketName,
            Body: mediaBuffer,
            Key: fileName,
            ContentType: media.mimetype,
          };

          try {
            await s3Client.send(new PutObjectCommand(params));

            const mediaUrl = await signedUrl(fileName);

            mediaObject.push({
              fileName,
              type: media.mimetype,
              url: mediaUrl,
            });

            return {
              success: true,
              media: fileName,
              mediaType: media.mimetype,
            };
          } catch (error) {
            console.error(`Error uploading ${media.filename} to S3:`, error);
            return { success: false, media: fileName };
          }
        })
      );
    }

    const filteredMedia = currentMedia.filter(
      (mediaItem) =>
        !toDelete?.some((fileName) => fileName === mediaItem.fileName)
    );

    const updatedMedia = JSON.stringify([...filteredMedia, ...mediaObject]);

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
