import {
  getInitialPost,
  getAllPost,
  getAllUserPost,
} from "@/app/actions/post/getPost";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useGetInitialPost = () => {
  return useQuery({
    queryFn: async () => getInitialPost(),
    queryKey: ["posts"],
  });
};

export const useGetAllPost = () => {
  return useInfiniteQuery({
    queryKey: ["allPosts"],
    queryFn: ({ pageParam = 1 }) => getAllPost({ pageParam }) as any,
    initialPageParam: 1,
    getNextPageParam: (allPages) => {
      const hasNextPage = allPages[allPages.length - 1]?.hasNextPage;
      return hasNextPage ? allPages.length + 1 : undefined;
    },
  });
};

export const useGetAllUserPost = (username: string) => {
  return useInfiniteQuery({
    queryKey: ["allPosts"],
    queryFn: ({ pageParam = 1 }, pageSize = 3) =>
      getAllUserPost({ pageParam }, pageSize, username) as any,
    initialPageParam: 1,
    getNextPageParam: (allPages) => {
      const hasNextPage = allPages[allPages.length - 1]?.hasNextPage;
      return hasNextPage ? allPages.length + 1 : undefined;
    },
  });
};
