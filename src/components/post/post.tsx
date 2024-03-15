import React from "react";
import Image from "next/image";

export default function Post({ allPostData }: any) {
  const allPost = allPostData.posts;

  return (
    <section className="flex flex-col">
      {allPost.length !== 0 &&
        allPost.map((post: PostData, index: number) => (
          <div key={index} className="rounded-md bg-white p-4 my-4 shadow-md">
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
