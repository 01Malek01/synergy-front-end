import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetUserPosts = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getUserPostsReq = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user-posts`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err: unknown) {
      console.log(err);
    }
  };
  const { data: userPosts, isLoading } = useQuery({
    queryFn: getUserPostsReq,
    queryKey: ["posts"],
  });
  return { userPosts, isLoading };
};

export default useGetUserPosts;
