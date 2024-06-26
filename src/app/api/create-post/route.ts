import type { NextRequest } from "next/server";
import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { signedUrl } from "@/app/actions/aws/signedUrl";
import pako from "pako";

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
  try {
    const arrayBuffer = await req.arrayBuffer();
    const compressedData = new Uint8Array(arrayBuffer);

    const decompressData = pako.inflate(compressedData, { to: "string" });

    const body = JSON.parse(decompressData);

    const { content, media } = body;

    const xataClient = getXataClient();

    const user = await currentUser();
    const author_id = (user?.publicMetadata.user_id as string) || "";

    const mediaObject: MediaItem[] = [];

    const uploadMediaS3 = await Promise.all(
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
            timestamp: new Date().toISOString(),
          });

          return { success: true, media: fileName, mediaType: media.mimetype };
        } catch (error) {
          console.error(`Error uploading ${media.filename} to S3:`, error);
          return { success: false, media: fileName };
        }
      })
    );

    // Insert Data to xata database
    const postData = {
      content,
      media: mediaObject,
      author: author_id,
    };

    const createPostResult = await xataClient.db.Post.create(postData);

    // console.log(createPostResult);

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

// Upload image to cloudinary
// await Promise.all(
//   image.map(async (fileData: any) => {
//     const buffer = Buffer.from(fileData.data);

//     return new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream({ tags: ["chuwie"] }, function (error, result) {
//           if (error) {
//             reject(error);
//             return;
//           }
//           mediaUrl.push({
//             secure_url: result?.secure_url as string,
//             public_id: result?.public_id as string,
//           });
//           resolve(result);
//         })
//         .end(buffer);
//     });
//   })
// );
