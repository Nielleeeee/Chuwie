"use server";

import { getXataClient } from "@/xata";
import { signedUrl } from "./signedUrl";

export const updateSignedUrl = async (
  mediaItems: MediaItem[],
  postID: string
) => {
  const xataClient = getXataClient();

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const updatedMedia = await Promise.all(
      mediaItems.map(async (mediaItem: MediaItem) => {
        if (new Date(mediaItem.timestamp) > sevenDaysAgo) {
          const updatedUrl = await signedUrl(mediaItem.fileName);

          return {
            ...mediaItem,
            timestamp: new Date().toISOString(),
            url: updatedUrl,
          };
        }

        return mediaItem;
      })
    );

    // Update xata database
    const updateDb = await xataClient.db.Post.update(postID, {
      media: JSON.stringify(updatedMedia),
    });

    console.log(updateDb);

    return updatedMedia;
  } catch (error) {
    console.error("Failed to update signed url: ", error);
    throw error;
  }
};
