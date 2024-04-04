import React from "react";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MediaList({ postData }: any) {
  return (
    <figure className="w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {postData.media.length !== 0 &&
          postData.media.map((item: { secure_url: string }, key: number) => (
            <SwiperSlide key={key}>
              <div className="w-full flex justify-center items-center overflow-hidden">
                <Image
                  src={item.secure_url}
                  alt={postData.author_username ?? ""}
                  width={1000}
                  height={1000}
                  className="w-full max-h-[500px] object-cover rounded"
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </figure>
  );
}
