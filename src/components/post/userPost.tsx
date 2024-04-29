"use client";

import React, { useEffect } from "react";
import { useGetAllUserPost } from "@/app/data/get-post";
import { useInView } from "react-intersection-observer";
import { PostLoader } from "@/components/loaders/loader";
import PostList from "@/components/post/postList";

export default function UserPost({ username }: { username: string }) {
  const { ref, inView } = useInView();
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetAllUserPost(username);

  const allUserPosts = data?.pages.flatMap((page) => page.posts) || [];

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
      <PostList PostData={allUserPosts} />

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
