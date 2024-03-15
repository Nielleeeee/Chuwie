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
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-purple-400 animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-purple-400 animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-purple-400 animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
};
