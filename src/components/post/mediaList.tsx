"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Lightbox from "yet-another-react-lightbox";
import ReactPlayer from "react-player";

import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MediaList({ postData }: any) {
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [swiper, setSwiper] = useState<any>(null);

  const handleImageOpen = (index: number) => {
    setActiveImage(index);
    setIsOpenImage(true);
  };

  const activeImageChange = (index: number) => {
    setActiveImage(index);

    if (swiper) {
      swiper.slideTo(index);
    }
  };

  const slides = postData.media.map((image: { mediaUrl: string }) => {
    return { src: image.mediaUrl };
  });

  return (
    <figure className="w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSwiper={setSwiper}
      >
        {postData.media.length !== 0 &&
          postData.media.map(
            (item: { mediaUrl: string; type: string }, index: number) => (
              <SwiperSlide key={index} onClick={() => handleImageOpen(index)}>
                <div className="w-full flex justify-center items-center overflow-hidden">
                  {item.type.startsWith("image/") ? (
                    <Image
                      src={item.mediaUrl}
                      alt={`${postData.author.username}-image`}
                      width={1000}
                      height={1000}
                      className="w-full max-h-[500px] object-cover rounded cursor-pointer"
                      draggable={false}
                    />
                  ) : (
                    <ReactPlayer
                      controls
                      url={item.mediaUrl}
                      height={"auto"}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    />
                  )}
                </div>
              </SwiperSlide>
            )
          )}
      </Swiper>

      <Lightbox
        open={isOpenImage}
        close={() => setIsOpenImage(false)}
        slides={slides}
        index={activeImage}
        carousel={{
          finite: true,
        }}
        controller={{
          closeOnPullDown: true,
          closeOnBackdropClick: true,
          closeOnPullUp: true,
        }}
        on={{
          view: ({ index }) => activeImageChange(index),
        }}
      />
    </figure>
  );
}
