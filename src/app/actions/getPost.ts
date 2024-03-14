"use server";

import { getXataClient } from "@/xata";
import { revalidatePath } from "next/cache";

const xataClient = getXataClient();

export const getAllPost = async () => {
  try {
    const post = await xataClient.db.Post.sort('xata.createdAt', 'desc').getMany();

    revalidatePath("/");

    return post;
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    throw error;
  }
};
