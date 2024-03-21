"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useGetAllPost } from "@/app/data/get-post";
import { TransitionMoveUp } from "@/components/animation/transition";
import { useInView } from "react-intersection-observer";
import { PostLoader } from "@/components/loaders/loader";
import DateFormat from "@/app/lib/date-format";
import PostList from "./postList";

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
      <PostList PostData={allPosts} />

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
