"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserProfile } from "@clerk/nextjs";
import NoBodyModal from "@/components/modal/noBodyModal";

export default function UserInfo(userInfo: UserInfo) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <section className="relative p-4 my-10 mx-auto w-full max-w-xs bg-white rounded-3xl shadow-md flex items-center justify-center">
      <Image
        src={userInfo.profile_picture || ""}
        alt={userInfo.username || ""}
        height={100}
        width={100}
        className="absolute h-20 w-20 -top-10 rounded-full"
      />

      <h2 className="text-black font-bold text-lg pt-10">
        {userInfo.first_name} {userInfo.last_name} ({userInfo.username})
      </h2>

      <button
        className="absolute top-4 right-4 flex gap-2 justify-start items-center bg-white hover:bg-gray-200 p-2 rounded-md"
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
      </button>

      <NoBodyModal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
        <UserProfile  appearance={{
          elements: {
            rootBox: "p-10 mx-4",
          },
        }}/>
      </NoBodyModal>
    </section>
  );
}
