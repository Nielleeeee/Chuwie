import { getInitialPost, getAllPost } from "@/app/actions/post/getPost";
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
