"use server";

import { getXataClient } from "@/xata";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

export const handleDeletePost = async ({
  postId,
  postMedia,
}: DeletePostParams) => {
  const xataClient = getXataClient();

  try {
    if (postMedia?.length !== 0) {
      postMedia?.map(async (media: any) => {
        const deleteParams = {
          Bucket: bucketName,
          Key: media.fileName,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
      });
    }

    const deletePost = await xataClient.db.Post.delete(postId);

    return { status: true, error: null };
  } catch (error) {
    console.error(error);
    return { status: null, error: error };
  }
};
