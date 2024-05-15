import { signedUrl } from "./signedUrl";

export const updateSignedUrl = async (mediaItems: MediaItem[]) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return Promise.all(
    mediaItems.map(async (mediaItem: MediaItem) => {
      if (new Date(mediaItem.timestamp) > sevenDaysAgo) {
        const updatedUrl = await signedUrl(mediaItem.fileName);
        return {
          ...mediaItem,
          url: updatedUrl,
        };
      }
      return mediaItem;
    })
  );
};
