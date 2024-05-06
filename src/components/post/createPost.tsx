/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import FormModal from "@/components/modal/formModal";
import { useQueryClient } from "@tanstack/react-query";
import ReactPlayer from "react-player";

export default function CreatePost() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewVideo, setPreviewsVideo] = useState<string[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const queryClient = useQueryClient();

  const formik = useFormik<CreatePost>({
    initialValues: {
      content: "",
      media: {
        image: [],
        video: [],
      },
    },

    validationSchema: Yup.object({
      content: Yup.string().required(),
      media: Yup.object(),
    }),

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
        };

        const createPost = fetch("/api/create-post", {
          method: "POST",
          body: JSON.stringify(postData),
        });

        await toast.promise(createPost, {
          pending: "Creating Post... 🙄",
          success: "Post Created. 👌",
          error: "Something went wrong. 😱",
        });

        const response = await createPost;

        if (!response.ok) {
          resetForm();
          setPreviews([]);
          setPreviewsVideo([]);
          setIsOpenModal(false);

          throw new Error("Failed to create post");
        }

        queryClient.invalidateQueries({
          queryKey: ["allPosts"],
        });

        queryClient.invalidateQueries({
          queryKey: ["allUserPosts"],
        });

        resetForm();
        setPreviews([]);
        setPreviewsVideo([]);
        setIsOpenModal(false);
      } catch (error) {
        console.error("Error while creating post:", error);
      }
    },
  });

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
      const imagePreviews = imageFiles.map((file) => URL.createObjectURL(file));

      // Update video previews state with URLs of dropped video files
      const videoPreviews = videoFiles.map((file) => URL.createObjectURL(file));

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
    index: number
  ) => {
    event.stopPropagation();

    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

    const updatedMedia = formik.values.media.image.filter(
      (_, i) => i !== index
    );

    formik.setFieldValue("media.image", updatedMedia);
  };

  const removePreviewVideo = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.stopPropagation();

    setPreviewsVideo((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );

    const updatedMedia = formik.values.media.video.filter(
      (_, i) => i !== index
    );

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
    <div className="fixed bottom-20 right-[20px] flex flex-col gap-5 z-20">
      <button
        className="absolute top-4 right-2 group cursor-pointer outline-none hover:rotate-90 duration-300"
        title="Create Post"
        onClick={() => setIsOpenModal(true)}
      >
        <svg
          className="stroke-purple-500 fill-none group-hover:fill-purple-800 group-active:stroke-purple-200 group-active:fill-purple-600 group-active:duration-0 duration-300"
          viewBox="0 0 24 24"
          height="50px"
          width="50px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeWidth="1.5"
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          ></path>
          <path strokeWidth="1.5" d="M8 12H16"></path>
          <path strokeWidth="1.5" d="M12 16V8"></path>
        </svg>
      </button>

      <FormModal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        modalTitle={"Create post"}
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
                          <div className="flex flex-row flex-wrap items-center justify-center gap-5">
                            {/* Image Preview */}
                            {previews.map((preview, index) => (
                              <div className="relative" key={index}>
                                <button
                                  type="button"
                                  onClick={(event) =>
                                    removePreview(event, index)
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
                                  src={preview}
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
                                    removePreviewVideo(event, index)
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
                                  url={preview}
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
              disabled={formik.isSubmitting || !formik.isValid}
              className="w-full rounded-md text-lg font-medium px-2 py-1 bg-purple-400 disabled:bg-purple-800/60 disabled:cursor-not-allowed text-white"
            >
              {formik.isSubmitting ? "Posting...🙄" : "Post"}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}
