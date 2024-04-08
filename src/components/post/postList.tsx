import React from "react";
import { TransitionMoveUp } from "@/components/animation/transition";
import DateFormat from "@/app/lib/date-format";
import DeletePost from "@/components/post/deletePost";
import { useAuth } from "@clerk/nextjs";
import UpdatePost from "./updatePost";
import KebabDropdown from "../ui/dropdown/kebabDropdown";
import MediaList from "./mediaList";
import Image from "next/image";

export default function PostList({ PostData }: any) {
  const { userId } = useAuth();

  return (
    <>
      {PostData?.length !== 0 &&
        PostData?.map((post: any, index: number) => (
          <TransitionMoveUp key={index}>
            <div className="relative rounded-md bg-white p-4 my-4 shadow-md">
              <div className="flex mb-4">
                <div className="flex flex-row items-center w-full">
                  <Image src={post.userImage} alt={post.author_username} height={100} width={100} className="rounded-full h-10 w-10 mr-2" />

                  <div>
                    <h3 className="font-semibold">{post.author_fullname}</h3>
                    <DateFormat date={post.xata.createdAt} />
                  </div>
                </div>

                {userId == post.user_id && (
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
