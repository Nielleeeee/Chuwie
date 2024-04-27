import React from "react";
import Image from "next/image";

export default function UserInfo(userInfo: UserInfoProps) {
  return (
    <section>
      <Image
        src={userInfo.profile_picture || ""}
        alt={userInfo.username || ""}
        height={100}
        width={100}
      />
      <h2>
        {userInfo.first_name} {userInfo.last_name} ({userInfo.username})
      </h2>
    </section>
  );
}
