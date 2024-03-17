import { getInitialPost } from "@/app/actions/getPost";
import { useQuery } from "@tanstack/react-query";

export const useGetInitialPost = () => {
  return useQuery({
    queryFn: async () => getInitialPost(),
    queryKey: ["posts"],
  })
}