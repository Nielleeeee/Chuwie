"use server";

import { v2 as cloudinary } from "cloudinary";

export async function handleCreatePost(values: CreatePost) {
  try {
    console.log(values);
  } catch (error) {
    console.error("Failed to create post: ", error);
    throw error;
  }
}
