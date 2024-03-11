"use server";

import { v2 as cloudinary } from "cloudinary";

export async function handleCreatePost(data?: any) {
  try {
    // Simulate an asynchronous operation (e.g., API call) with a timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    // Assuming the operation was successful, you can return some data or a success message
    return { success: true, message: "Post created successfully" };
  } catch (error) {
    console.error("Failed to create post: ", error);
    throw error;
  }
}
