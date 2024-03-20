"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useGetAllPost } from "@/app/data/get-post";
import { TransitionMoveUp } from "@/components/animation/transition";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPost } from "@/app/actions/getPost";
import { useInView } from "react-intersection-observer";
import { PostLoader } from "@/components/loaders/loader";
import DateFormat from "@/app/lib/date-format";

export default function Post() {
  const { ref, inView } = useInView();
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetAllPost();

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  return status === "pending" ? (
    <PostLoader />
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <section className="flex flex-col">
      {allPosts?.length !== 0 &&
        allPosts?.map((post: any, index: number) => (
          <TransitionMoveUp key={index}>
            <div className="rounded-md bg-white p-4 my-4 shadow-md">
              <h3>{post.author_fullname}</h3>
              <p className="mb-4">{post.content}</p>
              <DateFormat date={post.xata.createdAt} />

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

      {hasNextPage || isFetchingNextPage ? (
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
    </section>
  );
}
