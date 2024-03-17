"use server";

import { getXataClient } from "@/xata";

const xataClient = getXataClient();

export const getInitialPost = async () => {
  try {
    const pageSize = 3;
    const post = await xataClient.db.Post.sort(
      "xata.createdAt",
      "desc"
    ).getPaginated({ pagination: { size: pageSize } });

    // Preprocess posts
    const processedPosts = post.records.map((record) => {
      // Convert xata to plain object
      const xata = { ...record.xata };
      return { ...record, xata };
    });

    const hasNextPage = post.hasNextPage();
    return { posts: processedPosts, hasNextPage };
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    throw error;
  }
}

export const getAllPost = async (page: number = 2, pageSize: number = 3) => {
  try {
    const offset = (page - 1) * pageSize;
    const post = await xataClient.db.Post.sort(
      "xata.createdAt",
      "desc"
    ).getPaginated({ pagination: { size: pageSize, offset } });

    // Preprocess posts
    const processedPosts = post.records.map((record) => {
      // Convert xata to plain object
      const xata = { ...record.xata };
      return { ...record, xata };
    });

    const hasNextPage = post.hasNextPage();
    return { posts: processedPosts, hasNextPage };
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    throw error;
  }
};
