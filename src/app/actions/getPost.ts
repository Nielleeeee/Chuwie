"use server";

import { getXataClient } from "@/xata";

const xataClient = getXataClient();

export async function getAllPost() {
  try {
    const post = await xataClient.db.Post.getMany();
    
    return post;
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    throw error;
  }
}
