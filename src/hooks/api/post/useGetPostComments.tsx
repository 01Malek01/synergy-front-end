import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetPostComments = (postId: string) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getPostCommentsReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/posts/${postId}/comment`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err: unknown) {
      // Cast the error to AxiosError if it matches the shape
      console.log(err);
    }
  };

  const { data: comments, isLoading } = useQuery({
    queryFn: getPostCommentsReq,
    queryKey: ["comments", postId],
    refetchIntervalInBackground: true,
    // refetchInterval: 30000,
  });

  return { comments, isLoading };
};

export default useGetPostComments;
