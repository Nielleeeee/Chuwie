"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PostLoader } from "../loaders/loader";
import Image from "next/image";
import { getMorePost } from "@/app/actions/post/getPost";
import { TransitionMoveUp } from "@/components/animation/transition";

export default function LoadMore() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [pageLoaded, setPageLoaded] = useState(1);
  const [hasNextPost, setHasNextPost] = useState(true);

  const { ref, inView } = useInView();

  const loadMorePost = useCallback(async () => {
    const nextPage = pageLoaded + 1;
    const { posts, hasNextPage } = (await getMorePost(nextPage)) ?? [];
    setPosts((prevPost: any[]) => [...prevPost, ...posts]);
    setPageLoaded(nextPage);
    setHasNextPost(hasNextPage);
  }, [pageLoaded, setPosts, setPageLoaded]);

  useEffect(() => {
    if (inView) {
      loadMorePost();
    }
  }, [inView, loadMorePost]);

  return (
    <>
      <section className="flex flex-col">
        {posts.length !== 0 &&
          posts.map((post: PostData, index: number) => (
            <TransitionMoveUp key={index}>
              <div className="rounded-md bg-white p-4 my-4 shadow-md">
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
            </TransitionMoveUp>
          ))}
      </section>

      {hasNextPost ? (
        <div
          ref={ref}
          className="w-full py-10 flex justify-center items-center"
        >
          <PostLoader />
        </div>
      ) : (
        <div className="w-full text-white text-xl font-medium py-10 flex justify-center items-center">
          No more post available 😔
        </div>
      )}
    </>
  );
}
