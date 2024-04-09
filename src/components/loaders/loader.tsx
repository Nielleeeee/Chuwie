import React from "react";

export const GradiantLoader = () => {
  return (
    <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 h-32 w-32 aspect-square rounded-full">
      <div className="rounded-full h-full w-full bg-slate-100 background-blur-md"></div>
    </div>
  );
};

export const AvatarLoader = () => {
  return <div className="rounded-full w-8 h-8 animate-pulse bg-gray-400"></div>;
};

export const PostLoader = () => {
  return (
    <div className="rounded-md w-full h-[600px] bg-white/80 animate-pulse p-4 my-4 shadow-md">
      <div className="flex items-center space-x-2 my-4">
        <div className="animate-pulse rounded-full bg-gray-500 h-10 w-10"></div>
        <div className="space-y-2">
          <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[200px]">
            {" "}
          </div>
          <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[100px]">
            {" "}
          </div>
        </div>
      </div>

      <div className="animate-pulse rounded-md bg-gray-500 w-full h-full max-h-[500px]">
        {" "}
      </div>
    </div>
  );
};
