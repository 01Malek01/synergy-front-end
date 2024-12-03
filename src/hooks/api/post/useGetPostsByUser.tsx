import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetPostsByUser = (id: string) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getPostsByUserReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/posts/${id}/user-posts`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { isLoading, data: posts } = useQuery({
    queryFn: getPostsByUserReq,
    queryKey: ["posts", id],
  });

  return { posts, isLoading };
};

export default useGetPostsByUser;
