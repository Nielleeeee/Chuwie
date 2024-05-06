import type { NextRequest } from "next/server";
import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto'

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

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { content, media } = body;

  const xataClient = getXataClient();

  const user = await currentUser();
  const author_id = (user?.publicMetadata.user_id as string) || "";

  try {
    const mediaName: {
      secure_url: string;
      public_id: string;
      format?: string;
    }[] = [];

    const uploadMediaS3 = await Promise.all(
      media.map(async (media: CombinedMedia) => {
        const mediaBuffer = Buffer.from(media.data);

        const fileName = generateFileName()

        const params = {
          Bucket: bucketName,
          Body: mediaBuffer,
          Key: fileName,
          ContentType: media.mimetype,
        };

        try {
          await s3Client.send(new PutObjectCommand(params));

          return { success: true, media: fileName };
        } catch (error) {
          console.error(`Error uploading ${media.filename} to S3:`, error);
          return { success: false, media: fileName };
        }
      })
    );

    console.log(uploadMediaS3);

    // Insert Data to xata database
    const postData = {
      content,
      media: uploadMediaS3.map((item) => item.media),
      author: author_id,
    };

    const createPostResult = await xataClient.db.Post.create(postData);

    console.log(createPostResult);

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
