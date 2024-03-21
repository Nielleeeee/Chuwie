import React from "react";
import Image from "next/image";
import { TransitionMoveUp } from "@/components/animation/transition";
import DateFormat from "@/app/lib/date-format";

export default function PostList({ PostData }: any) {
  return (
    <>
      {PostData?.length !== 0 &&
        PostData?.map((post: any, index: number) => (
          <TransitionMoveUp key={index}>
            <div className="rounded-md bg-white p-4 my-4 shadow-md">
              <h3>{post.author_fullname}</h3>
              <DateFormat date={post.xata.createdAt} />
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
          </TransitionMoveUp>
        ))}
    </>
  );
}
