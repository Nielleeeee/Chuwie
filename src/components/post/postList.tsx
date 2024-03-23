import React from "react";
import Image from "next/image";
import { TransitionMoveUp } from "@/components/animation/transition";
import DateFormat from "@/app/lib/date-format";
import DeletePost from "@/components/post/deletePost";
import { useAuth } from "@clerk/nextjs";

export default function PostList({ PostData }: any) {
  const { userId } = useAuth();

  return (
    <>
      {PostData?.length !== 0 &&
        PostData?.map((post: any, index: number) => (
          <TransitionMoveUp key={index}>
            <div className="relative rounded-md bg-white p-4 my-4 shadow-md">
              {userId == post.user_id && (
                <DeletePost
                  postId={post.id}
                  postMediaID={[]}
                  className="absolute top-4 right-4"
                />
              )}

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
