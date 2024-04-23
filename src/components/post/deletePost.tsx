"use client";

import React, { useState } from "react";
import { handleDeletePost } from "@/app/actions/post/deletePost";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import DialogModal from "@/components/modal/dialog";

export default function DeletePost({ postId, postMedia }: DeletePostParams) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deletePost = async () => {
    const deletePostResponse = handleDeletePost({ postId, postMedia });
    setIsDeleting(true);

    await toast.promise(deletePostResponse, {
      pending: "Deleting Post... 🙄",
      success: "Post Deleted. 👌",
      error: "Something went wrong. 😱",
    });

    const response = await deletePostResponse;

    if (!response.status) {
      console.error(response.error);
    }

    setIsOpenModal(false);
    setIsDeleting(false);

    queryClient.invalidateQueries({ queryKey: ["allPosts"] });
  };

  return (
    <>
      <button
        className="flex gap-2 justify-start items-center bg-white hover:bg-red-200 p-2 rounded-md"
        onClick={() => setIsOpenModal(true)}
        title="Delete Post"
      >
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

        <span className="hidden sm:flex text-red-400 font-medium">Delete</span>
      </button>

      <DialogModal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              ></path>
            </svg>
          </div>

          <h3 className="font-semibold text-xl">Delete Post</h3>

          <p className="font-medium text-center">
            Are you sure you want to permanently delete this post? This action
            cannot be undone. 🤔
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setIsOpenModal(false)}
              className="px-3 py-2 rounded-lg border hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={deletePost}
              className="px-3 py-2 rounded-lg bg-red-400 hover:bg-red-500 text-white"
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </div>
      </DialogModal>
    </>
  );
}
