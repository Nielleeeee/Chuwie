"use client";

import React, { useEffect } from "react";
import { useGetAllUserPost } from "@/app/data/get-post";
import { useInView } from "react-intersection-observer";
import { PostLoader } from "@/components/loaders/loader";

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

  return (
    <div>userPost</div>
  )
}
