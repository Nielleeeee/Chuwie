import React from "react";
import { TransitionMoveUp } from "@/components/animation/transition";
import DateFormat from "@/app/lib/date-format";
import DeletePost from "@/components/post/deletePost";
import { useAuth } from "@clerk/nextjs";
import UpdatePost from "@/components/post/updatePost";
import KebabDropdown from "@/components/ui/dropdown/kebabDropdown";
import MediaList from "@/components/post/mediaList";
import Image from "next/image";
import Link from "next/link";

export default function PostList({ PostData }: any) {
  const { userId } = useAuth();

  return (
    <>
      {PostData?.length !== 0 &&
        PostData?.map((post: any, index: number) => (
          <TransitionMoveUp key={index}>
            <div className="relative rounded-md bg-white p-4 my-4 shadow-md">
              <div className="flex mb-4">
                <Link
                  href={`profile/${post.author.username}`}
                  className="flex flex-row items-center w-full"
                >
                  <Image
                    src={post.author.profile_picture}
                    alt={post.author_username}
                    height={100}
                    width={100}
                    className="rounded-full h-10 w-10 mr-2"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {post.author.first_name} {post.author.last_name}
                    </h3>
                    <DateFormat date={post.xata.createdAt} />
                  </div>
                </Link>

                {userId == post.author.clerk_id && (
                  <KebabDropdown>
                    <UpdatePost key={index} currentData={post} />

                    <DeletePost postId={post.id} postMedia={post.media} />
                  </KebabDropdown>
                )}
              </div>

              <p className="mb-4">{post.content}</p>

              <MediaList postData={post} />
            </div>
          </TransitionMoveUp>
        ))}
    </>
  );
}
