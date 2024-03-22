"use client";

import React from "react";
import { handleDeletePost } from "@/app/actions/deletePost";

interface DeletePost {
  postId: number;
  className?: string;
}

export default function DeletePost({ postId, className }: DeletePost) {
  const deletePost = async () => {
    await handleDeletePost({ postId });
  };

  return (
    <button className={`${className}`} onClick={deletePost} title="Delete Post">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-trash-2 stroke-red-400 fill-none h-6 w-6"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    </button>
  );
}
