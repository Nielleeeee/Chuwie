"use server";

import { getXataClient } from "@/xata";
import { signedUrl } from "@/app/actions/aws/signedUrl";
import { updateSignedUrl } from "@/app/actions/aws/updateSignedUrl";

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
};

export const getMorePost = async (page: number = 2, pageSize: number = 3) => {
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

export const getAllPost = async (pageParam: number, pageSize = 3) => {
  try {
    const offset = (pageParam - 1) * pageSize;
    const post = await xataClient.db.Post.select(["*", "author.*"])
      .sort("xata.createdAt", "desc")
      .getPaginated({ pagination: { size: pageSize, offset } });

    // Preprocess posts
    const processedPosts = await Promise.all(
      post.records.map(async (record) => {
        const author = { ...record.author };
        const xata = { ...record.xata };

        const updatedMedia = await updateSignedUrl(record.media, record.id);

        return { ...record, xata, author, media: updatedMedia };
      })
    );

    const hasNextPage = post.hasNextPage();
    return { posts: processedPosts, hasNextPage };
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    throw error;
  }
};

export const getAllUserPost = async (
  { pageParam = 1 },
  pageSize = 3,
  authorUsername: string
) => {
  try {
    const offset = (pageParam - 1) * pageSize;
    const post = await xataClient.db.Post.select(["*", "author.*"])
      .filter({
        "author.username": authorUsername,
      })
      .sort("xata.createdAt", "desc")
      .getPaginated({ pagination: { size: pageSize, offset } });

    // Preprocess posts
    const processedPosts = await Promise.all(
      post.records.map(async (record) => {
        const author = { ...record.author };
        const xata = { ...record.xata };

        const updatedMedia = await updateSignedUrl(record.media, record.id);

        return { ...record, xata, author, media: updatedMedia };
      })
    );

    const hasNextPage = post.hasNextPage();
    return { posts: processedPosts, hasNextPage };
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    throw error;
  }
};
