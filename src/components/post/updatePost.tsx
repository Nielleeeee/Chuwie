/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import FormModal from "@/components/modal/formModal";
import { useQueryClient } from "@tanstack/react-query";
import ReactPlayer from "react-player";

export default function UpdatePost({ currentData }: any) {
  const [previews, setPreviews] = useState<any[]>([]);
  const [previewVideo, setPreviewsVideo] = useState<any[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const queryClient = useQueryClient();

  const formik = useFormik<UpdatePost>({
    initialValues: {
      content: currentData.content,
      media: {
        image: [],
        video: [],
      },
      toDelete: [],
    },

    validationSchema: Yup.object({
      content: Yup.string().required(),
      media: Yup.object(),
    }),

    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        const imageFiles = await Promise.all(
          values.media.image.map(async (file: File) => {
            const arrayBuffer = await file.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);
            const filename = file.name.replace(/\.[^/.]+$/, "");
            return {
              data: imageBuffer,
              mimetype: file.type,
              filename,
            };
          })
        );

        const videoFiles = await Promise.all(
          values.media.video.map(async (file: File) => {
            const arrayBuffer = await file.arrayBuffer();
            const videoBuffer = Buffer.from(arrayBuffer);
            const filename = file.name.replace(/\.[^/.]+$/, "");
            return {
              data: videoBuffer,
              mimetype: file.type,
              filename,
            };
          })
        );

        const postData = {
          ...values,
          media: [...imageFiles, ...videoFiles],
          post_id: currentData.id,
          currentMedia: currentData.media,
        };

        const updatePost = fetch("/api/update-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        await toast.promise(updatePost, {
          pending: "Updating post... 🙄",
          success: "Post updated. 👌",
          error: "Something went wrong. 😱",
        });

        const response = await updatePost;

        if (!response.ok) {
          resetForm();
          setPreviews([]);
          setIsOpenModal(false);

          throw new Error("Failed to update post");
        }

        queryClient.invalidateQueries({
          queryKey: ["allPosts"],
        });

        queryClient.invalidateQueries({
          queryKey: ["allUserPosts"],
        });

        resetForm();
        setPreviews([]);
        setIsOpenModal(false);
      } catch (error) {
        console.error("Error while updating post:", error);
      }
    },
  });

  useEffect(() => {
    const imagePreviews = currentData.media
      .filter((mediaItem: MediaItem) => mediaItem.type.startsWith("image/"))
      .map((mediaItem: MediaItem) => ({
        url: mediaItem.url,
        fileName: mediaItem.fileName,
      }));

    const videoPreviews = currentData.media
      .filter((mediaItem: MediaItem) => mediaItem.type.startsWith("video/"))
      .map((mediaItem: MediaItem) => ({
        url: mediaItem.url,
        fileName: mediaItem.fileName,
      }));

    setPreviews(imagePreviews);
    setPreviewsVideo(videoPreviews);
  }, [currentData.media]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter the accepted files into images and videos
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      const videoFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("video/")
      );

      // Update image previews state with URLs of dropped image files
      const imagePreviews = imageFiles.map((file) => ({
        url: URL.createObjectURL(file),
        fileName: null,
      }));

      // Update video previews state with URLs of dropped video files
      const videoPreviews = videoFiles.map((file) => ({
        url: URL.createObjectURL(file),
        fileName: null,
      }));

      // Update the preview states and formik values
      setPreviews((prevPreviews) => [...prevPreviews, ...imagePreviews]);
      setPreviewsVideo((prevPreviews) => [...prevPreviews, ...videoPreviews]);

      formik.setFieldValue("media.image", [
        ...formik.values.media.image,
        ...imageFiles,
      ]);

      formik.setFieldValue("media.video", [
        ...formik.values.media.video,
        ...videoFiles,
      ]);
    },
    [formik]
  );

  const removePreview = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
    fileName?: string
  ) => {
    event.stopPropagation();
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

    const updatedMedia = formik.values.media.image.filter(
      (_, i) => i !== index
    );
    const toDeleteMedia = [...(formik.values.toDelete as []), fileName];

    formik.setFieldValue("toDelete", toDeleteMedia);
    formik.setFieldValue("media.image", updatedMedia);
  };

  const removePreviewVideo = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
    fileName?: string
  ) => {
    event.stopPropagation();

    setPreviewsVideo((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );

    const updatedMedia = formik.values.media.video.filter(
      (_, i) => i !== index
    );
    const toDeleteMedia = [...(formik.values.toDelete as []), fileName];

    formik.setFieldValue("toDelete", toDeleteMedia);
    formik.setFieldValue("media.video", updatedMedia);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 10,
    accept: {
      "image/*": [],
      "video/mp4": [".mp4"],
      "video/mpeg": [".mpeg"],
      "video/webm": [".webm"],
    },
    maxSize: 1024 * 100000,
    multiple: true,
  });

  return (
    <>
      <button
        className="flex gap-2 justify-start items-center bg-white hover:bg-gray-200 p-2 rounded-md"
        title="Update Post"
        onClick={() => setIsOpenModal(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-black fill-none h-6 w-6"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>

        <span className="hidden sm:flex text-black font-medium">Edit</span>
      </button>

      <FormModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        modalTitle={"Update post"}
        onRequestClose={() => {
          // Reset form values to initial values when modal is closed
          formik.resetForm();

          // Reset previews to initial previews
          const imagePreviews = currentData.media
            .filter((mediaItem: MediaItem) =>
              mediaItem.type.startsWith("image/")
            )
            .map((mediaItem: MediaItem) => ({
              url: mediaItem.url,
              fileName: mediaItem.fileName,
            }));

          const videoPreviews = currentData.media
            .filter((mediaItem: MediaItem) =>
              mediaItem.type.startsWith("video/")
            )
            .map((mediaItem: MediaItem) => ({
              url: mediaItem.url,
              fileName: mediaItem.fileName,
            }));

          setPreviews(imagePreviews);
          setPreviewsVideo(videoPreviews);
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="col-span-full">
              <label
                htmlFor="media"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Caption
              </label>

              <textarea
                name="content"
                id=""
                rows={4}
                className={`w-full rounded bg-white p-2 ${
                  formik.touched.content && formik.errors.content
                    ? "border-red-400 border-2"
                    : "border-gray-900/25 border"
                }`}
                value={formik.values.content}
                onChange={formik.handleChange}
              />
            </div>

            <div className="col-span-full">
              <label
                htmlFor="media"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Add Photo
              </label>
              <div
                className={`mt-2 flex justify-center rounded-lg border px-6 py-10
                  ${
                    formik.touched.media && formik.errors.media
                      ? "border-red-400 border-2"
                      : "border-gray-900/25 border-dashed"
                  }`}
              >
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="media"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} name="media" />
                        {previews.length !== 0 || previewVideo.length !== 0 ? (
                          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                            {previews.map((preview, index) => (
                              <div className="relative" key={index}>
                                <button
                                  type="button"
                                  onClick={(event) =>
                                    removePreview(
                                      event,
                                      index,
                                      preview.fileName
                                    )
                                  }
                                  className="p-2 rounded-full absolute -top-4 -right-4 bg-slate-800 z-10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                    className="w-4 h-4 stroke-white/80"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18 18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>

                                <img
                                  src={preview.url}
                                  alt="Preview"
                                  className="preview-image w-full max-w-[200px] h-auto object-cover rounded"
                                />
                              </div>
                            ))}

                            {/* Video Preview */}
                            {previewVideo.map((preview, index) => (
                              <div className="relative" key={index}>
                                <button
                                  type="button"
                                  onClick={(event) =>
                                    removePreviewVideo(
                                      event,
                                      index,
                                      preview.fileName
                                    )
                                  }
                                  className="p-2 rounded-full absolute -top-4 -right-4 bg-slate-800 z-10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="3"
                                    className="w-4 h-4 stroke-white/80"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18 18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>

                                <ReactPlayer
                                  controls
                                  url={preview.url}
                                  height={"auto"}
                                  style={{
                                    width: "100%",
                                    maxWidth: "200px",
                                    height: "auto",
                                    aspectRatio: "16/9",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 mx-auto"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                        )}
                        <p>Upload a Featured Photo</p>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, JPEG up to 3MB
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
              className="w-full rounded-md text-lg font-medium px-2 py-1 bg-purple-400 disabled:bg-purple-800/60 disabled:cursor-not-allowed text-white"
            >
              {formik.isSubmitting ? "Updating...🙄" : "Update"}
            </button>
          </div>
        </form>
      </FormModal>
    </>
  );
}
