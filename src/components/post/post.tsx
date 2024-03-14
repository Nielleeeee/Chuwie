import React from "react";
import Image from "next/image";

export default function Post({ allPostData }: any) {
  return (
    <section className="flex flex-col gap-8">
      {allPostData.length !== 0 &&
        allPostData.map((post: PostData, index: number) => (
          <div key={index} className="rounded-md bg-white p-4 shadow-md">
            <h3>{post.author_fullname}</h3>
            <p className="mb-4">{post.content}</p>

            <figure className="flex flex-row gap-2 w-full overflow-hidden">
              {post.media.length !== 0 &&
                post.media.map((url: string, key: number) => (
                  <Image
                    key={key}
                    src={url}
                    alt={post.author_username ?? ""}
                    width={1000}
                    height={1000}
                    className="w-full max-h-[500px] object-cover rounded"
                  />
                ))}
            </figure>
          </div>
        ))}
    </section>
  );
}
