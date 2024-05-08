"use server";

import { getXataClient } from "@/xata";
import { signedUrl } from "@/app/actions/aws/signedUrl";

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

        // Map over each media and get the signed URL for each
        const signedUrlMedia = await Promise.all(
          record.media.map(async (media: any) => {
            const mediaUrl = await signedUrl(media.fileName);
            return {
              type: media.type,
              fileName: media.fileName,
              mediaUrl: mediaUrl,
            };
          })
        );

        return { ...record, xata, author, media: signedUrlMedia };
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

        // Map over each media and get the signed URL for each
        const signedUrlMedia = await Promise.all(
          record.media.map(async (media: any) => {
            const mediaUrl = await signedUrl(media.fileName);
            return {
              type: media.type,
              fileName: media.fileName,
              mediaUrl: mediaUrl,
            };
          })
        );

        return { ...record, xata, author, media: signedUrlMedia };
      })
    );

    const hasNextPage = post.hasNextPage();
    return { posts: processedPosts, hasNextPage };
  } catch (error) {
    console.error("Failed to fetch post: ", error);
    throw error;
  }
};
